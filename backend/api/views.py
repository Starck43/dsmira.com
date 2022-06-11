# views.py
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
# from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import views, viewsets #, generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions

from .serializers import *
from .models import *


@api_view(('GET',))
@permission_classes((permissions.AllowAny,))
def SearchListView(request):
	search_result = []
	query = request.GET.get('q', None)

	if query is not None:
		post_search_fields = ['title' ,'excerpt', 'content']

		post_queryset = Post.objects.search(query, post_search_fields)
		post_result = PostSerializer(post_queryset, many=True).data

		if post_result:
			for item in post_result:
				item['title'] = item.pop('name')
				item['type'] = 'about'

		search_result = post_result

	return JsonResponse(search_result, safe=False)



class PageView(viewsets.ModelViewSet):
	queryset = Section.objects.filter(show_on_page='self_page')
	serializer_class = SectionSerializer
	lookup_field = 'slug'

	def retrieve(self, request, *args, **kwargs):
		slug=kwargs[self.lookup_field]
		post_id = kwargs.get('pk', '')
		data = {}
		if post_id:
			data['id'] = post_id

		queryset = Section.objects.filter(in_nav=True)
		data['nav'] = SectionSerializer(queryset, many=True, context={'request': request}).data


		if slug == 'homepage':
			query_page = Q(section__show_on_page='index_page')
			query_section = Q(section__slug__isnull=False)
			data['page_route'] = ''
		else:
			query_page = Q(section__show_on_page='self_page')
			query_section = Q(section__slug=slug)
			data['page_route'] = '/{}/{}'.format(slug, post_id)

		query_page.add(Q(section__show_on_page='every_page'), Q.OR)

		queryset = Post.objects.filter(query_page, is_active=True)
		queryset_header = queryset.filter(section__area='header')
		queryset_body = queryset.filter(query_section, section__area='body')
		queryset_footer = queryset.filter(section__area='footer')

		data['header'] = PostListSerializer(queryset_header, many=True, context={'request': request}).data
		data['footer'] = PostListSerializer(queryset_footer, many=True, context={'request': request}).data

		if post_id:
			queryset_body = get_object_or_404(queryset_body, id=post_id)
			data['body'] = PostDetailSerializer(queryset_body, many=False, context={'request': request}).data
		else:
			data['body'] = PostListSerializer(queryset_body, many=True, context={'request': request}).data

			if slug != 'homepage' and queryset_body:
				query_seo = Q(slug=slug) & Q(show_on_page='self_page')
			else:
				query_seo=Q(show_on_page='index_page')

			seo_posts = Section.objects.prefetch_related('page_seo').filter(query_seo, page_seo__isnull=False)
			queryset_seo  = seo_posts[0] if seo_posts else None

			queryset = Contact.objects.all()
			queryset_contact = queryset[0] if queryset else None

			data['meta'] = MetaSerializer(queryset_contact, context={'request': request}).data
			data['meta'].update(
				PageSeoSerializer(queryset_seo, many=False).data
			)
		return Response(data)



class PostView(viewsets.ModelViewSet):
	queryset = Post.objects.filter(is_active=True)
	serializer_class = PostSerializer

	def list(self, request, *args, **kwargs):
		page_param = request.GET.get('page', None)
		if page_param:
			queryset = Post.objects.filter(section__slug=page_param, is_active=True)
			serializer = PostSerializer(queryset, many=True)
		else:
			 serializer = super().list(request, *args, **kwargs)
		return Response(serializer.data)

	def retrieve(self, request, *args, **kwargs):
		instance = self.get_object()
		serializer = PostDetailSerializer(instance, context={'request': request})
		return Response(serializer.data['content'])



class SectionView(viewsets.ModelViewSet):
	queryset = Section.objects.prefetch_related('posts').filter(posts__is_active=True)
	serializer_class = SectionSerializer
	lookup_field = 'slug'

	def retrieve(self, request, *args, **kwargs):
		slug = kwargs[self.lookup_field]
		post_id = kwargs.get('pk', None)

		page_param = request.GET.get('page_type', None)
		if page_param:
			query_page = Q(section__show_on_page=page_param) | Q(section__show_on_page='every_page')
		else:
			query_page = Q(section__show_on_page__isnull=False)

		if post_id :
			try:
				post = Post.objects.get(query_page, id=post_id)
			except Post.DoesNotExist:
				post = None
			serializer = PostDetailSerializer(post, many=False, context={'request': request})
		else:
			posts = Post.objects.filter(query_page, section__slug=slug, is_active=True)
			serializer = PostListSerializer(posts, many=True, context={'request': request})

		return Response(serializer.data)



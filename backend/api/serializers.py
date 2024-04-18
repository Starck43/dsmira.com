# serializers.py
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
# from django.contrib.auth.models import User
from os import path

from .models import *
from .logic import add_domain_to_url, build_srcset, is_file_exist


def get_model_data(model_name, **kwargs):
    try:
        model_type = ContentType.objects.get(app_label='api', model=model_name)
        post = model_type.model_class().objects.get(**kwargs)
    except ContentType.DoesNotExist:
        post = None
    return post


class FixAbsolutePathSerializer(serializers.Field):
    def to_representation(self, value):
        if value:
            request = self.context.get('request')
            pattern = 'src=\"<URL>/media/'
            url = add_domain_to_url(request, value.url, pattern)
            return url


class FixCharCaretSerializer(serializers.Field):
    def to_representation(self, value):
        value = value.replace('\r\n', '<br/>')
        return value


class FixRichCaretSerializer(serializers.Field):
    def to_representation(self, value):
        value = value.replace('</p>\r\n\r\n<p>', '<br/>')
        request = self.context.get('request')
        pattern = 'src=\"<URL>/media/'
        value = add_domain_to_url(request, value, pattern)
        return value


class SeoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seo
        fields = ('title', 'description', 'keywords')


class PageSeoSerializer(serializers.ModelSerializer):
    seo = SeoSerializer(source='page_seo', many=False)

    class Meta:
        model = Section
        fields = ('seo',)


class MetaSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Contact
        fields = ('logo', 'name', 'phone',)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'title', 'slug', 'sort',)


class MediaSerializer(serializers.ModelSerializer):
    excerpt = FixCharCaretSerializer()
    file = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Media
        fields = ('id', 'title', 'excerpt', 'file',)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.file:
            data.update({
                'src': data['file'],
                'srcset': build_srcset(self, instance.file),
                'size': {
                    'width': instance.file.width,
                    'height': instance.file.height
                }
            })
        return data


class SlideSerializer(MediaSerializer):
    # cover = serializers.ImageField(max_length=None, use_url=True)
    # file = serializers.FileField(max_length=None, use_url=True)
    class Meta:
        model = Slide
        fields = ('id', 'title', 'excerpt', 'portfolio', 'file', 'video', 'link',)


class SliderSerializer(serializers.ModelSerializer):
    excerpt = FixCharCaretSerializer()
    description = FixRichCaretSerializer()
    slides = SlideSerializer(many=True)

    class Meta:
        model = Slider
        fields = ('title', 'excerpt', 'description', 'slides',)


class PortfolioSerializer(serializers.ModelSerializer):
    excerpt = FixCharCaretSerializer()
    description = FixRichCaretSerializer()
    # created_date = serializers.DateField(format="%d.%m.%Y")
    category = CategorySerializer()
    cover = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Portfolio
        exclude = ('section', 'post_type', 'sort', 'is_active',)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.cover:
            data['cover'] = {
                'src': data['cover'],
                'size': {'width': instance.cover.width, 'height': instance.cover.height},
                'srcset': build_srcset(self, instance.cover)
            }

        if not self.context['many']:
            data['slides'] = MediaSerializer(instance.images, many=True, context=self.context).data
        return data


class ContactSerializer(serializers.ModelSerializer):
    location = FixCharCaretSerializer()
    excerpt = FixCharCaretSerializer()

    class Meta:
        model = Contact
        exclude = ('id', 'post_type', 'sort', 'section', 'is_active',)


class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        exclude = ('id', 'post_type', 'sort', 'section', 'is_active',)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = {
                'src': data['avatar'],
                'size': {'width': instance.avatar.width, 'height': instance.avatar.height},
                'srcset': build_srcset(self, instance.avatar)
            }
        return data


class CustomerSerializer(AboutSerializer, serializers.ModelSerializer):
    class Meta:
        model = Customer
        exclude = ('id', 'post_type', 'sort', 'section', 'is_active',)


class SectionSerializer(serializers.ModelSerializer):
    link = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = ('id', 'slug', 'name', 'show_on_page', 'area', 'in_nav', 'link',)

    def get_link(self, obj):
        return '{}{}'.format('' if obj.show_on_page == 'self_page' else '#', obj.slug) if obj else None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # print(self.context)
        data['active'] = True if 'current_route' in self.context and self.context[
            'current_route'] == instance.slug else False

        return data


class PostSerializer(serializers.ModelSerializer):
    excerpt = FixCharCaretSerializer()
    description = FixRichCaretSerializer()
    section = serializers.SlugRelatedField(slug_field='slug', queryset=Section.objects.all())

    class Meta:
        model = Post
        fields = ('id', 'title', 'excerpt', 'description', 'post_type', 'section',)


class PostListSerializer(serializers.ModelSerializer):
    content = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('content', 'id', 'post_type', 'title',)

    def get_content(self, obj):
        data = get_model_data(obj.post_type, id=obj.id, is_active=True)
        context = self.context
        many = context.get('many', True)
        self.context['many'] = many

        if data:
            # print(obj.post_type)
            if obj.post_type == 'slider':
                serializer = SliderSerializer(data, context=context)
            elif obj.post_type == 'contact':
                serializer = ContactSerializer(data, context=context)
            elif obj.post_type == 'about':
                serializer = AboutSerializer(data, context=context)
            elif obj.post_type == 'customer':
                serializer = CustomerSerializer(data, context=context)
            elif obj.post_type == 'portfolio':
                serializer = PortfolioSerializer(data, context=context)
            else:
                return None
            # serializer = PostSerializer(data, context=context)

            data = serializer.data
        else:
            data = {}
        return data

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['section'] = instance.section.slug
        data['section_name'] = instance.section.name
        data['page'] = instance.section.show_on_page
        data['area'] = instance.section.area

        if is_file_exist(instance.file):
            data['content']['file'] = {
                'src': data['content']['file'],
                'size': {'width': instance.file.width, 'height': instance.file.height},
                'srcset': build_srcset(self, instance.file)
            }

        if instance.section.area != 'header':
            if instance.post_type == 'portfolio':
                data['url'] = '/{}/{}'.format('projects', instance.id)
            else:
                data['url'] = '/{}/{}'.format(instance.section.slug, instance.id)
        else:
            data['url'] = None

        return data


class PostDetailSerializer(PostListSerializer, serializers.ModelSerializer):
    def to_representation(self, instance):
        self.context['many'] = False
        return super().to_representation(instance)

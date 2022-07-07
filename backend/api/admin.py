from django.contrib import admin
from django.db.models import Q

#from .forms import SeoForm
from .models import *


# Creating a model's sort function for admin
def get_app_list(self, request):
	ordered_models = [
		('api', [
			'Section',
			'Portfolio',
			'Category',
			'About',
			'Customer',
			'Contact',
			'Media',
			'Slider',
			'Slide',
			'Seo',
		])
	]
	app_dict = self._build_app_dict(request)

	for app_name, object_list in ordered_models:
		app = app_dict.get(app_name, None)
		if app:
			app['models'].sort(key=lambda x: object_list.index(x['object_name']))
		#yield app

	return sorted(app_dict.values(), key=lambda x: x['name'].lower())

admin.AdminSite.get_app_list = get_app_list



class PostInlineAdmin(admin.StackedInline):
	model = Post

	extra = 0 #new blank record count
	fields = ('section', 'title', )
	verbose_name_plural = ""



class MediaInlineAdmin(admin.TabularInline):
	model = Media

	extra = 0 #new blank record count
	show_change_link = True
	fields = ('thumb', 'file', 'title', 'sort',)
	readonly_fields = ('thumb',)
	list_display_links = ('thumb', 'title',)



class SlideInlineAdmin(MediaInlineAdmin):
	model = Slide

	extra = 0 #new blank record count
	show_change_link = True
	fields = ('thumb', 'file', 'video', 'sort',)
	readonly_fields = ('thumb', )
	list_display_links = ('thumb', 'title',)



class SeoInlineAdmin(admin.TabularInline):
	model = Seo
	extra = 1 #new blank record count
	fields = ('title', 'description', 'keywords',)



@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	model = Category

	prepopulated_fields = {"slug": ('title',)} # adding name to seo field
	list_display = ('title', 'slug', 'sort', )



@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
	model = Section

	prepopulated_fields = {'slug': ('name',)} # adding name to slug field
	list_display = ('name', 'slug', 'show_on_page', 'area', 'in_nav', )
	list_display_links = ('name', 'slug',)
	inlines = [PostInlineAdmin, SeoInlineAdmin]



# @admin.register(Post)
class PostAdmin(admin.ModelAdmin):
	model = Post

	list_display = ('section', 'title', 'is_active',)
	list_display_links = ('section', 'title',)
	list_filter = ('section', 'section__show_on_page', 'section__area',  'is_active',)
	search_fields = ('title',)

	def get_queryset(self, request):
		if self.model.__name__.lower() == 'post':
			return self.model.objects.filter(Q(portfolio__isnull=True))
		else:
			return super().get_queryset(request)



@admin.register(Contact)
class ContactAdmin(PostAdmin):
	model = Contact

	list_display = ('thumb', 'name', 'phone', 'email', 'location',)
	list_display_links = ('thumb', 'name',)



@admin.register(Customer)
class CustomerAdmin(PostAdmin):
	model = Customer

	list_display = ('thumb', 'title',)
	list_display_links = ('thumb', 'title',)



@admin.register(About)
class AboutAdmin(PostAdmin):
	model = About

	list_display = ('thumb', 'title', 'link',)
	list_display_links = ('thumb', 'title',)
	#inlines = [SeoInlineAdmin]



@admin.register(Portfolio)
class PortfolioAdmin(PostAdmin):
	list_display = ('thumb', 'title', 'category', 'section', 'created_date', 'status',)
	list_display_links = ('thumb', 'title',)
	list_filter = ('category', 'status',)
	ordering = ('-created_date',)
	#prepopulated_fields = {'slug': ('title',)} # adding title to slug field
	date_hierarchy = 'created_date'
	inlines = [MediaInlineAdmin, SeoInlineAdmin] #+ PostAdmin.inlines



@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
	exclude = ('name',)
	list_display = ('thumb', 'portfolio', 'title', 'excerpt',)
	list_display_links = ('thumb', 'portfolio', 'title',)



@admin.register(Slider)
class SliderAdmin(PostAdmin):
	inlines = [SlideInlineAdmin]



@admin.register(Slide)
class SlideAdmin(MediaAdmin):
	# exclude = ('name',)
	list_display = ('thumb','filename', 'slider', 'portfolio', )
	list_display_links = ('thumb','filename',)



@admin.register(Seo)
class SeoAdmin(admin.ModelAdmin):
	model = Seo
	#form = SeoForm
	list_display = ('title', 'post', 'section', 'description', 'keywords',)
	list_display_links = ('title',)

	ordering = ('section',)


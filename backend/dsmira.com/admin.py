from django.contrib import admin
from django.db.models import Q

#from .forms import SeoForm
from .models import *



class SeoInlineAdmin(admin.TabularInline):
	model = Seo
	extra = 0 #new blank record count
	fields = ('title', 'description', 'keywords',)


class PostInlineAdmin(admin.StackedInline):
	model = Post
	extra = 0 #new blank record count
	fields = ('title', 'subtitle', )


class MediaInlineAdmin(admin.TabularInline):
	model = Media
	extra = 1 #new blank record count
	show_change_link = True
	fields = ('thumb', 'filename', 'title', 'sort',)
	readonly_fields = ('thumb', 'filename',)
	list_display_links = ('thumb', 'title',)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
	model = Post
	list_display = ('section', title', 'subtitle', 'description',)
	#search_fields = ('title',)


@admin.register(Navbar)
class NavbarAdmin(admin.ModelAdmin):
	model = Navbar

	prepopulated_fields = {'slug': ('name',)} # adding name to slug field
	list_display = ('name', 'slug', 'link_to', 'is_active', )
	list_display_links = ('name', 'slug',)
	inlines = [PostInlineAdmin]


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
	model = Contact
	list_display = ('thumb', 'name', 'phone', 'email', 'location',)
	list_display_links = ('thumb', 'name',)


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
	model = Customer
	list_display = ('thumb', 'title', 'subtitle', 'excerpt')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	model = Category
	prepopulated_fields = {"slug": ('title',)} # adding name to seo field
	list_display = ('title', )


@admin.register(Portfolio)
class PortfolioAdmin(PostAdmin):
	model = Portfolio

	list_display = ('thumb', 'category', title', 'excerpt', 'status',)
	list_display_links = ('thumb', 'category', 'title',)
	list_filter = ('category', 'status',)
	ordering = ('-modified_date',)
	inlines = [MediaInlineAdmin, SeoInlineAdmin]


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
	model = Media
	list_display = ('thumb', 'portfolio', 'title', 'name',)
	list_display_links = ('thumb', 'portfolio', 'title',)


@admin.register(Seo)
class SeoAdmin(admin.ModelAdmin):
	#form = SeoForm
	model = Seo
	list_display = ('page', 'portfolio', 'title', 'description', 'keywords',)
	list_filter = ('page', 'portfolio',)


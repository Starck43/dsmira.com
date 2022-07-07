from django.db import models
from django.db.models import Q, F
from django.db.models.functions import Coalesce
from django.core.validators import RegexValidator
from django.conf import settings

import os
import datetime

from uuslug import uuslug
from ckeditor_uploader.fields import RichTextUploadingField
from ckeditor.fields import RichTextField
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFit, ResizeToFill

from .logic import remove_media_folder, remove_media, generate_media, get_admin_thumb, MediaFileStorage, MediaUploadTo


class SearchManager(models.Manager):

	def search(self, search_query, fields):
		if search_query and fields:
			params = search_query.split()
			or_lookup = None
			for field in fields:
				and_lookup = None
				for param in params:
					query = Q(**{ f'{field}__icontains': param })
					if not and_lookup:
						and_lookup = query
					else:
						and_lookup.add(query, Q.AND)

				if not or_lookup:
					or_lookup = and_lookup
				else:
					or_lookup.add(and_lookup, Q.OR)

			return self.get_queryset().filter(or_lookup).distinct()
		return None



class Section(models.Model):
	PAGE = (
		('index_page', 'Главная'),
		('self_page', 'Своя страница'),
		('every_page', 'На всех станицах'),
	)
	AREA = (
		('header', 'Шапка'),
		('body', 'Тело'),
		('footer', 'Повал'),
	)
	name = models.CharField('Раздел сайта', max_length=20, help_text='Название элемента появится в меню навигации')
	slug = models.SlugField('Ярлык', max_length=20, blank=True, unique=True, help_text='Латинское название связанного с разделом элемента меню')
	sort = models.PositiveSmallIntegerField('Порядок сортировки')
	show_on_page = models.CharField('Страница показа', max_length=12, null=True, choices=PAGE, default=PAGE[0][0], help_text='Укажите страницы отображения контента')
	area = models.CharField('Область страницы', max_length=12, choices=AREA, default=AREA[1][0], help_text='Укажите область отображения контента на странице')
	in_nav = models.BooleanField('Показывать в меню', default=True)

	class Meta:
		db_table = "sections"
		ordering = ['sort']
		verbose_name = 'раздел сайта'
		verbose_name_plural = 'Разделы сайта'

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = uuslug(self.name, instance=self)
		super().save(*args, **kwargs)

	def __str__(self):
		return self.name



class Category(models.Model):
	title = models.CharField('Название категории', max_length=50, unique=True, help_text='Отобразится в области фильтра по категориям')
	slug = models.SlugField('Ярлык', max_length=50, unique=True, help_text='Латинское название')
	sort = models.PositiveSmallIntegerField('Порядок сортировки', null=True)

	class Meta:
		db_table = "categories"
		ordering = ['sort']
		verbose_name = 'категория проекта'
		verbose_name_plural = 'Категории проектов'

	def __str__(self):
		return self.title



# Main class for others
class Post(models.Model):
	is_active = models.BooleanField('Показывать на странице', default=True)
	section = models.ForeignKey(Section, on_delete=models.SET_NULL, null=True, related_name='posts', verbose_name='Раздел', help_text='Выберите связанный с контентом раздел')
	title = models.CharField('Заголовок', max_length=250, unique=True, help_text='Укажите название секции')
	excerpt = models.TextField('Подзаголовок', blank=True, help_text='Дополнительный текст под заголовком')
	description = RichTextUploadingField('Подробное описание', blank=True, help_text='Дополнительный блок с редактором текста')
	sort = models.PositiveSmallIntegerField('Индекс сортировки', null=True, blank=True, help_text='Нумерованные записи окажутся выше других')
	post_type = models.CharField('Тип поста', max_length=50, null=True, blank=True, editable=False)
	file = ProcessedImageField(
		processors=[ResizeToFit(1200, 800)],
		format='JPEG',
		options={'quality': settings.PORTFOLIO_IMAGE_QUALITY},
		storage=MediaFileStorage(output='about_extra.jpg'),
		null=True,
		blank=True,
		verbose_name='Дополнительный медиафайл',
		help_text=''
	)

	objects = SearchManager()

	class Meta:
		ordering = ['post_type', Coalesce("sort", F('id') + 500)]
		verbose_name = 'пост'
		verbose_name_plural = 'Посты'


	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.original_file = self.file


	def delete(self, *args, **kwargs):
		super().delete(*args, **kwargs)
		remove_media(self.file)


	def save(self, *args, **kwargs):
		# delete an old image before saving a new one
		if self.original_file and self.file != self.original_file:
			remove_media(self.original_file)
			self.original_file = None

		self.post_type = self._meta.model_name
		super().save(*args, **kwargs)

		if self.file != self.original_file:
			generate_media(self.file, [50, 320, 576, 768, 992])

		self.original_file = self.file


	def __str__(self):
		return self.title



class Contact(Post):
	phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Введите номер в формате: '+7XXXXXXXXXX'")

	logo = ProcessedImageField(
		processors=[ResizeToFit(150, 150)],
		format='PNG',
		options={'quality': settings.PORTFOLIO_IMAGE_QUALITY},
		storage=MediaFileStorage(output='logo.png'),
		blank=True,
		verbose_name='Логотип',
		help_text='Логотип компании'
	)
	name = models.CharField('Название', max_length=150, unique=True, help_text='Название своей компании')
	phone = models.CharField('Телефон', validators=[phone_regex], max_length=12, blank=True, default="")
	email = models.EmailField('E-mail', max_length=50, blank=True, default="")
	www = models.URLField('Сайт', blank=True, help_text='Ссылка на этот сайт')
	whatsapp = models.CharField('WhatsApp', max_length=75, blank=True, help_text='Укажите номер телефона цифрами wa.me/7XXXXXXXXXX')
	telegram = models.CharField('Telegram', max_length=75, blank=True, help_text='Укажите имя пользователя username t.me/username')
	location = models.TextField('Адрес расположения', blank=True)
	show_email = models.BooleanField('Показать почтовый адрес в контактах?', blank=True, default=True)

	class Meta:
		db_table = "contacts"
		verbose_name = 'Контакт'
		verbose_name_plural = 'Контактная информация'


	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.original_logo = self.logo


	def delete(self, *args, **kwargs):
		super().delete(*args, **kwargs)
		remove_media(self.logo)


	def save(self, *args, **kwargs):
		# delete an old image before saving a new one
		if self.original_logo and self.logo != self.original_logo:
			remove_media(self.original_logo)
			self.original_logo = None

		super().save(*args, **kwargs)
		if self.logo != self.original_logo:
			generate_media(self.logo)

		self.original_logo = self.logo


	def __str__(self):
		return self.name

	def thumb(self):
		return get_admin_thumb(self.logo)
	thumb.short_description = 'Миниатюра'



class Customer(Post):
	avatar = ProcessedImageField(
		upload_to='avatars/',
		processors=[ResizeToFill(320, 320)],
		format='JPEG',
		options={'quality': settings.PORTFOLIO_IMAGE_QUALITY},
		storage=MediaFileStorage(),
		blank=True,
		verbose_name='Аватар',
		help_text='Логотип или аватар заказчика 320x320пикс'
	)
	link = models.URLField('Ссылка', blank=True, help_text='Ссылка для перехода на сайт')

	class Meta:
		db_table = "customers"
		verbose_name = 'заказчик'
		verbose_name_plural = 'Заказчики'


	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.original_avatar = self.avatar


	def delete(self, *args, **kwargs):
		super().delete(*args, **kwargs)
		remove_media(self.avatar)


	def save(self, *args, **kwargs):
		# delete an old image before saving a new one
		if self.original_avatar and self.avatar != self.original_avatar:
			remove_media(self.original_avatar)
			self.original_avatar = None

		super().save(*args, **kwargs)

		self.original_avatar = self.avatar


	def thumb(self):
		return get_admin_thumb(self.avatar)
	thumb.short_description = 'Миниатюра'



class About(Post):
	#slug = models.SlugField('Ярлык', max_length=250, unique=True, help_text='')
	avatar = ProcessedImageField(
		processors=[ResizeToFit(600, 600)],
		format='JPEG',
		options={'quality': settings.PORTFOLIO_IMAGE_QUALITY},
		storage=MediaFileStorage(),
		blank=True,
		verbose_name='Аватар',
		help_text='Изображение аватар размером 600x600 пикс'
	)
	link = models.URLField('Ссылка на сайт', blank=True, help_text='Внешняя ссылка на сайт')

	class Meta:
		db_table = 'about'
		ordering = ['title']
		verbose_name = 'о себе'
		verbose_name_plural = 'О себе'


	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.original_avatar = self.avatar


	def delete(self, *args, **kwargs):
		super().delete(*args, **kwargs)
		remove_media(self.avatar)


	def save(self, *args, **kwargs):
		# delete an old image before saving a new one
		if self.original_avatar and self.avatar != self.original_avatar:
			remove_media(self.original_avatar)

		super().save(*args, **kwargs)
		if self.avatar != self.original_avatar:
			generate_media(self.avatar, [50, 320, 450])

		self.original_avatar = self.avatar


	def thumb(self):
		return get_admin_thumb(self.avatar)
	thumb.short_description = 'Миниатюра'



class Portfolio(Post):
	STATUS = (
		(False,'в стадии реализации'),
		(True,'проект реализован'),
	)

	category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, verbose_name='Категория', related_name='portfolio')
	slug = models.SlugField(max_length=250, verbose_name='Ярлык', editable=False)
	created_date = models.DateField('Дата реализации проекта', blank=True, auto_now_add=False)
	cover = ProcessedImageField(
		upload_to=MediaUploadTo,
		processors=[ResizeToFit(900, 900)],
		format='JPEG',
		options={'quality': settings.PORTFOLIO_IMAGE_QUALITY},
		storage=MediaFileStorage(output='cover.jpg'),
		null=True,
		verbose_name='Обложка',
		help_text='Изображение обложки проекта размером 600x600 пикс'
	)
	status = models.BooleanField('Статус проекта', choices=STATUS)

	class Meta:
		db_table = 'projects'
		ordering = [Coalesce("sort", F('id') + 500), '-created_date']
		get_latest_by = ['id']
		verbose_name = 'проект'
		verbose_name_plural = 'Проекты'


	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.original_cover = self.cover


	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = uuslug(self.title, instance=self)

		# delete an old image before saving a new one
		if self.original_cover and self.cover != self.original_cover:
			remove_media(self.original_cover)
			self.original_cover = None

		super().save(*args, **kwargs)
		if self.cover != self.original_cover:
			generate_media(self.cover, [50, 320, 576, 768])

		self.original_cover = self.cover


	def delete(self, *args, **kwargs):
		super().delete(*args, **kwargs)
		remove_media(self.cover)
		remove_media_folder(f'{self._meta.db_table}/{self.slug}')


	def thumb(self):
		return get_admin_thumb(self.cover)
	thumb.short_description = 'Миниатюра'



class Media(models.Model):
	portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, null=True, verbose_name='Портфолио', related_name='images')
	title = models.CharField('Заголовок', max_length=50, blank=True)
	excerpt = models.TextField('Подзаголовок', blank=True)
	file = ProcessedImageField(
		upload_to=MediaUploadTo,
		processors=[ResizeToFit(1400, 900)],
		#format='WEBP',
		options={'quality': settings.PORTFOLIO_IMAGE_QUALITY},
		storage=MediaFileStorage(),
		null=True,
		verbose_name='Фото проекта',
		help_text='Изображение размером 1400x900 пикс'
	)
	sort = models.PositiveSmallIntegerField('Индекс сортировки', null=True, blank=True)

	class Meta:
		verbose_name = 'медиафайл'
		verbose_name_plural = 'Медиафайлы'
		ordering = [Coalesce("sort", F('id') + 500)]
		get_latest_by = ['id']


	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.original_file = self.file


	def delete(self, *args, **kwargs):
		super().delete(*args, **kwargs)
		remove_media(self.file)


	def save(self, *args, **kwargs):
		# delete an old image before saving a new one
		if self.original_file and self.file != self.original_file:
			remove_media(self.original_file)
			self.original_file = None

		super().save(*args, **kwargs)

		if self.file != self.original_file:
			generate_media(self.file, [50, 320, 576, 768, 992, 1200])

		self.original_file = self.file


	@property
	def filename(self):
		return self.file.name.rsplit('/', 1)[-1]


	def __str__(self):
		return self.title if self.title else self.filename


	def thumb(self):
		return get_admin_thumb(self.file)
	thumb.short_description = 'Миниатюра'



class Slider(Post):
	slug = models.SlugField(max_length=250, verbose_name='Ярлык', editable=False)

	class Meta:
		db_table = 'sliders'
		verbose_name = 'слайдер'
		verbose_name_plural = 'Слайдеры'
		get_latest_by = ['id']

	def save(self, *args, **kwargs):
		super().save(*args, **kwargs)
		if not self.slug:
			self.slug = uuslug(self.title, instance=self)

	def delete(self, *args, **kwargs):
		super().delete(*args, **kwargs)
		remove_media_folder(f'{self._meta.db_table}/{self.slug}')



class Slide(Media):
	Media._meta.get_field('portfolio').blank=True
	slider = models.ForeignKey(Slider, on_delete=models.CASCADE, null=True, verbose_name='Слайдер', related_name='slides')
	video = models.FileField('Видео', upload_to=MediaUploadTo, null=True, blank=True, storage=MediaFileStorage(), help_text='Фото или видеофайл')
	Media._meta.get_field('file').verbose_name='слайд'
	Media._meta.get_field('file').verbose_name_plural='Слайды'
	Media._meta.get_field('file').blank=True
	link = models.URLField('Ссылка на видео', null=True, blank=True, help_text='Внешняя ссылка на видео (Youtube, Vimeo и др)')

	# Metadata
	class Meta:
		verbose_name = 'слайд баннера'
		verbose_name_plural = 'Слайды баннеров'


	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.original_video = self.video

	def delete(self, *args, **kwargs):
		super().delete(*args, **kwargs)
		remove_media(self.video)


	def save(self, *args, **kwargs):

		# delete an old image before saving a new one
		if self.original_video and self.video != self.original_video:
			remove_media(self.original_video)
			self.original_video = None

		super().save(*args, **kwargs)
		self.original_video = self.video

	@property
	def filename(self):
		return self.file.name.rsplit('/', 1)[-1]



class Seo(models.Model):
	post = models.OneToOneField(Post, on_delete=models.SET_NULL, null=True, blank=True, related_name='seo', verbose_name='Запись', help_text='Выберите соответствующую запись для для отображения мета данных на странице этого контента')
	section = models.OneToOneField(Section, on_delete=models.SET_NULL, null=True, blank=True, related_name='page_seo', verbose_name='Секция', help_text='Выберите секцию для отображения мета данных на странице с этим контентом')
	title = models.CharField('Заголовок страницы', max_length=250, blank=True)
	description = models.TextField('Мета описание', blank=True, help_text='Описание страницы в поисковой выдаче. Рекомендуется 70-80 символов')
	keywords = models.CharField('Ключевые слова', max_length=255, blank=True, help_text='Укажите через запятую поисковые словосочетания, которые присутствуют в заголовке или описании самой записи. Рекомендуется до 20 слов и не более 3-х повторов')

	class Meta:
		db_table = 'seo'
		verbose_name = 'СЕО'
		verbose_name_plural = 'СЕО'

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		if not self.title and self.post:
			self.title = self.post.title

	def __str__(self):
		return self.title


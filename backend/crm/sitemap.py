from django.contrib.sitemaps import Sitemap
from django.shortcuts import reverse

from api.models import About


class StaticViewSitemap(Sitemap):
	priority = 0.5          # Приоритет
	changefreq = 'daily'   # Частота проверки

	def items(self):
		return [
			'index',
			# 'contacts-url',
			'api:about-list-url',
		]

	def location(self, item):
		return reverse(item)


# class AboutSitemap(Sitemap):
	priority = 1
	changefreq = 'daily'
	def items(self):
		return About.objects.all()

sitemaps = {
	'static': StaticViewSitemap,
	'about': AboutSitemap,
}


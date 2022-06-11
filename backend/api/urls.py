from django.urls import path, re_path, include
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

app_name = 'api'

urlpatterns = [
	path('pages/', views.PageView.as_view({'get': 'list'})),
	path('pages/<str:slug>/', views.PageView.as_view({'get': 'retrieve'})),
	path('pages/<str:slug>/<int:pk>/', views.PageView.as_view({'get': 'retrieve'})),

	path('posts/', views.PostView.as_view({'get': 'list'})),
	path('posts/<int:pk>/', views.PostView.as_view({'get': 'retrieve'})),

	path('sections/', views.SectionView.as_view({'get': 'list'})),
	path('sections/<str:slug>/', views.SectionView.as_view({'get': 'retrieve'})),
	path('sections/<str:slug>/<int:pk>/', views.SectionView.as_view({'get': 'retrieve'})),

	#path('', views.SearchListView),
	#path('', include('rest_framework.urls', namespace='rest_framework')),
]

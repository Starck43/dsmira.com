from django.urls import path

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
	path('feedback/', views.feedback_manage),
	path('generate_new_pages/', views.generate_pages, name="rebuild"),
]

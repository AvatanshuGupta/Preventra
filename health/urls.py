from django.urls import path
from . import views

urlpatterns = [
    path('diabetes/',views.diabetes,name="diabetes"),
    path('heart/',views.heart,name="heart"),
    path('lungs/',views.lungs,name="lungs")
]

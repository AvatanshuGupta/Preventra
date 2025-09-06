from django.urls import path
from . import views

app_name = 'health'

urlpatterns = [
    path('diabetes/',views.diabetes,name="diabetes"),
    path('heart/',views.heart,name="heart"),
    path('lungs/',views.lungs,name="lungs")
]

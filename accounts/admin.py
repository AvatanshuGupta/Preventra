from django.contrib import admin
from .models import DiabetesData,LungData,HeartData,UserProfile
# Register your models here.
admin.site.register(DiabetesData)
admin.site.register(LungData)
admin.site.register(HeartData)
admin.site.register(UserProfile)
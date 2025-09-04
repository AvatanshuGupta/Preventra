from django.db import models
from django.contrib.auth.models import User

# 1. One-time Profile Info
class UserProfile(models.Model):
    GENDER_CHOICES = [
        (1,'Male'),
        (0,'Female'),
    ]
    SMOKING_CHOICES=[
        (0.0,'never'),
        (1.0,'No Info'),
        (2.0,'ever'),
        (3.0,'former'),
        (4.0,'current')
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    dob = models.DateField()
    gender = models.IntegerField(choices=GENDER_CHOICES)
    hypertension = models.BooleanField()
    heart_disease = models.BooleanField()
    ALLERGY = models.BooleanField()
    ALCOHOL_CONSUMING = models.BooleanField()
    smoking_history = models.FloatField(choices=SMOKING_CHOICES)

    def __str__(self):
        return self.user.username

# 2. Diabetes - Time-varying
class DiabetesData(models.Model):
    DIABETES_CHOICES=[
        (0,'negative'),
        (1,'positive')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    weight = models.FloatField(help_text="Weight in kilograms")
    height = models.FloatField(help_text="Height in meters")
    HbA1c_level = models.FloatField()
    blood_glucose_level = models.FloatField()
    diabetes=models.BooleanField()
    @property
    def bmi(self):
        try:
            return round(self.weight / (self.height ** 2), 2)
        except (ZeroDivisionError, TypeError):
            return None
        
        
# 3. Heart - Time-varying
class HeartData(models.Model):
    RESULT_CHOICES=[
        ('positive','positive'),
        ('negative','negative')

    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    heart_rate = models.IntegerField()
    systolic_bp = models.IntegerField()
    diastolic_bp = models.IntegerField()
    blood_sugar = models.FloatField()
    result=models.CharField(choices=RESULT_CHOICES)

# 4. Lung - Time-varying
class LungData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    YELLOW_FINGERS = models.BooleanField()
    ANXIETY = models.BooleanField()
    FATIGUE = models.BooleanField()
    WHEEZING = models.BooleanField()
    COUGHING = models.BooleanField()
    SHORTNESS_OF_BREATH = models.BooleanField()
    SWALLOWING_DIFFICULTY = models.BooleanField()
    CHEST_PAIN = models.BooleanField()
    LUNG_CANCER = models.BooleanField()

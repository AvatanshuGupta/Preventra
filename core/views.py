from django.shortcuts import render,redirect
from accounts.models import UserProfile, DiabetesData, HeartData
from datetime import date
import datetime
from django.contrib.auth.decorators import login_required
# Create your views here.


def calculate_age(dob):
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

@login_required
def home(request):
    user = request.user
    try:
        profile = UserProfile.objects.get(user=user)
        age = calculate_age(profile.dob)
    except UserProfile.DoesNotExist:
        profile = None
        age = None

    diabetes_entries = DiabetesData.objects.filter(user=user).order_by('-timestamp')[:10][::-1]
    heart_entries = HeartData.objects.filter(user=user).order_by('-timestamp')[:10][::-1]

    # Extract labels and values
    weight_labels = [entry.timestamp.strftime('%Y-%m-%d') for entry in diabetes_entries]
    weight_data = [entry.weight for entry in diabetes_entries]

    glucose_data = [entry.blood_glucose_level for entry in diabetes_entries]

    systolic_data = [entry.systolic_bp for entry in heart_entries]
    diastolic_data = [entry.diastolic_bp for entry in heart_entries]
    heart_labels = [entry.timestamp.strftime('%Y-%m-%d') for entry in heart_entries]

    chart_data = {
        "weight": {
            "labels": weight_labels,
            "data": weight_data
        },
        "glucose": {
            "labels": weight_labels,  # using same labels as weight
            "data": glucose_data
        },
        "systolic": {
            "labels": heart_labels,
            "data": systolic_data
        },
        "diastolic": {
            "labels": heart_labels,
            "data": diastolic_data
        }
    }

    context = {
        'profile': profile,
        'age': age,
        'chart_data': chart_data  # ⬅️ Pass this to template
    }

    return render(request, 'home.html', context)


@login_required
def dashboard(request):
    if request.method == 'POST':
        user = request.user  # assumes user is logged in

        dob_str = request.POST.get('dob')
        dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
        gender = int(request.POST.get('gender'))

        # Fix checkbox fields
        hypertension = 'hypertension' in request.POST
        heart_disease = 'heart_disease' in request.POST
        ALLERGY = 'ALLERGY' in request.POST
        ALCOHOL_CONSUMING = 'ALCOHOL_CONSUMING' in request.POST

        try:
            smoking_history = float(request.POST.get('smoking_history'))
        except (TypeError, ValueError):
            smoking_history = 1.0  # default to 'No Info'

        print("Parsed values:", dob, gender, hypertension, heart_disease, ALLERGY, ALCOHOL_CONSUMING, smoking_history)

        # Save the profile
        profile, created = UserProfile.objects.update_or_create(
            user=user,
            defaults={
                'dob': dob,
                'gender': gender,
                'hypertension': hypertension,
                'heart_disease': heart_disease,
                'ALLERGY': ALLERGY,
                'ALCOHOL_CONSUMING': ALCOHOL_CONSUMING,
                'smoking_history': smoking_history,
            }
        )
        print(profile)
        print(created)

        return redirect('/')

    return render(request,'dashboard.html')
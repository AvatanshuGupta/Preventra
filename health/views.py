from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from accounts.models import DiabetesData,HeartData,LungData,UserProfile
import psycopg2
from django.conf import settings
import requests
from sqlalchemy import create_engine, Table, Column, Float, Integer, MetaData
from datetime import date
from sqlalchemy import String
import os
from dotenv import load_dotenv

load_dotenv()


HEART_API_URL="https://heart-health-ml-api.onrender.com/predict"
LUNG_API_URL="https://lung-health-ml-api.onrender.com/predict"
DIABETES_API_URL="https://diabetic-health-ml-api.onrender.com/predict"

DATABASE_URL=os.environ.get("DATABASE_URL")

engine = create_engine(DATABASE_URL)
metadata = MetaData()

def convert_to_bool(val):
    return True if val == 2 else False


diabetes_table = Table(
    'diabetes',
    metadata,
    Column('gender', Float),
    Column('age', Float),
    Column('hypertension', Integer),
    Column('heart_disease', Integer),
    Column('smoking_history', Float),
    Column('bmi', Float),
    Column('HbA1c_level', Float),
    Column('blood_glucose_level', Integer),
    Column('diabetes', Integer)
)


heart_table = Table(
    'heart', 
    metadata,
    Column('Age', Integer),
    Column('Gender', Integer),  
    Column('Heart rate', Integer),
    Column('Systolic blood pressure', Integer),
    Column('Diastolic blood pressure', Integer),
    Column('Blood sugar', Float),
    Column('Result', String) 
)


lung_table = Table(
    'lung',  # your training table name
    metadata,
    Column('GENDER', Integer),
    Column('AGE', Float),
    Column('SMOKING', Integer),
    Column('YELLOW_FINGERS', Integer),
    Column('ANXIETY', Integer),
    Column('FATIGUE', Integer),
    Column('ALLERGY', Integer),
    Column('WHEEZING', Float),
    Column('ALCOHOL CONSUMING', Integer),
    Column('COUGHING', Integer),
    Column('SHORTNESS OF BREATH', Integer),
    Column('SWALLOWING DIFFICULTY', Integer),
    Column('CHEST PAIN', Integer),
    Column('LUNG_CANCER', Integer)
)

def append_lung_data(payload):
    with engine.connect() as conn:
        conn.execute(lung_table.insert().values(**payload))
        conn.commit()



def append_diabetes_data(payload):
    """
    payload: dict containing
        gender, age, hypertension, heart_disease,
        smoking_history, bmi, HbA1c_level, blood_glucose_level, diabetes
    """
    with engine.connect() as conn:
        insert_stmt = diabetes_table.insert().values(**payload)
        conn.execute(insert_stmt)
        conn.commit()
    print("Data appended successfully!")


def append_heart_data(payload):
    """
    Appends a heart record to the external PostgreSQL table.
    Expected payload keys:
    - Age, Gender, Heart rate, Systolic blood pressure, Diastolic blood pressure, Blood sugar, heart_disease
    """
    with engine.connect() as conn:
        insert_stmt = heart_table.insert().values(**payload)
        conn.execute(insert_stmt)
        conn.commit()
    print("Heart data appended to PostgreSQL successfully!")



def calculate_age(user):
    try:
        profile = UserProfile.objects.get(user=user)
        dob = profile.dob
        today = date.today()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        return age
    except UserProfile.DoesNotExist:
        return None



@login_required
def diabetes(request):
    if request.method == 'POST':
        # Get data from the form
        weight = float(request.POST.get('weight'))
        height = float(request.POST.get('height'))
        hba1c = float(request.POST.get('hba1c_level'))
        blood_glucose = int(request.POST.get('blood_glucose_level'))


        profile = UserProfile.objects.get(user=request.user)
        age = calculate_age(request.user)
        bmi = round(float(weight) / float(height) ** 2, 2)

        # Validate that all fields are provided
        if not all([weight, height, hba1c, blood_glucose]):
            return render(request, 'diabetes.html', {'error': 'Please fill in all fields'})

        payload = {
            'gender': float(profile.gender),
            'age': float(age),
            'hypertension': int(profile.hypertension),
            'heart_disease': int(profile.heart_disease),
            'smoking_history': float(profile.smoking_history),
            'bmi': bmi,
            'HbA1c_level': float(hba1c),
            'blood_glucose_level': int(blood_glucose)
        }
        try:
            response = requests.post(url=DIABETES_API_URL, json=payload)
            response.raise_for_status()
            prediction = int(response.json().get("prediction"))
        except requests.exceptions.RequestException as e:
            return render(request, 'diabetes.html', {'error': f"Error: {e}"})

        

        # Save to the database
        DiabetesData.objects.create(
            user=request.user,
            weight=float(weight),
            height=float(height),
            HbA1c_level=float(hba1c),
            blood_glucose_level=float(blood_glucose),
            diabetes=prediction
        )

         # Append to PostgreSQL training DB
        payload['diabetes'] = prediction
        append_diabetes_data(payload)

        return render(request, 'diabetes.html', {'success': f'Data submitted successfully! Prediction: {prediction}'})

    # GET request
    return render(request, 'diabetes.html')


@login_required
def heart(request):
    if request.method == 'POST':
        # Get data from form
        heart_rate = request.POST.get('heart_rate')
        systolic_bp = request.POST.get('systolic_bp')
        diastolic_bp = request.POST.get('diastolic_bp')
        blood_sugar = request.POST.get('blood_sugar')
        

        profile = UserProfile.objects.get(user=request.user)
        age = calculate_age(request.user)
        gender=profile.gender
        

        # Validate inputs
        if not all([heart_rate, systolic_bp, diastolic_bp, blood_sugar]):
            return render(request, 'heart.html', {'error': 'Please fill in all fields'})
        
        payload = {
        'Age': int(age),
        'Gender': int(gender),
        'Heart_rate': int(heart_rate),
        'Systolic_blood_pressure': int(systolic_bp),
        'Diastolic_blood_pressure': int(diastolic_bp),
        'Blood_sugar': float(blood_sugar)
        }
        
        print(payload)

        dbpayload = {
        'Age': int(age),
        'Gender': int(gender),
        'Heart rate': int(heart_rate),
        'Systolic blood pressure': int(systolic_bp),
        'Diastolic blood pressure': int(diastolic_bp),
        'Blood sugar': float(blood_sugar)
        }

        print(dbpayload)

        try:
            response = requests.post(url=HEART_API_URL, json=payload)
            response.raise_for_status()
            prediction = response.json().get("prediction")
            print(prediction)
        except requests.exceptions.RequestException as e:
            return render(request, 'heart.html', {'error': f"Error: {e}"})


        # Save to database
        HeartData.objects.create(
            user=request.user,
            heart_rate=int(heart_rate),
            systolic_bp=int(systolic_bp),
            diastolic_bp=int(diastolic_bp),
            blood_sugar=float(blood_sugar)
        )

        dbpayload['Result'] = prediction
        print(dbpayload)
        # Append to remote training table
        append_heart_data(dbpayload)

        return render(request, 'heart.html', {'success': f'Data submitted successfully! Prediction: {prediction}'})

    # GET request
    return render(request, 'heart.html')

@login_required
def lungs(request):
    if request.method == 'POST':
        # Collect checkbox values from POST and convert to boolean
        print("entered lung func")
        YELLOW_FINGERS = int(request.POST.get('YELLOW_FINGERS'))
        ANXIETY = int(request.POST.get('ANXIETY'))
        FATIGUE = int(request.POST.get('FATIGUE'))
        WHEEZING = float(request.POST.get('WHEEZING'))
        COUGHING = int(request.POST.get('COUGHING'))
        SHORTNESS_OF_BREATH = int(request.POST.get('SHORTNESS_OF_BREATH'))
        SWALLOWING_DIFFICULTY = int(request.POST.get('SWALLOWING_DIFFICULTY'))
        ALCOHOL_CONSUMING = int(request.POST.get('ALCOHOL_CONSUMING'))
        SMOKING = int(request.POST.get('SMOKING'))
        CHEST_PAIN = int(request.POST.get('CHEST_PAIN'))


        profile = UserProfile.objects.get(user=request.user)
        age = calculate_age(request.user)
        gender=profile.gender
        
        print("profile fetched")
        
        ALLERGY=profile.ALLERGY
        allergy=1

        if ALLERGY==0:
            allergy=1
        elif ALLERGY==1:
            allergy=2

    
        payload = {
            "GENDER": gender,
            "AGE": age,
            "SMOKING": SMOKING,
            "YELLOW_FINGERS": YELLOW_FINGERS,
            "ANXIETY": ANXIETY,
            "FATIGUE": FATIGUE,
            "ALLERGY": allergy,
            "WHEEZING": WHEEZING,
            "ALCOHOL_CONSUMING": ALCOHOL_CONSUMING,
            "COUGHING": COUGHING,
            "SHORTNESS_OF_BREATH": SHORTNESS_OF_BREATH,
            "SWALLOWING_DIFFICULTY": SWALLOWING_DIFFICULTY,
            "CHEST_PAIN": CHEST_PAIN
        }


        dbpayload = {
            "GENDER": gender,
            "AGE": age,
            "SMOKING": SMOKING,
            "YELLOW_FINGERS": YELLOW_FINGERS,
            "ANXIETY": ANXIETY,
            "FATIGUE": FATIGUE,
            "ALLERGY": allergy,
            "WHEEZING": WHEEZING,
            "ALCOHOL CONSUMING": ALCOHOL_CONSUMING,
            "COUGHING": COUGHING,
            "SHORTNESS OF BREATH": SHORTNESS_OF_BREATH,
            "SWALLOWING DIFFICULTY": SWALLOWING_DIFFICULTY,
            "CHEST PAIN": CHEST_PAIN
        }

        print("payload done")
        print(payload)
        try:
            response = requests.post(url=LUNG_API_URL, json=payload)
            print("response fetched")
            print(response)
            response.raise_for_status()
            prediction = int(response.json().get("prediction"))
            print(f"pred is{prediction}")
            print("pred done")
        except requests.exceptions.RequestException as e:
            return render(request, 'lungs.html', {'error': f"Error: {e}"})
        
        print("pred block passed")

        # Create a new LungData entry
        LungData.objects.create(
            user=request.user,
            YELLOW_FINGERS=convert_to_bool(YELLOW_FINGERS),
            ANXIETY=convert_to_bool(ANXIETY),
            FATIGUE=convert_to_bool(FATIGUE),
            WHEEZING=convert_to_bool(WHEEZING),
            COUGHING=convert_to_bool(COUGHING),
            SHORTNESS_OF_BREATH=convert_to_bool(SHORTNESS_OF_BREATH),
            SWALLOWING_DIFFICULTY=convert_to_bool(SWALLOWING_DIFFICULTY),
            CHEST_PAIN=convert_to_bool(CHEST_PAIN),
            LUNG_CANCER=prediction
        )

        print("obj created")

        print("Form submitted with payload:")
        print(payload)

        dbpayload['LUNG_CANCER']=prediction
        append_lung_data(dbpayload)
        print("data appended")

        # Return the form with success message
        return render(request, 'lungs.html', {'success': f'Lung data submitted successfully! {prediction} '})

    return render(request, 'lungs.html')
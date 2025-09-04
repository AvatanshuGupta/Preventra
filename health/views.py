from django.shortcuts import render

def diabetes(request):
    return render(request,"diabetes.html")

def heart(request):
    return render(request,"heart.html")

def lungs(request):
    return render(request,"lungs.html")
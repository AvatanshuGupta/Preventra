from django.shortcuts import render,redirect,HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.db import IntegrityError

def signup(request):
    if request.method=='POST':
        uname=request.POST.get('uname')
        email=request.POST.get('email')
        password=request.POST.get('password')
        confirm_password=request.POST.get('confirm password')
        fname=request.POST.get('fname')
        lname=request.POST.get('lname')
        if password!=confirm_password:
            return render(request, 'signup.html', {'error': 'Passwords do not match'})
        try:
            user = User.objects.create_user(username=uname, email=email, password=password,
                                            first_name=fname, last_name=lname)
            user.save()
            return redirect('/login')
        except IntegrityError:
            return render(request, 'signup.html', {'error': 'Username already exists'})
    return render(request,'signup.html')

def login_view(request):
    if request.method=='POST':
        uname=request.POST.get('uname')
        password=request.POST.get('password')
        user=authenticate(request,username=uname,password=password)
        if user is not None:
            login(request,user)
            return redirect("/core/home")
        else:
            return render(request, 'login.html', {'error': 'Invalid username or password'})
    return render(request,'login.html')
        

def signout(request):
    logout(request)
    return redirect('/login')



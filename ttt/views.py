# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render

def base(request):
    return HttpResponse("I, Zach Freeman, have just created a Heroku-based website!")

def ttt_base(request):
    return render(request,'ttt/base.html',{})
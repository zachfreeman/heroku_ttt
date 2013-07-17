# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render

def ttt_2d(request):
    return render(request,'ttt/game.html',{})

def ttt_3d(request):
    return render(request,'ttt/three_d.html',{})

def ttt_3d_test(request):
    return render(request,'ttt/three_d_test.html',{})

def ttt_3d_2(request):
    return render(request,'ttt/three_d_2.html',{})

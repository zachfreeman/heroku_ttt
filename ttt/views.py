# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render

def ttt_game(request):
    return render(request,'ttt/game.html',{})
# Create your views here.
from django.http import HttpResponse

def base(request):
    return HttpResponse("I, Zach Freeman, have just created a Heroku-based website!")
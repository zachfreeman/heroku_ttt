# Create your views here.
from django.http import HttpResponse

def base(request):
    return HttpResponse("You have created a view on Heroku!")
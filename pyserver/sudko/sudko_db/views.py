from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from sudko_db.models import Puzzle
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
import json

def index(request):
    return JsonResponse({
        "puzzles" : [jsonifyPuzzle(p) for p in Puzzle.objects.all()],
    })

def jsonifyPuzzle(puzzle):
    return {
        "name" : puzzle.name,
        "values" : puzzle.values,
    }

def initialUser(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "user" : {
                "username" : request.user.username,
                "email": request.user.email,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name
            }
        })
    else:
        return JsonResponse({
            "user" : None
        })

def signup(request):
    pass

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        print(" P R I N T ___---___")
        print(req["Username"])
        print(req["Password"])
        user = authenticate(request, username=req["Username"], password=req["Password"])
        if user is not None:
            login(request, user)
            return JsonResponse(req)
        else:
            return HttpResponse("User does not exist")
    else:
        return HttpResponse("go away")

def signout(request):
    pass

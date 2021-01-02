from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from sudko_db.models import Puzzle, UserInfo, UserPuzzle
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
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

@csrf_exempt
def signup(request):
    req = json.loads(request.body)
    # get variables from req body
    username = req["username"]
    email, password = req["email"], req["password"]
    first_name, last_name = req["first_name"], req["last_name"]

    # valdidate field
    if User.objects.filter(email=email).exists() or User.objects.filter(username=username).exists():
        raise ValidationError("Email exists")

    #create user
    user = User.objects.create_user(username, first_name=first_name, last_name=last_name, email=email, password=password)
    user.save()

    #create user_info
    user_info = UserInfo(user=user)
    user_info.save()

    return HttpResponse("end of function")



@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        user = authenticate(request, username=req["username"], password=req["password"])
        if user is not None:
            login(request, user)
            return JsonResponse(req)
        else:
            return HttpResponse("User does not exist")
    else:
        return HttpResponse("go away")

def signout(request):
    logout(request)


# TODO: Add puzzle
# TODO: add_user_puzzle
# TODO: update_user_puzzle_values, update_user_puzzle_time, update_user_puzzle_solved -> maybe just one ???

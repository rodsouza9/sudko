from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from sudko_db.models import Puzzle

def index(request):
    return JsonResponse({
        "puzzles" : [jsonifyPuzzle(p) for p in Puzzle.objects.all()],
    })


def jsonifyPuzzle(puzzle):
    return {
        "name" : puzzle.name,
        "values" : puzzle.values,
    }

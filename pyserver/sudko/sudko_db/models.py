from django.db import models
from django.contrib import admin
from django.core.validators import validate_comma_separated_integer_list

LENGTH_OF_PUZZLE = 250


"""
Puzzle: used to store initial state of sudko games
- name : name of puzzle
- values: array
- description: description of puzzle
- likes: the number of likes
- difficulty: {eazy, medium, hard, N/A}
- num_attempts : number of users to have started the puzzle
- num_solved : number of users to have completed the puzzle
- average_time : average completion time of puzzle
- best_time : best time of puzzle
"""
class Puzzle(models.Model):
    name = models.CharField(max_length=200)
    values = models.CharField(max_length=LENGTH_OF_PUZZLE) # validators=[validate_comma_separated_integer_list])
    description = models.TextField(blank=True)

    EASY, MED, HARD, NA = "E", "M", "H", "N"
    DIFF_CHOICES = [
        (EASY, "easy"),
        (MED, "medium"),
        (HARD, "hard"),
        (NA, "N/A")
    ]
    difficulty = models.CharField(
        max_length=1,
        choices=DIFF_CHOICES,
        default=NA,
    )

    num_attempts = models.PositiveBigIntegerField()
    num_solved = models.PositiveBigIntegerField()
    average_time = models.DurationField()
    best_time = models.DurationField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.name +" : [" + str(self.values)[0:20] + " ..."


class PuzzleAdmin(admin.ModelAdmin):
    pass
admin.site.register(Puzzle, PuzzleAdmin)

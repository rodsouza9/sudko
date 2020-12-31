from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from django.core.validators import validate_comma_separated_integer_list

# Puzzle values are stored as a string of ints sperated by ", "
LENGTH_OF_PUZZLE = 250

# Validators for the value of
# validators=[validate_comma_separated_integer_list])


"""
UserInfo - Extension to the User model
 - user : one-to-one relationship with User
 - user_puzzle: one-to-many relationship with UserPuzzle
"""
class UserInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)


"""
Puzzle: used to store initial state of sudko games
- name : name of puzzle
- values: array
TODO: add field solution which is values without zeroes
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
    values = models.CharField(max_length=LENGTH_OF_PUZZLE)
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


"""
User Puzzle - Table of puzzles that have been started by users
A many-to-one relationship with UserInfo
A one-to-one realtionship with Puzzle.
- puzzle : points to Puzzle entry
- user_info : points to User_Info entry
- solved : boolean if puzzle has been solved
- values : user inputed values
- time : time taken
- time_valid : bool if time should count
"""
class UserPuzzle(models.Model):
    puzzle = models.OneToOneField(Puzzle, on_delete=models.CASCADE)
    user_info = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    solved = models.BooleanField(default=False)
    # Values must contain order of additions to board
    values = models.CharField(max_length=LENGTH_OF_PUZZLE)
    time = models.DurationField()
    time_valid = models.BooleanField(default=True)

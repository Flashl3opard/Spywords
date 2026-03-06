from django.db import models


class Room(models.Model):
    STATUS_CHOICES = (
        ("lobby", "Lobby"),
        ("active", "Active"),
        ("finished", "Finished"),
    )

    code = models.CharField(max_length=8, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    host = models.CharField(max_length=64)
    game_state = models.JSONField(default=dict, blank=True)
    turn = models.CharField(max_length=10, default="red")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="lobby")

    def __str__(self) -> str:
        return self.code


class Player(models.Model):
    TEAM_CHOICES = (
        ("red", "Red"),
        ("blue", "Blue"),
        ("spectator", "Spectator"),
    )
    ROLE_CHOICES = (
        ("spymaster", "Spymaster"),
        ("operative", "Operative"),
    )

    name = models.CharField(max_length=32)
    team = models.CharField(max_length=10, choices=TEAM_CHOICES, default="spectator")
    role = models.CharField(max_length=12, choices=ROLE_CHOICES, default="operative")
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="players")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("name", "room")

    def __str__(self) -> str:
        return f"{self.name} ({self.room.code})"


class WordCard(models.Model):
    COLOR_CHOICES = (
        ("red", "Red"),
        ("blue", "Blue"),
        ("neutral", "Neutral"),
        ("assassin", "Assassin"),
    )

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="cards")
    word = models.CharField(max_length=64)
    color = models.CharField(max_length=10, choices=COLOR_CHOICES)
    revealed = models.BooleanField(default=False)
    position = models.IntegerField()

    class Meta:
        unique_together = ("room", "position")

    def __str__(self) -> str:
        return f"{self.word} ({self.color})"

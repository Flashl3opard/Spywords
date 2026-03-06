from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Room",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.CharField(max_length=8, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("host", models.CharField(max_length=64)),
                ("game_state", models.JSONField(blank=True, default=dict)),
                ("turn", models.CharField(default="red", max_length=10)),
                (
                    "status",
                    models.CharField(
                        choices=[("lobby", "Lobby"), ("active", "Active"), ("finished", "Finished")],
                        default="lobby",
                        max_length=10,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Player",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=32)),
                (
                    "team",
                    models.CharField(
                        choices=[("red", "Red"), ("blue", "Blue"), ("spectator", "Spectator")],
                        default="spectator",
                        max_length=10,
                    ),
                ),
                (
                    "role",
                    models.CharField(
                        choices=[("spymaster", "Spymaster"), ("operative", "Operative")],
                        default="operative",
                        max_length=12,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("room", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="players", to="game.room")),
            ],
            options={"unique_together": {("name", "room")}},
        ),
        migrations.CreateModel(
            name="WordCard",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("word", models.CharField(max_length=64)),
                (
                    "color",
                    models.CharField(
                        choices=[("red", "Red"), ("blue", "Blue"), ("neutral", "Neutral"), ("assassin", "Assassin")],
                        max_length=10,
                    ),
                ),
                ("revealed", models.BooleanField(default=False)),
                ("position", models.IntegerField()),
                ("room", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="cards", to="game.room")),
            ],
            options={"unique_together": {("room", "position")}},
        ),
    ]

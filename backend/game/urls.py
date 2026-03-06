from django.urls import path

from game.views import (
    ChatMessageView,
    CreateRoomView,
    EmojiReactionView,
    EndTurnView,
    GuessWordView,
    JoinRoomView,
    RestartGameView,
    RoomStateView,
    SetRoleView,
    SetTeamView,
    StartGameView,
    SubmitClueView,
)

urlpatterns = [
    path("create-room", CreateRoomView.as_view(), name="create-room"),
    path("join-room", JoinRoomView.as_view(), name="join-room"),
    path("room-state", RoomStateView.as_view(), name="room-state"),
    path("set-team", SetTeamView.as_view(), name="set-team"),
    path("set-role", SetRoleView.as_view(), name="set-role"),
    path("start-game", StartGameView.as_view(), name="start-game"),
    path("submit-clue", SubmitClueView.as_view(), name="submit-clue"),
    path("guess-word", GuessWordView.as_view(), name="guess-word"),
    path("end-turn", EndTurnView.as_view(), name="end-turn"),
    path("restart-game", RestartGameView.as_view(), name="restart-game"),
    path("chat", ChatMessageView.as_view(), name="chat"),
    path("react", EmojiReactionView.as_view(), name="react"),
]

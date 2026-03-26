import pytest
from pydantic import ValidationError

from models import MoveCoordinates, MoveRequest


def test_move_request_valid():
    req = MoveRequest(
        board=[
            ["X", None, "O"],
            [None, None, None],
            [None, None, None],
        ],
        character="baron_harkonnen",
        player_piece="X",
        cpu_piece="O",
    )
    assert req.character == "baron_harkonnen"


def test_move_coordinates_rejects_out_of_bounds():
    with pytest.raises(ValidationError):
        MoveCoordinates(row=3, col=0)


def test_move_request_rejects_invalid_character():
    with pytest.raises(ValidationError):
        MoveRequest(
            board=[[None] * 3] * 3,
            character="invalid",
            player_piece="X",
            cpu_piece="O",
        )

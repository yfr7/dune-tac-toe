from typing_extensions import TypedDict

from models import Board, CharacterId, MoveCoordinates


class GraphState(TypedDict):
    board: Board
    character: CharacterId
    difficulty: str
    player_piece: str
    cpu_piece: str
    move: MoveCoordinates | None
    commentary: str

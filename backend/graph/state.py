from typing_extensions import TypedDict

from models import Board, CharacterId, MoveCoordinates


class GraphState(TypedDict):
    board: Board
    character: CharacterId
    player_piece: str
    cpu_piece: str
    raw_response: str
    move: MoveCoordinates | None
    commentary: str

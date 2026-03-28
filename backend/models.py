from typing import Literal

from pydantic import BaseModel, Field

Piece = Literal["X", "O"]
CellValue = Piece | None
CharacterId = Literal["baron_harkonnen", "reverend_mother", "stilgar"]

Board = list[list[CellValue]]


class MoveRequest(BaseModel):
    board: Board = Field(
        ..., description="3x3 grid where each cell is 'X', 'O', or null"
    )
    character: CharacterId
    player_piece: Piece
    cpu_piece: Piece


class MoveCoordinates(BaseModel):
    row: int = Field(..., ge=0, le=2)
    col: int = Field(..., ge=0, le=2)


class MoveResponse(BaseModel):
    move: MoveCoordinates
    commentary: str


class LLMCommentary(BaseModel):
    commentary: str = Field(..., max_length=150)


class HealthResponse(BaseModel):
    status: str = "ok"

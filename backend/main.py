from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from graph import get_cpu_move
from models import HealthResponse, MoveRequest, MoveResponse

app = FastAPI(title="Dune Tac Toe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse()


@app.post("/api/move", response_model=MoveResponse)
async def move(request: MoveRequest) -> MoveResponse:
    return get_cpu_move(
        board=request.board,
        character=request.character,
        player_piece=request.player_piece,
        cpu_piece=request.cpu_piece,
    )

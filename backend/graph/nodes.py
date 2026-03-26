import json
import logging
import random

from config import settings
from models import MoveCoordinates
from prompts import FALLBACK_COMMENTARY, build_prompt

from .client import client
from .state import GraphState

logger = logging.getLogger(__name__)


def call_llm(state: GraphState) -> dict:
    prompt = build_prompt(
        board=state["board"],
        character_id=state["character"],
        cpu_piece=state["cpu_piece"],
        player_piece=state["player_piece"],
    )

    response = client.chat.completions.create(
        model=settings.openai_model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.8,
    )

    raw = response.choices[0].message.content or ""
    return {"raw_response": raw}


def parse_response(state: GraphState) -> dict:
    raw = state["raw_response"]
    try:
        data = json.loads(raw)
        move = MoveCoordinates(row=data["move"]["row"], col=data["move"]["col"])
        commentary = data.get("commentary", FALLBACK_COMMENTARY)
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        logger.warning("Failed to parse LLM response: %s — %s", e, raw)
        return {"move": None, "commentary": FALLBACK_COMMENTARY}

    # Validate the move is on an empty square
    board = state["board"]
    if board[move.row][move.col] is not None:
        logger.warning("LLM chose occupied square (%d, %d)", move.row, move.col)
        return {"move": None, "commentary": FALLBACK_COMMENTARY}

    return {"move": move, "commentary": commentary}


def fallback_move(state: GraphState) -> dict:
    if state["move"] is not None:
        return {}

    board = state["board"]
    empty = [(r, c) for r in range(3) for c in range(3) if board[r][c] is None]

    if not empty:
        logger.error("No empty squares available for fallback move")
        return {}

    r, c = random.choice(empty)
    logger.info("Fallback move selected: (%d, %d)", r, c)
    return {"move": MoveCoordinates(row=r, col=c)}

import logging

from models import LLMCommentary
from prompts import FALLBACK_COMMENTARY, build_prompt

from .client import client
from .state import GraphState
from .strategy import compute_move_for_difficulty

logger = logging.getLogger(__name__)


def compute_move(state: GraphState) -> dict:
    move = compute_move_for_difficulty(
        board=state["board"],
        difficulty=state["difficulty"],
        cpu_piece=state["cpu_piece"],
        player_piece=state["player_piece"],
    )
    return {"move": move}


def call_llm(state: GraphState) -> dict:
    from config import settings

    move = state["move"]
    prompt = build_prompt(
        board=state["board"],
        character_id=state["character"],
        cpu_piece=state["cpu_piece"],
        player_piece=state["player_piece"],
        move_row=move.row,
        move_col=move.col,
    )

    try:
        response = client.beta.chat.completions.parse(
            model=settings.openai_model,
            messages=[{"role": "user", "content": prompt}],
            response_format=LLMCommentary,
            temperature=0.8,
        )
        parsed = response.choices[0].message.parsed
        if parsed and parsed.commentary:
            return {"commentary": parsed.commentary}
    except Exception as e:
        logger.warning("LLM call failed: %s", e)

    return {"commentary": ""}


def fallback_commentary(state: GraphState) -> dict:
    if state.get("commentary"):
        return {}
    return {"commentary": FALLBACK_COMMENTARY}

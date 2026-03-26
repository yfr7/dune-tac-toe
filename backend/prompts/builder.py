from models import CharacterId

from .characters import BOARD_LOCATIONS, CHARACTERS


def format_board(board: list[list[str | None]], locations: list[list[str]]) -> str:
    lines: list[str] = []
    for r in range(3):
        row_parts: list[str] = []
        for c in range(3):
            piece = board[r][c] or "empty"
            row_parts.append(f"{locations[r][c]}: {piece}")
        lines.append(" | ".join(row_parts))
    return "\n".join(lines)


def build_prompt(
    board: list[list[str | None]],
    character_id: CharacterId,
    cpu_piece: str,
    player_piece: str,
) -> str:
    char = CHARACTERS[character_id]
    formatted_board = format_board(board, BOARD_LOCATIONS)

    return f"""\
You are {char["name"]}, playing Tic-tac-toe for control of the Dune universe.

{char["personality"]}

{char["difficulty"]}

Current board state:
{formatted_board}

Your piece is {cpu_piece}. The human plays {player_piece}.

Respond with valid JSON only, no markdown:
{{
  "move": {{ "row": <0-2>, "col": <0-2> }},
  "commentary": "<in-character comment about this specific move, referencing the location name>"
}}

Rules:
- You MUST choose an empty square
- Your commentary MUST reference the location you chose and/or your opponent's recent move
- Stay in character as {char["name"]}"""

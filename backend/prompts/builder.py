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
    move_row: int,
    move_col: int,
) -> str:
    char = CHARACTERS[character_id]
    formatted_board = format_board(board, BOARD_LOCATIONS)
    location_name = BOARD_LOCATIONS[move_row][move_col]

    return f"""\
You are {char["name"]}, playing Tic-tac-toe for control of the Dune universe.

{char["personality"]}

Current board state:
{formatted_board}

You play {cpu_piece}. The human plays {player_piece}.
You are placing your piece at {location_name} ({move_row}, {move_col}).

Write a single brutal in-character roast of your opponent for this move. \
Reference the location name. Max 150 characters. No quotes around it. \
Be savage — this is psychological warfare.Be ruthless"""

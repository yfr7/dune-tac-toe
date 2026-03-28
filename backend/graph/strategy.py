"""Deterministic tic-tac-toe strategy engine — minimax + difficulty dispatch."""

import random

from models import Board, MoveCoordinates

WINNING_LINES = [
    [(0, 0), (0, 1), (0, 2)],
    [(1, 0), (1, 1), (1, 2)],
    [(2, 0), (2, 1), (2, 2)],
    [(0, 0), (1, 0), (2, 0)],
    [(0, 1), (1, 1), (2, 1)],
    [(0, 2), (1, 2), (2, 2)],
    [(0, 0), (1, 1), (2, 2)],
    [(0, 2), (1, 1), (2, 0)],
]


def check_winner(board: Board) -> str | None:
    for line in WINNING_LINES:
        vals = [board[r][c] for r, c in line]
        if vals[0] is not None and vals[0] == vals[1] == vals[2]:
            return vals[0]
    return None


def _empty_squares(board: Board) -> list[tuple[int, int]]:
    return [(r, c) for r in range(3) for c in range(3) if board[r][c] is None]


def minimax(
    board: Board,
    is_maximizing: bool,
    cpu_piece: str,
    player_piece: str,
    depth: int = 0,
) -> float:
    """Minimax with depth penalty — prefers faster wins and slower losses."""
    winner = check_winner(board)
    if winner == cpu_piece:
        return 10 - depth
    if winner == player_piece:
        return depth - 10
    empty = _empty_squares(board)
    if not empty:
        return 0

    if is_maximizing:
        best = -100.0
        for r, c in empty:
            board[r][c] = cpu_piece
            best = max(best, minimax(board, False, cpu_piece, player_piece, depth + 1))
            board[r][c] = None
        return best
    else:
        best = 100.0
        for r, c in empty:
            board[r][c] = player_piece
            best = min(best, minimax(board, True, cpu_piece, player_piece, depth + 1))
            board[r][c] = None
        return best


def get_best_move(
    board: Board, cpu_piece: str, player_piece: str
) -> MoveCoordinates:
    """Hard difficulty — always picks the optimal move via minimax."""
    empty = _empty_squares(board)
    best_score = -100.0
    best_moves: list[tuple[int, int]] = []

    for r, c in empty:
        board[r][c] = cpu_piece
        score = minimax(board, False, cpu_piece, player_piece, depth=1)
        board[r][c] = None
        if score > best_score:
            best_score = score
            best_moves = [(r, c)]
        elif score == best_score:
            best_moves.append((r, c))

    r, c = random.choice(best_moves)
    return MoveCoordinates(row=r, col=c)


def get_medium_move(
    board: Board, cpu_piece: str, player_piece: str
) -> MoveCoordinates:
    """Medium difficulty — 70% optimal, 30% random valid move."""
    empty = _empty_squares(board)
    if random.random() < 0.3 and len(empty) > 1:
        r, c = random.choice(empty)
        return MoveCoordinates(row=r, col=c)
    return get_best_move(board, cpu_piece, player_piece)


def get_easy_move(
    board: Board, cpu_piece: str, player_piece: str
) -> MoveCoordinates:
    """Easy difficulty — random with edge bias, occasionally misses wins/blocks."""
    empty = _empty_squares(board)
    edges = [(r, c) for r, c in empty if (r, c) in {(0, 1), (1, 0), (1, 2), (2, 1)}]
    corners = [(r, c) for r, c in empty if (r, c) in {(0, 0), (0, 2), (2, 0), (2, 2)}]
    center = [(r, c) for r, c in empty if (r, c) == (1, 1)]

    # Weighted selection: edges 50%, corners 30%, center 20%
    weighted: list[tuple[int, int]] = []
    weighted.extend(edges * 5)
    weighted.extend(corners * 3)
    weighted.extend(center * 2)

    if weighted:
        r, c = random.choice(weighted)
    else:
        r, c = random.choice(empty)

    return MoveCoordinates(row=r, col=c)


def compute_move_for_difficulty(
    board: Board,
    difficulty: str,
    cpu_piece: str,
    player_piece: str,
) -> MoveCoordinates:
    if difficulty == "hard":
        return get_best_move(board, cpu_piece, player_piece)
    if difficulty == "medium":
        return get_medium_move(board, cpu_piece, player_piece)
    return get_easy_move(board, cpu_piece, player_piece)

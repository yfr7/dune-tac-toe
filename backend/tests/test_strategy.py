"""Unit tests for the deterministic tic-tac-toe strategy engine."""

import pytest

from graph.strategy import (
    check_winner,
    compute_move_for_difficulty,
    get_best_move,
    get_easy_move,
    get_medium_move,
)


class TestCheckWinner:
    def test_x_wins_row(self):
        board = [["X", "X", "X"], [None, None, None], [None, None, None]]
        assert check_winner(board) == "X"

    def test_o_wins_column(self):
        board = [["O", None, None], ["O", None, None], ["O", None, None]]
        assert check_winner(board) == "O"

    def test_x_wins_diagonal(self):
        board = [["X", None, None], [None, "X", None], [None, None, "X"]]
        assert check_winner(board) == "X"

    def test_o_wins_anti_diagonal(self):
        board = [[None, None, "O"], [None, "O", None], ["O", None, None]]
        assert check_winner(board) == "O"

    def test_no_winner(self):
        board = [["X", "O", "X"], ["O", "X", None], [None, None, "O"]]
        assert check_winner(board) is None

    def test_empty_board(self):
        board = [[None] * 3 for _ in range(3)]
        assert check_winner(board) is None

    def test_draw(self):
        board = [["X", "O", "X"], ["X", "O", "O"], ["O", "X", "X"]]
        assert check_winner(board) is None


class TestGetBestMove:
    def test_takes_winning_move(self):
        board = [["O", "O", None], ["X", "X", None], [None, None, None]]
        move = get_best_move(board, "O", "X")
        assert (move.row, move.col) == (0, 2)

    def test_blocks_opponent_win(self):
        # X threatens row 0, O must block at (0,2)
        board = [["X", "X", None], [None, "O", None], [None, None, None]]
        move = get_best_move(board, "O", "X")
        assert (move.row, move.col) == (0, 2)

    def test_returns_valid_move_on_empty_board(self):
        board = [[None] * 3 for _ in range(3)]
        move = get_best_move(board, "O", "X")
        assert 0 <= move.row <= 2
        assert 0 <= move.col <= 2

    def test_never_loses_against_itself(self):
        """Play 100 full games of minimax vs minimax — all must draw."""
        for _ in range(100):
            board = [[None] * 3 for _ in range(3)]
            current = "O"
            for _turn in range(9):
                piece = current
                opponent = "X" if current == "O" else "O"
                move = get_best_move(board, piece, opponent)
                board[move.row][move.col] = piece
                winner = check_winner(board)
                if winner:
                    pytest.fail(f"{winner} won — minimax should always draw")
                current = "X" if current == "O" else "O"

    def test_wins_when_possible(self):
        # O has diagonal (0,0)+(1,1), taking (2,2) wins immediately
        board = [["O", None, "X"], [None, "O", None], ["X", None, None]]
        move = get_best_move(board, "O", "X")
        assert (move.row, move.col) == (2, 2)


class TestGetMediumMove:
    def test_returns_valid_move(self):
        board = [["X", None, None], [None, "O", None], [None, None, None]]
        for _ in range(50):
            move = get_medium_move(board, "O", "X")
            assert board[move.row][move.col] is None

    def test_handles_nearly_full_board(self):
        board = [["X", "O", "X"], ["O", "X", "O"], ["O", "X", None]]
        move = get_medium_move(board, "O", "X")
        assert (move.row, move.col) == (2, 2)


class TestGetEasyMove:
    def test_returns_valid_move(self):
        board = [["X", None, None], [None, "O", None], [None, None, None]]
        for _ in range(50):
            move = get_easy_move(board, "O", "X")
            assert board[move.row][move.col] is None

    def test_handles_nearly_full_board(self):
        board = [["X", "O", "X"], ["O", "X", "O"], ["O", "X", None]]
        move = get_easy_move(board, "O", "X")
        assert (move.row, move.col) == (2, 2)

    def test_handles_single_empty_square(self):
        board = [["X", "O", "X"], ["O", "X", "O"], ["O", None, "X"]]
        move = get_easy_move(board, "O", "X")
        assert (move.row, move.col) == (2, 1)


class TestComputeMoveForDifficulty:
    def test_hard_returns_valid_move(self):
        board = [[None] * 3 for _ in range(3)]
        move = compute_move_for_difficulty(board, "hard", "O", "X")
        assert board[move.row][move.col] is None

    def test_medium_returns_valid_move(self):
        board = [[None] * 3 for _ in range(3)]
        move = compute_move_for_difficulty(board, "medium", "O", "X")
        assert board[move.row][move.col] is None

    def test_easy_returns_valid_move(self):
        board = [[None] * 3 for _ in range(3)]
        move = compute_move_for_difficulty(board, "easy", "O", "X")
        assert board[move.row][move.col] is None

    def test_unknown_difficulty_defaults_to_easy(self):
        board = [[None] * 3 for _ in range(3)]
        move = compute_move_for_difficulty(board, "unknown", "O", "X")
        assert board[move.row][move.col] is None

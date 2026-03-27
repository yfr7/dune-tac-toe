"""Integration tests for POST /api/move with mocked OpenAI responses."""

import json
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from main import app
from prompts import FALLBACK_COMMENTARY

client = TestClient(app)

EMPTY_BOARD = [[None] * 3 for _ in range(3)]
BOARD_WITH_X = [["X", None, None], [None, None, None], [None, None, None]]


def make_llm_response(move: dict, commentary: str) -> MagicMock:
    """Create a mock OpenAI chat completion response."""
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = json.dumps(
        {"move": move, "commentary": commentary}
    )
    return mock_response


def post_move(board, character="baron_harkonnen"):
    return client.post(
        "/api/move",
        json={
            "board": board,
            "character": character,
            "player_piece": "X",
            "cpu_piece": "O",
        },
    )


class TestValidMoves:
    @patch("graph.nodes.client.chat.completions.create")
    def test_returns_valid_move_and_commentary(self, mock_create):
        mock_create.return_value = make_llm_response(
            {"row": 1, "col": 1}, "The Palace is mine!"
        )
        response = post_move(BOARD_WITH_X)
        assert response.status_code == 200
        data = response.json()
        assert data["move"] == {"row": 1, "col": 1}
        assert data["commentary"] == "The Palace is mine!"

    @patch("graph.nodes.client.chat.completions.create")
    def test_returns_200_with_correct_content_type(self, mock_create):
        mock_create.return_value = make_llm_response(
            {"row": 0, "col": 1}, "Carthag falls."
        )
        response = post_move(BOARD_WITH_X)
        assert response.status_code == 200
        assert "application/json" in response.headers["content-type"]

    @patch("graph.nodes.client.chat.completions.create")
    def test_move_is_on_empty_square(self, mock_create):
        mock_create.return_value = make_llm_response(
            {"row": 2, "col": 2}, "The Heighliner is ours."
        )
        response = post_move(BOARD_WITH_X)
        data = response.json()
        # (2,2) is empty on BOARD_WITH_X
        assert data["move"] == {"row": 2, "col": 2}

    def test_rejects_invalid_character(self):
        response = client.post(
            "/api/move",
            json={
                "board": EMPTY_BOARD,
                "character": "invalid_character",
                "player_piece": "X",
                "cpu_piece": "O",
            },
        )
        assert response.status_code == 422

    def test_rejects_missing_board(self):
        response = client.post(
            "/api/move",
            json={
                "character": "baron_harkonnen",
                "player_piece": "X",
                "cpu_piece": "O",
            },
        )
        assert response.status_code == 422


class TestFallbackOnInvalidLLM:
    @patch("graph.nodes.client.chat.completions.create")
    def test_fallback_on_malformed_json(self, mock_create):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "this is not json"
        mock_create.return_value = mock_response

        response = post_move(BOARD_WITH_X)
        assert response.status_code == 200
        data = response.json()
        # Should pick a random empty square
        assert 0 <= data["move"]["row"] <= 2
        assert 0 <= data["move"]["col"] <= 2
        # Should use fallback commentary
        assert data["commentary"] == FALLBACK_COMMENTARY

    @patch("graph.nodes.client.chat.completions.create")
    def test_fallback_on_occupied_square(self, mock_create):
        mock_create.return_value = make_llm_response(
            {"row": 0, "col": 0}, "Arrakeen is mine!"
        )
        # (0,0) is already X
        response = post_move(BOARD_WITH_X)
        data = response.json()
        # Should NOT place on (0,0) since it's occupied
        assert data["move"] != {"row": 0, "col": 0}
        assert data["commentary"] == FALLBACK_COMMENTARY

    @patch("graph.nodes.client.chat.completions.create")
    def test_fallback_on_missing_move_key(self, mock_create):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = json.dumps(
            {"commentary": "No move here"}
        )
        mock_create.return_value = mock_response

        response = post_move(BOARD_WITH_X)
        data = response.json()
        assert data["commentary"] == FALLBACK_COMMENTARY
        assert data["move"]["row"] in range(3)

    @patch("graph.nodes.client.chat.completions.create")
    def test_fallback_on_out_of_bounds_move(self, mock_create):
        mock_create.return_value = make_llm_response(
            {"row": 5, "col": 0}, "Beyond the grid!"
        )
        response = post_move(BOARD_WITH_X)
        data = response.json()
        assert data["commentary"] == FALLBACK_COMMENTARY
        assert 0 <= data["move"]["row"] <= 2
        assert 0 <= data["move"]["col"] <= 2

    @patch("graph.nodes.client.chat.completions.create")
    def test_fallback_on_empty_response(self, mock_create):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = ""
        mock_create.return_value = mock_response

        response = post_move(BOARD_WITH_X)
        data = response.json()
        assert data["commentary"] == FALLBACK_COMMENTARY


class TestPromptConstruction:
    @patch("graph.nodes.client.chat.completions.create")
    def test_baron_prompt_includes_character_details(self, mock_create):
        mock_create.return_value = make_llm_response(
            {"row": 1, "col": 1}, "Scheming..."
        )
        post_move(BOARD_WITH_X, character="baron_harkonnen")

        prompt = mock_create.call_args[1]["messages"][0]["content"]
        assert "Baron Vladimir Harkonnen" in prompt
        assert "cruel" in prompt.lower() or "mocking" in prompt.lower()
        assert "expert" in prompt.lower() or "optimal" in prompt.lower()

    @patch("graph.nodes.client.chat.completions.create")
    def test_reverend_mother_prompt_includes_character_details(self, mock_create):
        mock_create.return_value = make_llm_response(
            {"row": 1, "col": 1}, "Foreseen..."
        )
        post_move(BOARD_WITH_X, character="reverend_mother")

        prompt = mock_create.call_args[1]["messages"][0]["content"]
        assert "Reverend Mother" in prompt
        assert "bene gesserit" in prompt.lower() or "cryptic" in prompt.lower()
        assert "competent" in prompt.lower()

    @patch("graph.nodes.client.chat.completions.create")
    def test_stilgar_prompt_includes_character_details(self, mock_create):
        mock_create.return_value = make_llm_response(
            {"row": 1, "col": 1}, "Shai-Hulud!"
        )
        post_move(BOARD_WITH_X, character="stilgar")

        prompt = mock_create.call_args[1]["messages"][0]["content"]
        assert "Stilgar" in prompt
        assert "fremen" in prompt.lower() or "desert" in prompt.lower()
        assert "poor" in prompt.lower() or "suboptimal" in prompt.lower()

    @patch("graph.nodes.client.chat.completions.create")
    def test_prompt_includes_board_state(self, mock_create):
        mock_create.return_value = make_llm_response(
            {"row": 1, "col": 1}, "Move."
        )
        post_move(BOARD_WITH_X, character="baron_harkonnen")

        prompt = mock_create.call_args[1]["messages"][0]["content"]
        assert "Arrakeen: X" in prompt
        assert "Carthag: empty" in prompt
        assert "The Palace: empty" in prompt

    @patch("graph.nodes.client.chat.completions.create")
    def test_prompt_includes_piece_assignments(self, mock_create):
        mock_create.return_value = make_llm_response(
            {"row": 1, "col": 1}, "Move."
        )
        post_move(BOARD_WITH_X, character="baron_harkonnen")

        prompt = mock_create.call_args[1]["messages"][0]["content"]
        assert "Your piece is O" in prompt
        assert "human plays X" in prompt

"""Integration tests for POST /api/move with mocked OpenAI responses."""

from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from main import app
from models import LLMCommentary
from prompts import FALLBACK_COMMENTARY

client = TestClient(app)

EMPTY_BOARD = [[None] * 3 for _ in range(3)]
BOARD_WITH_X = [["X", None, None], [None, None, None], [None, None, None]]


def make_llm_response(commentary: str) -> MagicMock:
    """Create a mock OpenAI structured output response."""
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.parsed = LLMCommentary(commentary=commentary)
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
    @patch("graph.nodes.client.beta.chat.completions.parse")
    def test_returns_valid_move_and_commentary(self, mock_parse):
        mock_parse.return_value = make_llm_response("The Palace is mine!")
        response = post_move(BOARD_WITH_X)
        assert response.status_code == 200
        data = response.json()
        assert 0 <= data["move"]["row"] <= 2
        assert 0 <= data["move"]["col"] <= 2
        assert data["commentary"] == "The Palace is mine!"

    @patch("graph.nodes.client.beta.chat.completions.parse")
    def test_returns_200_with_correct_content_type(self, mock_parse):
        mock_parse.return_value = make_llm_response("Carthag falls.")
        response = post_move(BOARD_WITH_X)
        assert response.status_code == 200
        assert "application/json" in response.headers["content-type"]

    @patch("graph.nodes.client.beta.chat.completions.parse")
    def test_move_is_on_empty_square(self, mock_parse):
        mock_parse.return_value = make_llm_response("The Heighliner is ours.")
        response = post_move(BOARD_WITH_X)
        data = response.json()
        r, c = data["move"]["row"], data["move"]["col"]
        # Algorithmic move must be on an empty square
        assert BOARD_WITH_X[r][c] is None

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


class TestFallbackOnLLMFailure:
    @patch("graph.nodes.client.beta.chat.completions.parse")
    def test_fallback_commentary_on_llm_exception(self, mock_parse):
        mock_parse.side_effect = Exception("API error")
        response = post_move(BOARD_WITH_X)
        assert response.status_code == 200
        data = response.json()
        # Move should still be valid (algorithmic, not LLM-dependent)
        r, c = data["move"]["row"], data["move"]["col"]
        assert BOARD_WITH_X[r][c] is None
        assert data["commentary"] == FALLBACK_COMMENTARY

    @patch("graph.nodes.client.beta.chat.completions.parse")
    def test_fallback_commentary_on_empty_parsed(self, mock_parse):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.parsed = None
        mock_parse.return_value = mock_response

        response = post_move(BOARD_WITH_X)
        assert response.status_code == 200
        data = response.json()
        assert data["commentary"] == FALLBACK_COMMENTARY
        assert BOARD_WITH_X[data["move"]["row"]][data["move"]["col"]] is None


class TestPromptConstruction:
    @patch("graph.nodes.client.beta.chat.completions.parse")
    def test_baron_prompt_includes_character_details(self, mock_parse):
        mock_parse.return_value = make_llm_response("Scheming...")
        post_move(BOARD_WITH_X, character="baron_harkonnen")

        prompt = mock_parse.call_args[1]["messages"][0]["content"]
        assert "Baron Vladimir Harkonnen" in prompt
        assert "contempt" in prompt.lower() or "vicious" in prompt.lower()

    @patch("graph.nodes.client.beta.chat.completions.parse")
    def test_reverend_mother_prompt_includes_character_details(self, mock_parse):
        mock_parse.return_value = make_llm_response("Foreseen...")
        post_move(BOARD_WITH_X, character="reverend_mother")

        prompt = mock_parse.call_args[1]["messages"][0]["content"]
        assert "Reverend Mother" in prompt
        assert "bene gesserit" in prompt.lower() or "cold" in prompt.lower()

    @patch("graph.nodes.client.beta.chat.completions.parse")
    def test_stilgar_prompt_includes_character_details(self, mock_parse):
        mock_parse.return_value = make_llm_response("Shai-Hulud!")
        post_move(BOARD_WITH_X, character="stilgar")

        prompt = mock_parse.call_args[1]["messages"][0]["content"]
        assert "Stilgar" in prompt
        assert "fremen" in prompt.lower() or "desert" in prompt.lower()

    @patch("graph.nodes.client.beta.chat.completions.parse")
    def test_prompt_includes_board_state(self, mock_parse):
        mock_parse.return_value = make_llm_response("Move.")
        post_move(BOARD_WITH_X, character="baron_harkonnen")

        prompt = mock_parse.call_args[1]["messages"][0]["content"]
        assert "Arrakeen: X" in prompt
        assert "Carthag: empty" in prompt
        assert "The Palace: empty" in prompt

    @patch("graph.nodes.client.beta.chat.completions.parse")
    def test_prompt_includes_piece_assignments(self, mock_parse):
        mock_parse.return_value = make_llm_response("Move.")
        post_move(BOARD_WITH_X, character="baron_harkonnen")

        prompt = mock_parse.call_args[1]["messages"][0]["content"]
        assert "You play O" in prompt
        assert "human plays X" in prompt

    @patch("graph.nodes.client.beta.chat.completions.parse")
    def test_prompt_uses_structured_output(self, mock_parse):
        mock_parse.return_value = make_llm_response("Move.")
        post_move(BOARD_WITH_X, character="baron_harkonnen")

        assert mock_parse.call_args[1]["response_format"] is LLMCommentary

import os
from unittest.mock import MagicMock, patch

# Set dummy env vars before any import touches config.py
os.environ.setdefault("OPENAI_API_KEY", "sk-test-dummy-key")

# Patch OpenAI constructor before graph.client module is imported
# This prevents the real OpenAI client from being created (avoids proxy issues)
_mock_openai = patch("openai.OpenAI", return_value=MagicMock())
_mock_openai.start()

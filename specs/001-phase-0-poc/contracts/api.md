# API Contract: Dune Tac Toe Backend

**Date**: 2026-03-27
**Base URL**: `http://localhost:8000` (development)
**Frontend proxy**: Vite dev server proxies `/api/*` to the backend

## Endpoints

### GET /api/health

Health check endpoint.

**Request**: No parameters.

**Response** (`200 OK`):
```json
{
  "status": "ok"
}
```

### POST /api/move

Request a CPU move and in-character commentary for the given board state and character.

**Request body** (`application/json`):
```json
{
  "board": [
    ["X", null, "O"],
    [null, null, null],
    [null, null, null]
  ],
  "character": "baron_harkonnen",
  "player_piece": "X",
  "cpu_piece": "O"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| board | `(string \| null)[][]` | Yes | 3x3 array. Values: `"X"`, `"O"`, or `null` |
| character | string | Yes | One of: `"baron_harkonnen"`, `"reverend_mother"`, `"stilgar"` |
| player_piece | string | Yes | `"X"` or `"O"` |
| cpu_piece | string | Yes | `"X"` or `"O"` |

**Response** (`200 OK`):
```json
{
  "move": {
    "row": 1,
    "col": 1
  },
  "commentary": "You dare claim Arrakeen? How delightfully naive. The Palace is mine now."
}
```

| Field | Type | Description |
|-------|------|-------------|
| move.row | integer | Row position, 0-2 |
| move.col | integer | Column position, 0-2 |
| commentary | string | In-character text from the selected opponent |

**Error responses**:

| Status | Cause | Frontend handling |
|--------|-------|-------------------|
| 422 | Invalid request body (Pydantic validation) | Show error toast; should not happen with correct frontend types |
| 500 | LLM API failure or internal error | Show error toast with retry option |

**Behavioral guarantees**:
- The returned move is always on an empty square (backend validates and falls back to random empty square if LLM returns an invalid move)
- Commentary is always present (falls back to: "The spice... clouds my vision. I place my mark here.")
- A single LLM call is made per request (no retries or chains within the backend)

## CORS

Backend allows requests from `http://localhost:5173` (Vite dev server). In production, this would be configured via environment variable.

## Authentication

None. No API keys or tokens required from the frontend.

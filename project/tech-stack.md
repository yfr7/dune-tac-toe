# Tech Stack

> Technical architecture and tooling for [Dune Tac Toe](prd.md).

## Overview

```
┌─────────────────────────────┐
│   Frontend (Vite + React)   │
│   TypeScript, CSS           │
│   Port 5173                 │
├─────────────────────────────┤
│          REST API           │
├─────────────────────────────┤
│   Backend (Python + FastAPI)│
│   uv, LangGraph            │
│   Port 8000                 │
├─────────────────────────────┤
│   OpenAI GPT 5.x API       │
└─────────────────────────────┘
```

## Frontend

| Choice | Detail |
|--------|--------|
| **Build tool** | [Vite](https://vitejs.dev/) |
| **Framework** | [React 19](https://react.dev/) with TypeScript |
| **Styling** | CSS Modules or vanilla CSS (no UI library for PoC) |
| **HTTP client** | `fetch` API (no axios needed for PoC) |

### Key Frontend Responsibilities
- Render the game board with [Dune theming](theme.md)
- Manage local game state (board, turns, win detection)
- In Human vs CPU mode, call the backend API after each human move
- Display LLM-generated commentary alongside CPU moves

## Backend

| Choice | Detail |
|--------|--------|
| **Runtime** | Python 3.12+ |
| **Package manager** | [uv](https://github.com/astral-sh/uv) |
| **Framework** | [FastAPI](https://fastapi.tiangolo.com/) |
| **Server** | Uvicorn (bundled with FastAPI) |

### Key Backend Responsibilities
- Expose a REST endpoint for CPU move generation
- Orchestrate LLM calls via LangGraph
- Validate LLM responses (ensure valid board positions)
- Serve CORS headers for local frontend development

### API Endpoints

#### `POST /api/move`

Request:
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

Response:
```json
{
  "move": { "row": 1, "col": 1 },
  "commentary": "You dare claim Arrakeen? How delightfully naive. The Palace is mine now, and soon... everything else."
}
```

#### `GET /api/health`

Returns `{ "status": "ok" }` for basic health checks.

## LLM Layer

| Choice | Detail |
|--------|--------|
| **Orchestration** | [LangGraph](https://langchain-ai.github.io/langgraph/) |
| **Model** | OpenAI GPT 5.x |
| **API** | OpenAI Python SDK via LangGraph |

### Why LangGraph?

For the PoC, a single LLM call would suffice. LangGraph is included to:
- Structure the prompt/response flow as a graph (board state -> prompt assembly -> LLM call -> response validation)
- Provide a foundation for more complex agent behavior in future phases (e.g., multi-step reasoning, memory of past games)
- Make it easy to swap models or add tool use later

### Prompt Strategy

Difficulty is controlled entirely via prompt engineering (see [Game Design - Difficulty](game-design.md#difficulty-via-prompt-engineering)). A single prompt per CPU turn includes:
- The character's personality description
- Difficulty instructions (play optimally, moderately, or poorly)
- Current board state with location names
- Output format instructions (structured JSON)

## Development Environment

| Tool | Purpose |
|------|---------|
| `uv` | Python dependency management and virtual environments |
| `npm` / `pnpm` | Node dependency management for frontend |
| `vite dev` | Frontend dev server with hot reload |
| `uvicorn` | Backend dev server with auto-reload |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for GPT 5.x access |

## Related Documents

- [PRD](prd.md) - Product vision and goals
- [Phase 0](phase-0.md) - Feature scope
- [Theme & Design](theme.md) - Visual specifications
- [Game Design](game-design.md) - Mechanics and AI behavior

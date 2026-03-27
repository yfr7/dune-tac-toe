# Quickstart: Dune Tac Toe Development

**Date**: 2026-03-27

## Prerequisites

- Python 3.14+
- Node.js 22+ (with npm/pnpm)
- [uv](https://github.com/astral-sh/uv) (Python package manager)
- OpenAI API key (for CPU mode)

## Backend Setup

```bash
cd backend

# Install dependencies
uv sync

# Create .env file
cp .env.example .env
# Edit .env and set OPENAI_API_KEY

# Run the server
uv run uvicorn main:app --reload --port 8000
```

Backend serves at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Frontend serves at `http://localhost:5173`. Vite proxies `/api/*` requests to the backend.

## Running Tests

```bash
# Backend tests
cd backend && uv run pytest

# Frontend tests
cd frontend && npm run test:run

# Frontend tests (watch mode)
cd frontend && npm test
```

## Development Workflow

1. Start backend first (`uv run uvicorn main:app --reload`)
2. Start frontend (`npm run dev`)
3. Open `http://localhost:5173` in a desktop browser (1024px+ viewport)
4. Human vs Human mode works without the backend running
5. Human vs CPU mode requires the backend + valid `OPENAI_API_KEY`

## Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | `backend/.env` | OpenAI API key for LLM calls |
| `OPENAI_MODEL` | `backend/.env` | Model name (default: `gpt-4.1`) |
| `FRONTEND_ORIGIN` | `backend/.env` | CORS origin (default: `http://localhost:5173`) |

# Start the frontend dev server (http://localhost:5173)
frontend:
    cd frontend && npm run dev

# Start the backend dev server (http://localhost:8000)
backend:
    cd backend && uv run uvicorn main:app --reload --port 8000

# Start both frontend and backend in parallel
dev:
    just backend & just frontend

# Run frontend tests (watch mode)
test-frontend:
    cd frontend && npm test

# Run backend tests
test-backend:
    cd backend && uv run pytest

# Run all tests
test:
    cd backend && uv run pytest
    cd frontend && npm run test:run

# Install all dependencies
install:
    cd backend && uv sync
    cd frontend && npm install

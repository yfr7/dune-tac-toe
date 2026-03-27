# Implementation Plan: Phase 0 - Proof of Concept

**Branch**: `001-phase-0-poc` | **Date**: 2026-03-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-phase-0-poc/spec.md`

## Summary

Deliver a playable Dune-themed Tic-tac-toe game with two modes (Human vs Human, Human vs CPU) where CPU opponents are LLM-powered Dune characters with distinct personalities and difficulty levels. The backend scaffold (FastAPI + LangGraph + OpenAI) already exists. The primary work is building the frontend game UI and integrating it with the existing backend API.

## Technical Context

**Language/Version**: Python 3.14 (backend), TypeScript 5.9 (frontend)
**Primary Dependencies**: FastAPI, LangGraph, OpenAI SDK (backend); React 19, Tailwind CSS v4, shadcn/ui, Vite 8 (frontend)
**Storage**: N/A (no persistence — all state is in-memory per session)
**Testing**: pytest + httpx (backend); Vitest + React Testing Library (frontend)
**Target Platform**: Desktop web browser (1024px+ viewport)
**Project Type**: Web application (frontend SPA + backend API)
**Performance Goals**: CPU move + commentary response under 3 seconds
**Constraints**: No persistent storage, no authentication, desktop-first, single browser tab
**Scale/Scope**: Single concurrent player, 3 pre-defined CPU opponents, 9-cell game board

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution file (`.specify/memory/constitution.md`) contains only template placeholders — no project-specific principles have been defined. No gates to evaluate. Proceeding.

## Project Structure

### Documentation (this feature)

```text
specs/001-phase-0-poc/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md           # REST API contract
├── checklists/          # Quality checklists
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── main.py              # FastAPI app, CORS, route handlers [EXISTS]
├── models.py            # Pydantic request/response models [EXISTS]
├── config.py            # Settings (env vars) [EXISTS]
├── graph/               # LangGraph pipeline [EXISTS]
│   ├── __init__.py      # Graph build + get_cpu_move entry point
│   ├── state.py         # GraphState TypedDict
│   ├── nodes.py         # call_llm, parse_response, fallback_move
│   └── client.py        # OpenAI client instance
├── prompts/             # Character prompts + builder [EXISTS]
│   ├── characters.py    # Character data, board locations, fallback
│   └── builder.py       # Prompt template assembly
└── tests/               # Backend tests [EXISTS, partial]
    ├── test_models.py
    └── test_health.py

frontend/
├── src/
│   ├── main.tsx                    # App entry point [EXISTS]
│   ├── App.tsx                     # Root component [EXISTS - needs replacement]
│   ├── App.css                     # Global styles [EXISTS - needs replacement]
│   ├── index.css                   # Tailwind base + theme tokens [EXISTS - needs update]
│   ├── types/
│   │   └── index.ts                # Shared TypeScript types [EXISTS]
│   ├── lib/
│   │   └── utils.ts                # Utility functions (cn helper) [EXISTS]
│   ├── data/
│   │   ├── characters.ts           # Character definitions (name, description, difficulty) [NEW]
│   │   ├── locations.ts            # Board location names and lore [NEW]
│   │   └── quotes.ts               # Pre-written game over quotes [NEW]
│   ├── hooks/
│   │   ├── index.ts                # Hook re-exports [EXISTS]
│   │   ├── use-game.ts             # Core game state machine (turns, win/draw, reset) [NEW]
│   │   └── use-cpu-move.ts         # API call to backend for CPU move [NEW]
│   ├── components/
│   │   ├── index.ts                # Component re-exports [EXISTS]
│   │   ├── ui/
│   │   │   └── button.tsx          # shadcn button [EXISTS]
│   │   ├── title-screen.tsx        # Title + mode selection [NEW]
│   │   ├── opponent-select.tsx     # CPU opponent card picker [NEW]
│   │   ├── game-board.tsx          # 3x3 grid with Dune locations [NEW]
│   │   ├── board-cell.tsx          # Individual cell (hover, placed, disabled states) [NEW]
│   │   ├── turn-indicator.tsx      # Current turn / CPU thinking display [NEW]
│   │   ├── commentary-box.tsx      # CPU commentary dialogue area [NEW]
│   │   ├── game-over-overlay.tsx   # Win/draw overlay with quote and actions [NEW]
│   │   └── error-toast.tsx         # Error notification with retry [NEW]
│   └── test/
│       └── setup.ts                # Test setup [EXISTS]
└── tests/                          # Component and hook tests [NEW]
    ├── use-game.test.ts
    ├── use-cpu-move.test.ts
    ├── title-screen.test.tsx
    ├── opponent-select.test.tsx
    ├── game-board.test.tsx
    ├── game-over-overlay.test.tsx
    └── app-integration.test.tsx
```

**Structure Decision**: Web application with existing frontend/backend split. Backend scaffold is largely complete. Frontend needs full game UI built on top of the existing Vite + React + Tailwind + shadcn scaffold.

## Implementation Phases

### Phase A: Game Logic & Data Layer (no UI)

Build the core game engine as custom hooks and data modules, fully testable without rendering.

1. **Static data modules** (`data/characters.ts`, `data/locations.ts`, `data/quotes.ts`)
   - Character definitions matching backend's three characters
   - Board location names in grid order
   - Pre-written game over quotes by outcome and opponent

2. **Core game hook** (`hooks/use-game.ts`)
   - State: board (3x3), currentTurn (X/O), gameMode, selectedOpponent, gameStatus (idle/playing/won/draw), winner, winningLine
   - Actions: startGame(mode, opponent?), placeMove(row, col), resetGame(), rematch()
   - Win/draw detection after each move (8 win lines + full board check)
   - Turn alternation logic
   - Guard: reject moves on occupied cells, reject moves when not the current player's turn

3. **CPU move hook** (`hooks/use-cpu-move.ts`)
   - Calls `POST /api/move` with current board state and character
   - Returns: move position, commentary, loading state, error state
   - Handles: network errors, timeout feedback (5s threshold), retry mechanism
   - On invalid response: not needed (backend already handles fallback)

### Phase B: UI Components (visual layer)

Build each screen/component with Dune theming per the design system.

1. **Theme setup** — Update `index.css` with CSS custom properties from the theme spec (color tokens, spacing, typography, animation tokens)

2. **Title Screen** — Game title (Cormorant Garamond, gold), subtitle, two mode buttons (HvH, HvCPU). Full viewport centered layout.

3. **Opponent Selection** — Three character cards in a row. Each shows name, difficulty badge (color-coded), personality teaser, spice icons. Card hover/focus states. Click selects and starts game.

4. **Game Board + Cells** — 3x3 grid (480px max-width), cells as buttons with location names. States: empty, hover, X placed, O placed, winning glow, disabled. Turn indicator above board.

5. **Commentary Box** — Below board, shows CPU character name + commentary in italic display font. Opponent-themed border/background. Fade-in animation. Hidden until first CPU move.

6. **Game Over Overlay** — Semi-transparent scrim, centered modal with winner text, closing quote, Play Again + Rematch buttons.

7. **Error Toast** — Bottom-center notification for API failures. Red background, dismiss button, retry action. Auto-dismiss after 5 seconds.

### Phase C: Integration & Wiring

Connect components into the full game flow.

1. **App component rewrite** — Replace default Vite template with screen router (title → opponent select → game → game over). Manage current screen via state.

2. **HvH flow** — Title → Board. Use-game hook drives turn alternation and win/draw detection. Game over overlay on completion.

3. **HvCPU flow** — Title → Opponent Select → Board. After human move, trigger use-cpu-move hook. Display commentary, then place CPU piece. Board disabled during CPU thinking.

4. **Error integration** — Wire use-cpu-move error state to error toast. Retry re-sends the same request. 5-second delay feedback.

### Phase D: Backend Hardening

The backend scaffold is functional but needs test coverage and minor refinements.

1. **Integration tests** — Test the `/api/move` endpoint with mocked OpenAI responses. Verify valid moves, fallback on invalid LLM output, character-specific prompt construction.

2. **Error response handling** — Ensure FastAPI returns appropriate HTTP error codes (500 on LLM failure) so the frontend can distinguish error types.

3. **Prompt refinement** — Verify prompts produce consistent JSON output. Test each character's prompt with representative board states.

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Screen routing | React state (no router library) | Only 4 screens with linear flow; a full router adds unnecessary complexity for a PoC |
| Game state | Custom hook (use-game) | Jotai atoms are available but a single hook encapsulates the entire game state machine cleanly for this scope |
| API calls | Fetch via Vite proxy | Proxy already configured; no CORS issues in dev. Generated SDK (`@hey-api/openapi-ts`) can be added later but is not required for PoC |
| Win detection | Frontend-only | Standard tic-tac-toe algorithm — 8 possible win lines checked after each move. No backend involvement needed |
| Game over quotes | Pre-written | Simpler than an additional LLM call. Quotes are defined in `data/quotes.ts` per outcome and opponent |
| Commentary persistence | Visible until next CPU move | Most recent commentary remains visible while human thinks; replaced when CPU moves again |
| Font loading | Google Fonts link + font-display: swap | Cormorant Garamond for display text, Inter already installed via @fontsource-variable/inter |

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| LLM returns non-JSON or invalid moves | Medium | Low | Backend fallback_move node already handles this; frontend receives a valid response regardless |
| LLM response latency exceeds 3s | Medium | Medium | 5-second delay feedback text; retry option on timeout. Consider lowering `max_tokens` if consistently slow |
| Prompt engineering doesn't differentiate difficulty well enough | Medium | Medium | Difficulty instructions are isolated in `characters.py` — can be tuned independently. Test with multiple games per character |
| Tailwind v4 + shadcn/ui compatibility issues | Low | Medium | shadcn/ui already installed and button component works. Extend from existing setup |

## Complexity Tracking

No constitution violations to justify — constitution is unpopulated.

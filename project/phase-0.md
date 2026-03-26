# Phase 0 - Proof of Concept Features

> This document details the feature scope for the initial PoC release of [Dune Tac Toe](prd.md).

## Objective

Deliver a playable, end-to-end vertical slice that proves out LLM-powered gameplay with Dune-themed personality. Every feature below is in scope for Phase 0.

## Features

### F1: Title Screen

- Display game title with Dune-themed typography and background
- Show mode selection: "Human vs Human" and "Human vs CPU"
- Visual styling per the [cinematic dark theme](theme.md#color-palette)

### F2: Opponent Selection (CPU Mode)

- Present three opponent cards, each showing:
  - Character name and difficulty label
  - Brief personality description
  - Visual indicator of difficulty (e.g., 1-3 spice icons)
- Selecting an opponent starts the game with that personality loaded
- See [Game Design - CPU Opponents](game-design.md#cpu-opponents) for personality details

### F3: Game Board

- 3x3 grid where each square is a named Dune location (see [Game Design - Board](game-design.md#the-board))
- Squares display the location name when empty
- Clicking an empty square places the current player's piece (X or O)
- Visual feedback on hover (highlight the square)
- Current turn indicator showing which player is active
- Board is non-interactive during CPU thinking time (show loading state)

### F4: Human vs Human Mode

- Players alternate turns starting with X
- No LLM integration - purely local game logic
- Win/draw detection after each move
- Transition to Game Over screen on completion

### F5: Human vs CPU Mode

- Human always plays as X (goes first)
- After human places a piece, send game state to the backend
- Backend calls the LLM via [LangGraph](tech-stack.md#llm-layer) to get:
  - The CPU's chosen move (board position)
  - An in-character sassy comment
- Display the comment in a speech bubble or dialogue box styled to the opponent
- Animate the CPU's piece placement after the comment appears
- Win/draw detection after each move

### F6: LLM Move Generation

- Single LLM call per CPU turn handles both move selection and commentary
- Prompt includes:
  - Current board state (which locations are taken by whom)
  - Character personality and difficulty instructions
  - Location names for the LLM to reference in commentary
- Response is structured JSON: `{ "move": [row, col], "commentary": "..." }`
- Difficulty is controlled entirely through prompt engineering (see [Game Design - Difficulty](game-design.md#difficulty-via-prompt-engineering))
- Fallback: if LLM returns an invalid move, select a random empty square and log the error

### F7: Game Over Screen

- Display winner announcement or draw
- Show a dramatic Dune-flavored closing quote (LLM-generated or pre-written)
- Options: "Play Again" (return to mode select) or "Rematch" (same settings)

### F8: Error Handling

- Graceful handling of LLM API failures (show a fallback message, allow retry)
- Loading indicator during LLM response time
- Input validation: prevent clicking occupied squares, clicking during CPU turn

## Out of Scope (Future Phases)

- Sound effects and music
- Player accounts or persistent stats
- Online multiplayer (separate devices)
- Additional Dune characters/difficulties
- Game history or replay
- Mobile-optimized layout
- Custom game piece selection (house sigils)
- Animated transitions and particle effects (sand, spice)

## Dependencies

- [Tech Stack](tech-stack.md) for implementation details
- [Theme & Design](theme.md) for visual specifications
- [Game Design](game-design.md) for mechanics and AI behavior

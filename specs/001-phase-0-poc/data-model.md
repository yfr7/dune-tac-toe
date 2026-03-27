# Data Model: Phase 0 - Proof of Concept

**Date**: 2026-03-27
**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Overview

All game state is ephemeral (in-memory, per browser session). No persistence layer. The data model spans frontend state (React) and backend request/response shapes.

## Entities

### GameSession (Frontend)

The top-level state object managed by the `use-game` hook.

| Field | Type | Description |
|-------|------|-------------|
| board | Board (3x3 grid of CellValue) | Current board state. Each cell is `'X'`, `'O'`, or `null` |
| currentTurn | `'X' \| 'O'` | Whose turn it is. Always starts as `'X'` |
| gameMode | `'human-vs-human' \| 'human-vs-cpu'` | Selected game mode |
| selectedOpponent | `CharacterId \| null` | Selected CPU character (null in HvH mode) |
| gameStatus | `'idle' \| 'playing' \| 'won' \| 'draw'` | Current game phase |
| winner | `'X' \| 'O' \| null` | Winning player (null if draw or still playing) |
| winningLine | `[number, number][] \| null` | Array of 3 [row, col] positions forming the winning line (for highlight) |

**State transitions**:
```
idle → playing       (startGame called)
playing → won        (win detected after move)
playing → draw       (all cells filled, no winner)
won → idle           (Play Again pressed)
won → playing        (Rematch pressed)
draw → idle          (Play Again pressed)
draw → playing       (Rematch pressed)
```

### Board (Shared)

A 3x3 two-dimensional array. Fixed size, never grows or shrinks.

| Index | Type | Description |
|-------|------|-------------|
| `[row][col]` | `'X' \| 'O' \| null` | Row 0-2, Column 0-2. `null` = empty |

**Validation rules**:
- Exactly 3 rows, each with exactly 3 columns
- Values constrained to `'X'`, `'O'`, or `null`
- A move can only be placed on a cell where value is `null`

### CpuOpponent (Frontend — static data)

Pre-defined character data displayed on opponent selection cards.

| Field | Type | Description |
|-------|------|-------------|
| id | `'baron_harkonnen' \| 'reverend_mother' \| 'stilgar'` | Unique identifier matching backend |
| name | string | Display name (e.g., "Baron Vladimir Harkonnen") |
| difficulty | `'hard' \| 'medium' \| 'easy'` | Difficulty level |
| difficultyRank | `1 \| 2 \| 3` | Numeric rank for spice icon count |
| description | string | Short personality teaser for the card |

**Identity**: Fixed set of 3, identified by `id`. No duplicates, no runtime creation.

### BoardLocation (Frontend — static data)

Named Dune locations mapped to grid positions.

| Field | Type | Description |
|-------|------|-------------|
| row | `0 \| 1 \| 2` | Grid row |
| col | `0 \| 1 \| 2` | Grid column |
| name | string | Location name (e.g., "Arrakeen", "The Palace") |

**Constraint**: Exactly 9 locations in fixed positions. Center (1,1) is always "The Palace."

### MoveRequest (Backend — Pydantic model, EXISTS)

Sent from frontend to backend when requesting a CPU move.

| Field | Type | Description |
|-------|------|-------------|
| board | `list[list[CellValue]]` | 3x3 grid state |
| character | `CharacterId` | Which CPU opponent to use |
| player_piece | `'X' \| 'O'` | Human's piece (always 'X') |
| cpu_piece | `'X' \| 'O'` | CPU's piece (always 'O') |

### MoveResponse (Backend — Pydantic model, EXISTS)

Returned from backend with the CPU's chosen move and commentary.

| Field | Type | Description |
|-------|------|-------------|
| move | `{ row: int, col: int }` | Board position (0-2 range) |
| commentary | string | In-character comment about the move |

**Validation**: `row` and `col` constrained to 0-2 via Pydantic `Field(ge=0, le=2)`.

### GameOverQuote (Frontend — static data)

Pre-written closing quotes indexed by outcome.

| Field | Type | Description |
|-------|------|-------------|
| outcome | `'human_wins' \| 'cpu_wins' \| 'draw'` | Game result |
| characterId | `CharacterId \| null` | Opponent (null for HvH or draw) |
| quote | string | Thematic closing text |

## Relationships

```
GameSession 1──1 Board
GameSession 0..1──1 CpuOpponent (null in HvH mode)
Board 1──9 BoardLocation (fixed mapping)
GameSession ──> MoveRequest (sent per CPU turn)
MoveRequest ──> MoveResponse (1:1 request-response)
GameSession ──> GameOverQuote (looked up on game completion)
```

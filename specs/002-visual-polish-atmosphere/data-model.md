# Data Model: Phase 1 - Visual Polish & Atmosphere

**Branch**: `002-visual-polish-atmosphere` | **Date**: 2026-03-27

## Overview

This phase introduces no persistent data or backend changes. Two new pieces of frontend state are added to existing React hooks. All data is ephemeral (resets on page refresh).

## New State: Match Score

**Location**: `useGame` hook (extension of existing hook)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `playerWins` | `number` | `0` | Player's win count in current session |
| `cpuWins` | `number` | `0` | CPU's win count in current session |

**Lifecycle**:
- Initialized to `{playerWins: 0, cpuWins: 0}` when opponent is selected
- Incremented on game win (player win increments `playerWins`, CPU win increments `cpuWins`)
- Draws increment neither counter
- Resets to `{0, 0}` when player changes opponent or returns to title screen
- Only active in Human vs CPU mode (not tracked in Human vs Human)

**State transitions**:
```
[Opponent Selected] → {0, 0}
[Player Wins]       → {playerWins + 1, cpuWins}
[CPU Wins]          → {playerWins, cpuWins + 1}
[Draw]              → {playerWins, cpuWins}  (no change)
[Rematch]           → {playerWins, cpuWins}  (preserved)
[Change Opponent]   → {0, 0}
[Return to Title]   → {0, 0}
```

## New State: Document Title

**Location**: `useDocumentTitle` hook (new custom hook)

| Game State | Document Title |
|------------|---------------|
| Title screen | "Dune Tac Toe" |
| Opponent select | "Choose Your Opponent -- Dune Tac Toe" |
| Player's turn | "Your Turn -- Dune Tac Toe" |
| CPU thinking | "{Character} is thinking..." |
| Player wins | "Victory! -- Dune Tac Toe" |
| CPU wins | "Defeat -- Dune Tac Toe" |
| Draw | "Draw -- Dune Tac Toe" |

**Lifecycle**: Reactive -- updates whenever screen or game state changes. Derived from existing game state, no additional storage.

## New Data: Faction Configuration

**Location**: `data/faction-config.ts` (new static data file)

This is a read-only configuration object, not stateful. It maps characters to their visual properties for use across components.

| Property | Type | Description |
|----------|------|-------------|
| `accentColor` | `string` | CSS color value for faction accent |
| `pieceIcon` | `React.ComponentType` | SVG icon component for game pieces |
| `cardIcon` | `React.ComponentType` | SVG icon component for opponent cards |
| `turnText` | `string` | Faction-flavored turn indicator text |
| `victoryTitle` | `string` | Faction-specific win screen title |
| `interstitialQuote` | `string` | Pre-game cinematic quote |

**Player (Atreides)** has a subset: `accentColor`, `pieceIcon`, `turnText`, `victoryTitle`.

## Existing Entities (Unchanged)

The following existing data structures are not modified:

- **Board**: 3x3 array of `'X' | 'O' | null` (unchanged)
- **GameStatus**: `'idle' | 'playing' | 'won' | 'draw'` (unchanged)
- **CharacterId**: `'baron_harkonnen' | 'reverend_mother' | 'stilgar'` (unchanged)
- **Character data**: `data/characters.ts` (modified only to add faction icon references and accent colors)
- **Location data**: `data/locations.ts` (unchanged)
- **Quote data**: `data/quotes.ts` (unchanged)

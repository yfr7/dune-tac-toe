# Feature Specification: Phase 0 - Proof of Concept

**Feature Branch**: `001-phase-0-poc`
**Created**: 2026-03-27
**Status**: Draft
**Input**: User description: "Phase 0 PoC delivering a playable, end-to-end vertical slice of Dune Tac Toe with LLM-powered gameplay, Dune-themed personality, and two game modes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete a Human vs Human Game (Priority: P1)

A player opens the game, sees the Dune-themed title screen, selects "Human vs Human" mode, and plays a full game on a 3x3 grid of named Dune locations. Two players alternate turns on the same screen, placing X and O pieces. The game detects a win or draw and transitions to a game over screen with a dramatic Dune closing quote and options to play again or rematch.

**Why this priority**: This is the foundational game loop. It proves the core board mechanics, turn management, win/draw detection, and full user flow from title screen to game over -- all without external dependencies.

**Independent Test**: Can be fully tested by two people sharing a screen, playing through multiple games (wins for X, wins for O, draws) and verifying all transitions work correctly.

**Acceptance Scenarios**:

1. **Given** the title screen is displayed, **When** the player selects "Human vs Human", **Then** the game board appears with all nine Dune locations visible and the turn indicator shows Player X's turn.
2. **Given** it is Player X's turn, **When** Player X clicks an empty square, **Then** an X piece is placed on that square, the location name dims, and the turn switches to Player O.
3. **Given** Player X has two pieces in a row with the third square empty, **When** Player X clicks that third square, **Then** the game detects a win, highlights the winning line, and shows the game over screen with a Dune-themed closing quote.
4. **Given** all nine squares are filled with no three-in-a-row, **When** the last piece is placed, **Then** the game detects a draw and shows the game over screen with a draw-specific closing quote.
5. **Given** the game over screen is displayed, **When** the player clicks "Play Again", **Then** they return to the title screen mode selection. **When** the player clicks "Rematch", **Then** a new game starts with the same mode and settings.

---

### User Story 2 - Complete a Human vs CPU Game (Priority: P2)

A player selects "Human vs CPU" mode, picks an opponent from three Dune character cards, and plays against the CPU. After each human move, the CPU responds with a move and an in-character sassy comment displayed in a styled dialogue area. The game ends with a win, loss, or draw, accompanied by a character-appropriate closing quote.

**Why this priority**: This is the primary PoC goal -- proving LLM-powered gameplay with personality-driven commentary. It validates the full frontend-to-backend-to-LLM pipeline.

**Independent Test**: Can be tested by a single player selecting each of the three opponents, playing through complete games, and verifying that CPU moves are valid and commentary stays in character.

**Acceptance Scenarios**:

1. **Given** the player selects "Human vs CPU" on the title screen, **When** the opponent selection screen loads, **Then** three character cards are displayed, each showing name, difficulty label, personality description, and a visual difficulty indicator.
2. **Given** the opponent selection screen is displayed, **When** the player selects an opponent card, **Then** the game board appears and the human plays as X (first move).
3. **Given** it is the human's turn, **When** the human places a piece, **Then** the board becomes non-interactive, a loading indicator appears, and after a moment the CPU's in-character commentary appears in a styled dialogue area followed by the CPU's O piece being placed on the board.
4. **Given** the CPU is thinking, **When** the player tries to click a square, **Then** the click is ignored and the board visually indicates it is disabled.
5. **Given** the game ends, **When** the game over screen appears, **Then** a dramatic Dune-themed closing quote appropriate to the outcome and opponent is displayed.

---

### User Story 3 - Experience Distinct CPU Opponent Personalities (Priority: P3)

A player plays multiple games against different opponents and experiences noticeably different difficulty levels and personality styles. The Baron plays aggressively and mocks the player. The Reverend Mother plays competently with cryptic commentary. Stilgar plays poorly with earnest, confused desert wisdom.

**Why this priority**: Personality differentiation is what makes the PoC entertaining and replayable. Without distinct personalities, the LLM integration is a technical demo rather than a compelling experience.

**Independent Test**: Can be tested by playing three games (one per opponent) and comparing move quality, commentary style, and win rates across the three characters.

**Acceptance Scenarios**:

1. **Given** the player selects Baron Harkonnen (Hard), **When** playing a full game, **Then** the CPU plays near-optimally (blocks winning moves, takes winning opportunities) and commentary is cruel, mocking, and references scheming and power.
2. **Given** the player selects Reverend Mother (Medium), **When** playing a full game, **Then** the CPU plays competently but occasionally makes suboptimal moves, and commentary is cryptic, measured, and references prescience and the Bene Gesserit.
3. **Given** the player selects Stilgar (Easy), **When** playing a full game, **Then** the CPU frequently makes weak moves (prefers edges over corners) and commentary is earnest, confused, and references desert survival and Fremen culture.
4. **Given** any CPU opponent, **When** the CPU makes a move, **Then** the commentary references the specific Dune location chosen and/or the opponent's recent move.

---

### User Story 4 - Recover Gracefully from Errors (Priority: P4)

A player is mid-game in CPU mode when the backend service experiences a failure. Instead of the game crashing or freezing, the player sees a clear error message with a retry option. The game board remains in its last valid state and the player can continue.

**Why this priority**: Error resilience is essential for a playable PoC. Backend failures should not destroy the game experience.

**Independent Test**: Can be tested by simulating backend failures and verifying the game recovers without losing state.

**Acceptance Scenarios**:

1. **Given** the CPU is thinking, **When** the backend service fails or times out, **Then** a visible error notification appears with a clear message and a retry option, and the board retains all previously placed pieces.
2. **Given** the backend returns an invalid CPU move, **When** the response is processed, **Then** the system selects a random empty square, places the CPU piece there, and displays a fallback commentary message.
3. **Given** the CPU is thinking, **When** more than 5 seconds elapse, **Then** additional feedback text appears indicating the delay.
4. **Given** a player clicks an occupied square, **When** the click is processed, **Then** the click is rejected with brief visual feedback and no game state changes.

---

### Edge Cases

- What happens when the backend returns a move for an already-occupied square? The system selects a random empty square and logs the error.
- What happens when the backend returns malformed JSON? Treated as an invalid response; fallback move and commentary are used.
- What happens when the backend service is completely unreachable? Error notification with retry option; board state preserved.
- What happens when a player rapidly clicks multiple squares during their turn? Only the first valid click registers; subsequent clicks on occupied squares are rejected.
- What happens when a player clicks during the CPU's thinking time? Clicks are ignored; board is visually disabled.
- What happens when there is only one empty square left and the CPU must move there? CPU places on the remaining square with appropriate commentary.
- What happens when the player resizes the browser window during a game? The board scales proportionally without breaking layout (desktop-first, but no horizontal scrollbar).

## Clarifications

### Session 2026-03-27

- No critical ambiguities detected. Full coverage scan across 10 taxonomy categories (functional scope, domain model, UX flow, non-functional attributes, integrations, edge cases, constraints, terminology, completion signals, placeholders) returned Clear status for all categories.
- Minor consistency fix applied: FR-020 tightened from "before or alongside" to "before" piece placement, aligning with US2 acceptance scenario 3 and the original feature description.

## Requirements *(mandatory)*

### Functional Requirements

**Title Screen**
- **FR-001**: System MUST display a game title with Dune-themed typography and a cinematic dark background.
- **FR-002**: System MUST present two mode options: "Human vs Human" and "Human vs CPU".
- **FR-003**: Selecting a mode MUST navigate to the appropriate next screen (game board for HvH, opponent selection for HvCPU).

**Opponent Selection**
- **FR-004**: System MUST display three opponent cards when CPU mode is selected.
- **FR-005**: Each opponent card MUST show the character name, difficulty label, a brief personality description, and a visual difficulty indicator (1-3 spice icons).
- **FR-006**: Selecting an opponent card MUST start a new game with that character's personality loaded.

**Game Board**
- **FR-007**: System MUST render a 3x3 grid where each cell represents a named Dune location (Arrakeen, Carthag, Giedi Prime, Sietch Tabr, The Palace, Salusa Secundus, Jacurutu, Tuono Basin, Heighliner).
- **FR-008**: Empty cells MUST display their location name.
- **FR-009**: Clicking an empty cell during the current player's turn MUST place that player's piece (X or O) on the cell.
- **FR-010**: Cells MUST provide visual feedback on hover to indicate interactivity.
- **FR-011**: System MUST display a turn indicator showing which player is currently active.
- **FR-012**: Board MUST become non-interactive during CPU thinking time with a visible loading state.

**Human vs Human Mode**
- **FR-013**: Players MUST alternate turns, starting with X.
- **FR-014**: This mode MUST NOT require any backend service calls.
- **FR-015**: System MUST check for win conditions (three in a row horizontally, vertically, or diagonally) and draw conditions (all nine squares filled, no winner) after every move.
- **FR-016**: Upon game completion, system MUST transition to the game over screen.

**Human vs CPU Mode**
- **FR-017**: Human MUST always play as X and go first.
- **FR-018**: After the human places a piece, system MUST send the current game state to the backend service.
- **FR-019**: The backend service MUST return a CPU move position and an in-character commentary text in a single response.
- **FR-020**: System MUST display the CPU's commentary in a styled dialogue area before the piece is placed on the board.
- **FR-021**: System MUST animate the CPU piece placement.
- **FR-022**: System MUST check for win/draw conditions after each move (human and CPU).

**Move Generation**
- **FR-023**: Each CPU turn MUST require only a single backend request that produces both the move and the commentary.
- **FR-024**: The backend request MUST include the current board state, the selected character's personality, and the Dune location names.
- **FR-025**: The backend response MUST be structured data containing the move position (row, column) and commentary text.
- **FR-026**: Difficulty MUST vary by character -- Baron Harkonnen (hard/optimal play), Reverend Mother (medium/competent with occasional mistakes), Stilgar (easy/frequently suboptimal).
- **FR-027**: If the backend returns an invalid move (occupied square, out of bounds, or malformed data), system MUST select a random empty square and use a pre-written fallback commentary.

**Game Over**
- **FR-028**: System MUST display a clear winner announcement or draw declaration.
- **FR-029**: System MUST display a dramatic Dune-themed closing quote appropriate to the game outcome.
- **FR-030**: System MUST offer a "Play Again" option (returns to mode selection) and a "Rematch" option (starts a new game with the same mode and opponent).

**Error Handling**
- **FR-031**: System MUST handle backend service failures gracefully by showing a visible error notification with a cause and retry option, without clearing the board state.
- **FR-032**: System MUST show a loading indicator while waiting for the backend response.
- **FR-033**: System MUST prevent placement on occupied squares with brief visual feedback.
- **FR-034**: System MUST prevent all board interaction during the CPU's turn.

### Key Entities

- **Game Board**: A 3x3 grid of cells. Each cell has a fixed Dune location name and a mutable state (empty, X, or O). The center cell is always "The Palace."
- **CPU Opponent**: A character with a name, difficulty level (easy, medium, hard), personality description, and speaking style. Three pre-defined opponents: Baron Harkonnen, Reverend Mother, Stilgar.
- **Game Move**: A position on the board (row 0-2, column 0-2) paired with optional commentary text (present only for CPU moves).
- **Game Session**: Tracks the current board state, active turn (X or O), game mode (HvH or HvCPU), selected opponent (if CPU mode), and game result (in progress, X wins, O wins, draw).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A player can complete a full Human vs Human game (start to game over) without encountering any errors or broken states.
- **SC-002**: A player can complete a full Human vs CPU game with in-character commentary displayed on every CPU move.
- **SC-003**: The three CPU opponents play at noticeably different skill levels -- Baron Harkonnen wins most games against casual play, Stilgar loses most games, Reverend Mother provides a moderate challenge.
- **SC-004**: CPU commentary references the specific game state (location names, recent moves, board position) and stays in character for the selected opponent.
- **SC-005**: Average time from human move to CPU response (move + commentary displayed) is under 3 seconds.
- **SC-006**: The visual presentation evokes the cinematic Dune aesthetic: dark background, gold accents, thematic typography, and named locations on the board.
- **SC-007**: When the backend service is unavailable, the game displays a clear error with retry option and does not lose any placed pieces.
- **SC-008**: Players cannot place pieces on occupied squares or interact with the board during the CPU's turn under any circumstances.

## Assumptions

- Desktop viewport (1024px+) is the primary target; mobile-optimized layout is explicitly out of scope for Phase 0.
- Players have a stable internet connection when using CPU mode; Human vs Human mode works without any network dependency.
- Three pre-defined CPU opponents only; no custom character creation or additional characters in this phase.
- Sound effects, music, persistent player statistics, online multiplayer, game history/replay, and animated particle effects are all out of scope.
- No user accounts, authentication, or persistent data storage is required.
- Pre-written fallback quotes are acceptable for game over screens alongside any dynamically generated ones.
- The game is played in a single browser tab; no cross-tab or cross-device state synchronization is needed.
- The backend service will be running locally during development and testing.
- Accessibility features (keyboard navigation, screen reader support, WCAG contrast compliance, reduced motion) are not in scope for Phase 0 and are deferred to a future phase.

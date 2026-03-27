# Tasks: Phase 0 - Proof of Concept

**Input**: Design documents from `/specs/001-phase-0-poc/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Theme tokens, static data, and font loading — shared by all user stories

- [ ] T001 [P] Add Dune theme CSS custom properties (color tokens, spacing, typography, animation durations) to frontend/src/index.css
- [ ] T002 [P] Add Cormorant Garamond Google Fonts link to frontend/index.html and define font-family custom properties
- [ ] T003 [P] Create board location data (9 Dune location names mapped to grid positions) in frontend/src/data/locations.ts
- [ ] T004 [P] Create character data (3 opponents with id, name, difficulty, difficultyRank, description) in frontend/src/data/characters.ts
- [ ] T005 [P] Create pre-written game over quotes (per outcome and per opponent) in frontend/src/data/quotes.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core game logic hook and base board components that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Implement core game hook in frontend/src/hooks/use-game.ts — manages board state (3x3 grid), currentTurn alternation (starting X), gameMode, selectedOpponent, gameStatus (idle/playing/won/draw), winner, winningLine; exposes startGame(mode, opponent?), placeMove(row, col), resetGame(), rematch(); includes win detection (8 lines) and draw detection after each move; rejects moves on occupied cells and moves when not current player's turn
- [ ] T007 [P] Create board cell component in frontend/src/components/board-cell.tsx — renders a button element displaying the Dune location name when empty; shows X or O piece when placed (with scale-in animation); hover state with gold-bright border glow; dims location name when piece is placed; accepts onClick, disabled, cellValue, locationName, isWinningCell props
- [ ] T008 [P] Create turn indicator component in frontend/src/components/turn-indicator.tsx — displays current player text ("Player X's turn" / "Player O's turn"); accepts currentTurn and optional cpuThinking props
- [ ] T009 Create game board component in frontend/src/components/game-board.tsx — renders 3x3 grid of BoardCell components (480px max-width); maps each cell to its Dune location name from data/locations.ts; passes click handler, cell value, and disabled state to each cell; highlights winning line cells when game is won

**Checkpoint**: Foundation ready — game board renders with cells, turns display, game logic works. User story implementation can now begin.

---

## Phase 3: User Story 1 — Complete a Human vs Human Game (Priority: P1) MVP

**Goal**: A player navigates from the title screen, selects HvH mode, plays a full game (win or draw), and sees the game over screen with options to play again or rematch.

**Independent Test**: Two people share a screen, play multiple games (X wins, O wins, draw), verify all transitions work correctly.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create title screen component in frontend/src/components/title-screen.tsx — game title in Cormorant Garamond (3rem, gold), subtitle "The Spice Must Flow... But First, Tic-Tac-Toe" in dust/italic, two mode buttons ("Human vs Human", "Human vs CPU") stacked vertically; accepts onSelectMode(mode) callback
- [ ] T011 [P] [US1] Create game over overlay component in frontend/src/components/game-over-overlay.tsx — semi-transparent scrim (sand-dark at 75% opacity), centered modal with winner announcement or draw text (font-display 2rem, gold-bright), Dune closing quote from data/quotes.ts (font-display italic), "Play Again" button (primary: gold bg) and "Rematch" button (secondary: outlined gold); accepts gameResult, opponent, onPlayAgain, onRematch callbacks
- [ ] T012 [US1] Rewrite App.tsx as screen router with state machine in frontend/src/App.tsx — replace default Vite template; manage currentScreen state (title/opponent-select/game/game-over); integrate use-game hook; render TitleScreen, GameBoard, TurnIndicator, GameOverOverlay based on current screen; pass mode selection, move placement, play again, and rematch handlers
- [ ] T013 [US1] Wire complete HvH flow in frontend/src/App.tsx — title screen "Human vs Human" button starts game with mode='human-vs-human'; board renders with turn alternation; clicking empty cells places pieces; win/draw detection triggers game over overlay; "Play Again" returns to title screen; "Rematch" starts fresh game with same settings

**Checkpoint**: User Story 1 fully functional. A complete Human vs Human game can be played start to finish.

---

## Phase 4: User Story 2 — Complete a Human vs CPU Game (Priority: P2)

**Goal**: A player selects CPU mode, picks an opponent, plays against the CPU with in-character commentary on every CPU move, and sees the game over screen.

**Independent Test**: Single player selects each opponent, plays through complete games, verifies CPU moves are valid and commentary appears.

### Implementation for User Story 2

- [ ] T014 [P] [US2] Create opponent selection component in frontend/src/components/opponent-select.tsx — three cards in a row (flex, gap 24px), each card shows character name (heading), difficulty badge (color-coded: hard=blood-red, medium=gold, easy=spice-orange), 1-2 line personality teaser, spice icons (1-3 based on difficultyRank); card hover shows gold border and translateY(-2px); accepts onSelectOpponent(characterId) callback; uses data from data/characters.ts
- [ ] T015 [P] [US2] Implement CPU move hook in frontend/src/hooks/use-cpu-move.ts — calls POST /api/move via fetch (uses Vite proxy at /api); sends board, character, player_piece, cpu_piece; returns { move, commentary, isLoading, error, retry }; handles network errors and non-200 responses; tracks loading state for UI
- [ ] T016 [P] [US2] Create commentary box component in frontend/src/components/commentary-box.tsx — positioned below board (max-width 480px), shows character name label and commentary text in Cormorant Garamond italic; fade-in animation (opacity 0→1 over 300ms); hidden when no commentary exists; accepts characterName, commentary, characterId props
- [ ] T017 [US2] Extend App.tsx screen routing to include opponent selection screen in frontend/src/App.tsx — after "Human vs CPU" selection, show OpponentSelect screen; on opponent card click, start game with mode='human-vs-cpu' and selectedOpponent set
- [ ] T018 [US2] Wire complete HvCPU flow in frontend/src/App.tsx — after human places piece, trigger use-cpu-move hook; display commentary in CommentaryBox; place CPU piece on board after commentary appears; board disabled during CPU thinking; win/draw detection after both human and CPU moves; game over overlay shows opponent-appropriate closing quote

**Checkpoint**: User Stories 1 AND 2 both work independently. Full HvCPU game playable with commentary.

---

## Phase 5: User Story 3 — Experience Distinct CPU Opponent Personalities (Priority: P3)

**Goal**: The three CPU opponents have visually distinct presentation and produce noticeably different difficulty levels and personality styles in their commentary.

**Independent Test**: Play one game per opponent, compare move quality, commentary style, and card/commentary visual styling.

### Implementation for User Story 3

- [ ] T019 [P] [US3] Add opponent-themed styling to commentary box in frontend/src/components/commentary-box.tsx — Baron: deep-blue background at 40% opacity with dust border; Reverend Mother: sand-medium background with gold border and gold label; Stilgar: sand-medium background with spice-orange border and spice-orange label
- [ ] T020 [P] [US3] Add character-specific game over quotes in frontend/src/data/quotes.ts — distinct quotes for: human wins vs Baron, Baron wins, human wins vs Reverend Mother, Reverend Mother wins, human wins vs Stilgar, Stilgar wins, draw (mode-agnostic), HvH win/draw
- [ ] T021 [US3] Update game over overlay to select character-specific quotes in frontend/src/components/game-over-overlay.tsx — look up quote by outcome (human_wins/cpu_wins/draw) and characterId; display the matching Dune-themed closing quote

**Checkpoint**: All three opponents feel distinct in both gameplay and visual presentation.

---

## Phase 6: User Story 4 — Recover Gracefully from Errors (Priority: P4)

**Goal**: Backend failures don't break the game. Clear error messages with retry options. Loading states provide feedback during CPU thinking. Invalid interactions are blocked.

**Independent Test**: Simulate backend failures (stop backend, malformed responses) and verify game recovers without losing state.

### Implementation for User Story 4

- [ ] T022 [P] [US4] Create error toast component in frontend/src/components/error-toast.tsx — bottom-center positioned notification with blood-red background and bone text; shows error message and "Retry" button; dismiss (X) button; auto-dismisses after 5 seconds; accepts message, onRetry, onDismiss props
- [ ] T023 [P] [US4] Add CPU thinking loading state to turn indicator and board in frontend/src/components/turn-indicator.tsx and frontend/src/components/game-board.tsx — turn indicator shows "[Character] is thinking..." with ellipsis animation; board cells become 60% opacity with cursor:wait; after 5 seconds show "The spice is taking longer than usual..."
- [ ] T024 [P] [US4] Add invalid move visual feedback to board cell in frontend/src/components/board-cell.tsx — brief 200ms red flash (blood-red at 20% opacity) when clicking an occupied square; revert to normal after flash
- [ ] T025 [US4] Wire error toast and retry to CPU move hook in frontend/src/App.tsx — on use-cpu-move error, show error toast with descriptive message; "Retry" re-sends the same request; board retains all previously placed pieces during error state

**Checkpoint**: All four user stories work. Game handles errors, loading, and invalid interactions gracefully.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Backend test coverage and final validation across all stories

- [ ] T026 [P] Write backend integration tests for POST /api/move with mocked OpenAI responses in backend/tests/test_move.py — test valid moves, fallback on invalid LLM output, each character's prompt construction
- [ ] T027 [P] Verify frontend App.css cleanup in frontend/src/App.css — remove default Vite template styles; retain only styles needed for the game (or remove file entirely if all styling is via Tailwind/index.css)
- [ ] T028 Run quickstart.md validation — verify backend starts (uv run uvicorn), frontend starts (npm run dev), Vite proxy connects to backend, both HvH and HvCPU flows work end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. All 5 tasks run in parallel.
- **Foundational (Phase 2)**: Depends on Phase 1 completion. T009 (game-board) depends on T007 (board-cell). T006 (use-game), T007 (board-cell), T008 (turn-indicator) can run in parallel. T009 depends on T007.
- **US1 (Phase 3)**: Depends on Foundational (Phase 2). T010, T011 parallel → T012 → T013.
- **US2 (Phase 4)**: Depends on Foundational (Phase 2). Can start in parallel with US1. T014, T015, T016 parallel → T017 → T018.
- **US3 (Phase 5)**: Depends on US2 (Phase 4) — builds on opponent selection and commentary components. T019, T020 parallel → T021.
- **US4 (Phase 6)**: Depends on US2 (Phase 4) — builds on CPU move hook and loading states. T022, T023, T024 parallel → T025.
- **Polish (Phase 7)**: Depends on all user stories being complete. T026, T027 parallel → T028.

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — no dependencies on other stories
- **US2 (P2)**: Can start after Foundational — no dependencies on US1 (opponent select is its own entry point). Can run in parallel with US1.
- **US3 (P3)**: Depends on US2 — extends opponent cards and commentary box with themed styling
- **US4 (P4)**: Depends on US2 — extends CPU move hook with error/loading states

### Within Each User Story

- Data/static modules before components that consume them
- Components before integration/wiring tasks
- Wiring tasks are sequential (modify shared App.tsx)

### Parallel Opportunities

- **Phase 1**: All 5 setup tasks (T001-T005) — different files, no dependencies
- **Phase 2**: T006 (use-game), T007 (board-cell), T008 (turn-indicator) parallel → T009 (game-board after T007)
- **Phase 3**: T010 (title-screen) and T011 (game-over-overlay) — different components
- **Phase 4**: T014 (opponent-select), T015 (use-cpu-move), T016 (commentary-box) — different files
- **Phase 5**: T019 (commentary styling) and T020 (quotes data) — different files
- **Phase 6**: T022 (error-toast), T023 (loading states), T024 (invalid move feedback) — different components
- **Phase 7**: T026 (backend tests) and T027 (CSS cleanup) — different directories
- **Cross-story**: US1 and US2 can proceed in parallel after Foundational phase

---

## Parallel Example: User Story 1

```bash
# Launch parallel component creation:
Task: "Create title screen component in frontend/src/components/title-screen.tsx"
Task: "Create game over overlay component in frontend/src/components/game-over-overlay.tsx"

# Then sequential wiring:
Task: "Rewrite App.tsx as screen router"
Task: "Wire complete HvH flow in App.tsx"
```

## Parallel Example: User Story 2

```bash
# Launch parallel component + hook creation:
Task: "Create opponent selection component in frontend/src/components/opponent-select.tsx"
Task: "Implement CPU move hook in frontend/src/hooks/use-cpu-move.ts"
Task: "Create commentary box component in frontend/src/components/commentary-box.tsx"

# Then sequential wiring:
Task: "Extend App.tsx screen routing for opponent selection"
Task: "Wire complete HvCPU flow in App.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (5 tasks, all parallel)
2. Complete Phase 2: Foundational (4 tasks)
3. Complete Phase 3: User Story 1 (4 tasks)
4. **STOP and VALIDATE**: Play a complete HvH game start to finish
5. Deploy/demo if ready — core game loop proven

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Test HvH independently → **MVP!**
3. Add US2 → Test HvCPU independently → **Core PoC complete**
4. Add US3 → Verify personality differentiation → **Full theme experience**
5. Add US4 → Test error scenarios → **Production-ready PoC**
6. Polish → Backend tests + cleanup → **Ship it**

### Parallel Team Strategy

With multiple developers after Foundational phase:

- Developer A: US1 (HvH flow) → then US3 (personality polish)
- Developer B: US2 (HvCPU flow) → then US4 (error handling)
- Stories integrate cleanly since US1 and US2 share foundational components but have independent wiring

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Backend scaffold (FastAPI + LangGraph + prompts + fallback) is already complete — all new work is frontend
- The only shared mutable file across stories is App.tsx — wiring tasks must be sequential

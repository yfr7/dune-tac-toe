# Tasks: Phase 1 - Visual Polish & Atmosphere

**Input**: Design documents from `/specs/002-visual-polish-atmosphere/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Install new npm dependencies required for visual polish features

- [ ] T001 Install font packages (`@fontsource/cinzel-decorative`, `@fontsource-variable/cinzel`, `@fontsource/orbitron`) in frontend/package.json
- [ ] T002 [P] Install `@neoconfetti/react` for victory confetti effect in frontend/package.json

---

## Phase 2: Foundational (CSS Tokens, Fonts, Icons, Data)

**Purpose**: Establish the CSS foundation, SVG icon components, and data files that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Add new CSS custom property tokens (--font-title, --font-heading, --font-hud, --atreides-blue, --difficulty-easy, --dust-bright), new keyframe animations (draw-line, screen-enter, screen-exit, ripple-expand, glow-burst, victory-pulse, slide-up-fade, particle-drift), warm gradient background with noise texture `::before` overlay, and expose all new tokens in the Tailwind `@theme inline` block in frontend/src/index.css
- [ ] T004 [P] Add font imports (`@fontsource/cinzel-decorative/700.css`, `@fontsource-variable/cinzel`, `@fontsource/orbitron/400.css`) to frontend/src/main.tsx and add `<link rel="preload">` for Cinzel Decorative 700 and Cinzel 700 woff2 files in frontend/index.html
- [ ] T005 [P] Download SVGs from game-icons.net and create 6 React icon components with `currentColor` fill and `aria-hidden="true"` in frontend/src/assets/icons/: PlainDagger.tsx (Lorc/plain-dagger), SeaSerpent.tsx (Lorc/sea-serpent), SpiderAlt.tsx (Carl Olsen/spider-alt), AllSeeingEye.tsx (Delapouite/all-seeing-eye), SandSnake.tsx (Delapouite/sand-snake), HawkEmblem.tsx (Lorc/hawk-emblem)
- [ ] T006 [P] Create faction-config.ts in frontend/src/data/ with centralized faction visual configuration: accent colors (Atreides #4a7c8a, Baron --deep-blue, Reverend Mother --gold, Stilgar --spice-orange), piece/card icon mappings, turn text strings, victory titles, interstitial quotes, and draw title per plan.md Faction Configuration table
- [ ] T007 [P] Add MatchScore type (`{ playerWins: number; cpuWins: number }`) and FactionConfig type to frontend/src/types/index.ts

**Checkpoint**: Foundation ready -- CSS tokens active, fonts loading, SVG icons available, faction data centralized. User story implementation can begin.

---

## Phase 3: User Story 1 - Immersive Desert Atmosphere (Priority: P1)

**Goal**: Transform every screen with textured backgrounds, upgraded typography, and an atmospheric title screen

**Independent Test**: Load the app, navigate through all 4 screens (title, opponent select, game, game over) and verify: warm gradient + noise texture background on all screens, Cinzel Decorative on the game title, Cinzel on headings, gold gradient text effect on title, spice glow behind title area, subtitle with sufficient contrast, gold separator line visible

- [ ] T008 [US1] Update frontend/src/components/title-screen.tsx: apply --font-title (Cinzel Decorative) to game title, add metallic gold gradient text effect via background-clip, add spice glow radial gradient `::before` behind title area, fix subtitle contrast from --dust to --bone at 70% opacity, add thin gold decorative separator (1px --gold at 40% opacity, max-width 200px) between title area and buttons, add `transform: scale(0.97)` on button `:active` state
- [ ] T009 [P] [US1] Apply --font-heading (Cinzel) to H2/H3 heading elements across frontend/src/components/opponent-select.tsx, frontend/src/components/game-over-overlay.tsx, and any other components using display headings

**Checkpoint**: Title screen is atmospheric with gold gradient title, spice glow, and all screens have textured backgrounds and upgraded typography.

---

## Phase 4: User Story 5 - Tactile Game Board (Priority: P5)

**Goal**: Make the game board feel like a carved stone war table with depth, glow, and responsive hover

**Independent Test**: View the game board and verify: layered shadow creating inset/carved depth, warm glow on grid lines, cell hover scales up with brightened location name, custom cursor on empty cells, location names meet 4.5:1 contrast

> Note: Grouped early (before P3-P4) because board improvements share files with Phase 2 and are foundational for animation work. Can run in parallel with US1.

- [ ] T010 [P] [US5] Update frontend/src/components/game-board.tsx: add layered box-shadow (`inset 0 2px 4px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(196,151,59,0.05)`) for carved depth, add subtle spice-glow `box-shadow: 0 0 4px rgba(231,155,7,0.15)` to grid line borders
- [ ] T011 [US5] Update frontend/src/components/board-cell.tsx: add `transform: scale(1.02)` on hover for empty cells, brighten location name to --bone on hover, increase location name font size to 0.75rem with `letter-spacing: 0.08em`, fix location name contrast from --dust to --dust-bright (#a89b88) on --sand-medium background, add custom cursor via CSS `cursor: url('data:image/svg+xml,...') 16 16, crosshair` using Plain Dagger SVG resized to 32x32 on empty non-disabled cells

**Checkpoint**: Game board has carved depth, glowing grid lines, and responsive cell hover effects with accessible contrast.

---

## Phase 5: User Story 2 - Faction Identity & Themed Pieces (Priority: P2)

**Goal**: Replace generic X/O markers with themed Dune icons, make the player feel like House Atreides, and add dynamic browser identity

**Independent Test**: Start a Human vs CPU game and verify: player pieces show as dagger icons in Atreides teal, CPU pieces show as sandworm icons in gold, radial ripple on placement, turn indicator shows faction-flavored text with accent colors, browser tab updates dynamically, custom Dune favicon visible

- [ ] T012 [US2] Update frontend/src/components/board-cell.tsx: replace "X"/"O" text markers with PlainDagger (player) and SeaSerpent (CPU) SVG icon components at 2rem size using `currentColor`, tint player pieces with --atreides-blue and CPU pieces with --gold, add `aria-hidden="true"` to icon SVGs while preserving existing cell aria-labels, add radial ripple animation on piece placement (thin ring of faction-colored light expanding outward, 200ms, opacity 1 to 0 using ripple-expand keyframe)
- [ ] T013 [P] [US2] Update frontend/src/components/turn-indicator.tsx: import faction-config.ts, display faction-flavored turn text ("House Atreides moves" / "Baron Harkonnen schemes..." etc.) instead of generic "Player X's turn" in Human vs CPU mode, keep generic "Player 1's turn" / "Player 2's turn" in Human vs Human mode, color turn text with active faction's accent color, apply --font-hud (Orbitron) to turn indicator text
- [ ] T014 [P] [US2] Create frontend/src/hooks/use-document-title.ts: custom hook that updates `document.title` reactively based on game state -- "Dune Tac Toe" on title screen, "Choose Your Opponent" on select, "Your Turn -- Dune Tac Toe" / "{Character} is thinking..." during game, "Victory! -- Dune Tac Toe" / "Defeat -- Dune Tac Toe" / "Draw -- Dune Tac Toe" on game over. Wire into frontend/src/App.tsx
- [ ] T015 [P] [US2] Create frontend/src/assets/favicon.svg from HawkEmblem icon with #1a1409 background and #c4973b icon color, update frontend/index.html to replace Vite default favicon with `<link rel="icon" type="image/svg+xml" href="/src/assets/favicon.svg">`

**Checkpoint**: Player feels like House Atreides. Themed icons on the board, faction turn text, dynamic browser title, and custom favicon.

---

## Phase 6: User Story 3 - Distinctive Opponent Cards (Priority: P3)

**Goal**: Give each opponent card a unique visual identity with faction icons, accent colors, and corrected difficulty badges

**Independent Test**: Navigate to opponent selection screen and verify: each card has a unique faction icon (Spider for Baron, Eye for RM, Snake for Stilgar) above the name, distinct border colors per faction, faction-colored hover glow with -4px lift, green/gold/red difficulty badges, circles/stars instead of diamonds for difficulty indicators

- [ ] T016 [US3] Update frontend/src/components/opponent-select.tsx: add faction icon above each character name (SpiderAlt for Baron in --deep-blue, AllSeeingEye for RM in --gold, SandSnake for Stilgar in --spice-orange) at 2rem size via `currentColor`, apply distinct faction border color to each card, change card hover to `translateY(-4px)` with faction-colored glow box-shadow, update difficulty badge colors to --difficulty-easy (green #5a8a3c) for Easy / --difficulty-medium (--gold) for Medium / --difficulty-hard (--blood-red) for Hard, replace diamond symbols with filled/unfilled circle SVGs or dots for difficulty level indicators
- [ ] T017 [P] [US3] Create frontend/src/components/attribution-footer.tsx: display "Game icons by game-icons.net under CC BY 3.0. Icons by Lorc, Delapouite, and Carl Olsen." with a link to game-icons.net, style in --dust on --sand-dark at small font size, add to the bottom of the app layout in frontend/src/App.tsx

**Checkpoint**: Each opponent card is visually distinct by icon, border, and accent color. Difficulty badges match gaming conventions.

---

## Phase 7: User Story 4 - Polished Interactions & Animations (Priority: P4)

**Goal**: Add smooth micro-interactions -- button feedback, commentary slide-up, winning line connector, screen transitions, placement glow

**Independent Test**: Play through a complete game and verify: buttons compress slightly on press, commentary slides up and fades in, gold winning line animates across winning cells and stays visible through overlay, screens crossfade during navigation, piece placement has brief spice glow, all animations skip under prefers-reduced-motion

- [ ] T018 [US4] Add global button `:active` feedback (`transform: scale(0.97)`, 80ms ease-out transition) to all buttons in frontend/src/index.css, and update frontend/src/components/commentary-box.tsx to use slide-up-fade animation (`translateY(8px) + opacity 0` to `translateY(0) + opacity 1` over 300ms) instead of the existing pure fade-in
- [ ] T019 [P] [US4] Create frontend/src/components/winning-line.tsx: absolutely-positioned `<svg>` overlay on the game board, draw a `<line>` between winning cell centers using calculated coordinates from the winning line indices, apply gold 2px stroke with `filter: drop-shadow(0 0 8px rgba(232,185,74,0.5))` glow, animate with stroke-dasharray/stroke-dashoffset (draw-line keyframe, 400ms), z-index between board cells and game-over modal so line remains visible through scrim, respect prefers-reduced-motion (show static line)
- [ ] T020 [P] [US4] Create frontend/src/components/screen-transition.tsx: wrapper component that applies CSS crossfade transitions between screens (opacity + translateY(8px) enter, reverse for exit, 200ms duration), manage enter/exit states via React state with onTransitionEnd timing, respect prefers-reduced-motion (instant cut)
- [ ] T021 [US4] Wire winning-line.tsx into game board area and screen-transition.tsx around screen routing in frontend/src/App.tsx, add spice-colored glow burst (text-shadow flash fading over 300ms using glow-burst keyframe) on piece placement in frontend/src/components/board-cell.tsx

**Checkpoint**: Every interaction feels tactile and cinematic. Winning line draws across the board, screens crossfade, buttons compress, commentary slides up.

---

## Phase 8: User Story 6 - Enhanced Win & Game-Over Experience (Priority: P6)

**Goal**: Polish the game-over overlay with faction-specific titles, confetti, lighter scrim, and correct button priority

**Independent Test**: Win, lose, and draw a game and verify: faction victory titles ("House Atreides Triumphs!", "The Baron Prevails!", etc.), confetti fires on player win only (not draws), board/winning line visible through lighter scrim (0.60 opacity), "Rematch" is primary button, victory title pulses with spice glow, draw shows thematic message with desaturated markers

- [ ] T022 [US6] Update frontend/src/components/game-over-overlay.tsx: replace generic "Player X/O Wins!" with faction-specific victory titles from faction-config.ts ("House Atreides Triumphs!", "The Baron Prevails!", "The Bene Gesserit See All!", "The Desert Claims Victory!"), use "The Desert Claims All" for draws, reduce scrim opacity from 0.75 to 0.60, swap button priority so "Rematch" is primary (gold-filled) and "Play Again" is secondary (outlined), add pulsing spice glow animation (victory-pulse keyframe, 1.5s cycle) to victory title text with static glow under prefers-reduced-motion, desaturate both markers on draw state
- [ ] T023 [US6] Integrate @neoconfetti/react into frontend/src/components/game-over-overlay.tsx: fire a single confetti burst in Dune palette colors (#c4973b, #e8b94a, #d4722a) when the player wins, do NOT fire on CPU wins or draws, respect prefers-reduced-motion (skip confetti)

**Checkpoint**: Game-over screen celebrates with faction flair. Confetti on player wins, thematic titles, visible board state through lighter scrim.

---

## Phase 9: User Story 7 - Opponent Presence & Match Continuity (Priority: P7)

**Goal**: Show the opponent's identity during gameplay and track scores across rematches

**Independent Test**: Select an opponent and verify: compact indicator (icon + name + badge) visible at top of game screen, indicator pulses on CPU turn, score displays after first rematch, score resets on opponent change or return to title, draws don't increment either score

- [ ] T024 [US7] Create frontend/src/components/opponent-indicator.tsx: compact horizontal layout showing faction icon + "vs {Character Name}" + difficulty badge, styled in --font-hud at small size, subtly pulse with faction accent color during CPU turn (using CSS animation toggled by a `isCpuTurn` prop), visible only in Human vs CPU mode
- [ ] T025 [US7] Add match score state (`playerWins`, `cpuWins`) to frontend/src/hooks/use-game.ts: initialize to {0, 0} on opponent selection, increment playerWins on player win / cpuWins on CPU win, no increment on draw, preserve across rematches, reset to {0, 0} on opponent change or return to title, track only in Human vs CPU mode. Create frontend/src/components/match-score.tsx: display "House Atreides {n} -- {n} {Character Name}" in --font-hud at 0.75rem in --dust color
- [ ] T026 [US7] Wire opponent-indicator.tsx and match-score.tsx into the game screen layout in frontend/src/App.tsx, position opponent indicator near the top of the game area and match score above or beside the board

**Checkpoint**: Player sees who they're fighting and their running score. Indicator pulses on CPU turn.

---

## Phase 10: User Story 8 - Cinematic Transition & First-Move Prompt (Priority: P8)

**Goal**: Build anticipation with a pre-game interstitial and guide the first move

**Independent Test**: Select an opponent and verify: brief interstitial (1-1.5s) shows opponent name + faction quote, fades into game board, skipped under prefers-reduced-motion. On new game, verify: "Claim your first territory" text appears, fades out after first piece is placed

- [ ] T027 [US8] Create frontend/src/components/cinematic-interstitial.tsx: display opponent name in large --font-title (Cinzel Decorative) with a faction-flavored one-liner from faction-config.ts, use CSS crossfade (200ms enter + ~1s hold + 200ms exit via opacity + translateY), skip entirely when prefers-reduced-motion is enabled, wire into frontend/src/App.tsx between opponent selection and game screen (Human vs CPU mode only)
- [ ] T028 [US8] Create frontend/src/components/first-move-prompt.tsx: display "Claim your first territory" in --font-display (Cormorant Garamond italic), --dust color, positioned below turn indicator, fade out after first piece is placed (300ms opacity transition), wire into game screen layout in frontend/src/App.tsx, show on all game modes (HvH and HvCPU)

**Checkpoint**: Cinematic anticipation builds between selection and gameplay. First move is guided with atmospheric prompt.

---

## Phase 11: User Story 9 - Accessibility Compliance (Priority: P9)

**Goal**: Fix all contrast failures, remove debug artifacts, verify assistive technology compatibility

**Independent Test**: Run automated contrast analysis across all screens, verify 100% of text/background combinations meet WCAG AA (4.5:1 normal text, 3:1 large text), confirm no debug tooltips visible, verify SVG icons have aria-hidden and cells maintain accessible labels

- [ ] T029 [US9] Remove the debug "Clicked" tooltip artifact visible in walkthrough GIF from frontend/src/components/board-cell.tsx
- [ ] T030 [US9] Run final WCAG AA contrast audit: verify --dust-bright on --sand-medium meets 4.5:1, verify --difficulty-easy (#5a8a3c) text on badge background meets 4.5:1, verify subtitle --bone at 70% opacity on gradient background meets 4.5:1, verify SVG icon colors against cell background meet contrast requirements, verify all new font sizes render clearly (Cinzel Decorative at 3rem, Cinzel at heading sizes, Orbitron at 0.875rem), fix any failures found

**Checkpoint**: All accessibility requirements verified. No debug artifacts. WCAG AA compliance across all screens.

---

## Phase 12: User Story 10 - Optional Ambient Sand Particles (Priority: P10)

**Goal**: Add subtle atmospheric sand particles (optional -- implement only if time permits)

**Independent Test**: Load title screen and verify: 3-5 small particles drift slowly, hidden under prefers-reduced-motion, particles don't interfere with clickable elements

- [ ] T031 [US10] Create frontend/src/components/sand-particles.tsx: 3-5 small dot elements (2-4px, --gold at 15-25% opacity) with slow horizontal drift animation (particle-drift keyframe, 20-30s cycle) and slight vertical oscillation, position in background layer (z-index: -1), hide when prefers-reduced-motion is enabled, render only on title screen and game-over screen, wire into frontend/src/App.tsx

**Checkpoint**: Title screen and game-over feel alive with subtle drifting particles.

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Asset cleanup and final verification

- [ ] T032 Delete unused noise texture SVG files from frontend/src/assets/ (keep only the selected variant, delete the other two)
- [ ] T033 [P] Delete unused boilerplate assets: frontend/src/assets/react.svg, frontend/src/assets/vite.svg, frontend/src/assets/hero.png
- [ ] T034 Run full verification: `npm test`, `npx tsc --noEmit`, `npx biome check .` in frontend/, verify all prefers-reduced-motion behavior across all new animations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies -- can start immediately
- **Foundational (Phase 2)**: Depends on Setup -- BLOCKS all user stories
- **US1 (Phase 3) + US5 (Phase 4)**: Depend on Foundational -- CAN RUN IN PARALLEL with each other
- **US2 (Phase 5)**: Depends on Foundational + US5 (board-cell.tsx modifications)
- **US3 (Phase 6)**: Depends on Foundational (icons from T005)
- **US4 (Phase 7)**: Depends on US1 + US5 (board and title exist) + US2 (faction styling)
- **US6 (Phase 8)**: Depends on US2 (faction-config) + US4 (animations/transitions)
- **US7 (Phase 9)**: Depends on US2 (faction-config, icons)
- **US8 (Phase 10)**: Depends on US2 (faction-config) + US4 (screen transitions)
- **US9 (Phase 11)**: Depends on ALL previous phases (cross-cutting audit)
- **US10 (Phase 12)**: Depends on Foundational only (independent, optional)
- **Polish (Phase 13)**: Depends on all desired phases being complete

### User Story Dependencies

```
Setup → Foundational ──┬──→ US1 (Atmosphere) ──────┐
                       ├──→ US5 (Board) ────────────┤
                       │                             ├──→ US4 (Animations) ──┐
                       ├──→ US2 (Faction Identity) ──┤                      │
                       │                             ├──→ US6 (Win Screen) ──┤
                       ├──→ US3 (Opponent Cards)     ├──→ US7 (Score) ───────┤
                       │                             ├──→ US8 (Cinematic) ───┤
                       └──→ US10 (Ambient, optional) │                      │
                                                     └──→ US9 (A11y audit) ─┤
                                                                            └──→ Polish
```

### Parallel Opportunities

Within Phase 2 (Foundational):
- T004, T005, T006, T007 can all run in parallel (different files)

User stories that can run in parallel:
- US1 + US5 (different components: title-screen vs game-board/board-cell)
- US3 + US10 (different components: opponent-select vs sand-particles)
- US6 + US7 + US8 (different components: game-over vs opponent-indicator/match-score vs interstitial/prompt)

Within each user story, tasks marked [P] can run in parallel.

---

## Parallel Example: Foundational Phase

```bash
# After T003 completes (CSS tokens), launch in parallel:
Task T004: "Add font imports to main.tsx and preloads to index.html"
Task T005: "Create 6 SVG React icon components in assets/icons/"
Task T006: "Create faction-config.ts in data/"
Task T007: "Add MatchScore and FactionConfig types to types/index.ts"
```

## Parallel Example: After Foundational

```bash
# US1 and US5 can run in parallel:
Task T008: "Enhance title-screen.tsx (US1)"
Task T010: "Enhance game-board.tsx (US5)"

# US3 and US10 can run in parallel (if desired):
Task T016: "Enhance opponent-select.tsx (US3)"
Task T031: "Create sand-particles.tsx (US10)"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 5 Only)

1. Complete Phase 1: Setup (install packages)
2. Complete Phase 2: Foundational (tokens, fonts, icons, data)
3. Complete Phase 3: US1 (title screen atmosphere)
4. Complete Phase 4: US5 (board visual depth)
5. **STOP and VALIDATE**: All screens have atmospheric backgrounds, upgraded fonts, carved board
6. This alone transforms the visual experience significantly

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 + US5 → Atmosphere + Board (visual base layer)
3. US2 → Faction Identity (themed icons + turn text, biggest single impact)
4. US3 → Opponent Cards (visual differentiation)
5. US4 → Animations (cinematic polish)
6. US6 → Win Screen (emotional payoff)
7. US7 + US8 → Match continuity + Cinematic pacing
8. US9 → Accessibility audit (compliance verification)
9. US10 → Ambient particles (optional)
10. Polish → Cleanup

### Parallel Team Strategy

With 2-3 developers after Foundational:
- **Dev A**: US1 → US2 → US6 (atmosphere → identity → win screen)
- **Dev B**: US5 → US4 → US7 + US8 (board → animations → flow)
- **Dev C**: US3 → US10 → US9 (cards → ambient → accessibility)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All CSS changes to index.css consolidated in T003 to avoid merge conflicts
- SVG icons (T005) are parallelizable since each is a separate file
- US10 (ambient particles) is explicitly optional -- skip if time-constrained

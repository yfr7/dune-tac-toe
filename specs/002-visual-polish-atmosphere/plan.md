# Implementation Plan: Phase 1 - Visual Polish & Atmosphere

**Branch**: `002-visual-polish-atmosphere` | **Date**: 2026-03-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-visual-polish-atmosphere/spec.md`

## Summary

Elevate Dune Tac Toe from a functional PoC to a visually immersive experience through 15 frontend-only features (F1.1-F1.15). The work covers atmospheric backgrounds with CSS gradients and SVG noise textures, a typography upgrade (Cinzel Decorative, Cinzel, Orbitron), themed SVG game piece icons from game-icons.net, faction-based visual identity for both the player (House Atreides) and CPU opponents, interaction polish (button feedback, winning line animation, screen transitions), accessibility contrast fixes, enhanced win/game-over screens with confetti, and new UX features (opponent presence indicator, cinematic interstitial, running match score, first-move prompt). No backend or game logic changes.

## Technical Context

**Language/Version**: TypeScript 5.9 (frontend only)
**Primary Dependencies**: React 19, Tailwind CSS v4, shadcn/ui, Vite 8, @fontsource packages (new), @neoconfetti/react (new)
**Storage**: N/A (match score stored in React state only -- resets on page refresh)
**Testing**: Vitest + React Testing Library
**Target Platform**: Desktop web browser (1024px+ viewport)
**Project Type**: Web application (frontend SPA -- visual polish only)
**Performance Goals**: All animations at 60fps using transform/opacity only; no additional network requests for visual effects
**Constraints**: Frontend-only (no backend changes), CSS-only backgrounds (no image files), self-hosted fonts via Fontsource, SVG icons inlined as React components, WCAG AA contrast compliance
**Scale/Scope**: 15 visual features across 4 screens (title, opponent select, game, game over), ~10 existing components to modify, ~5 new components to add

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution file (`.specify/memory/constitution.md`) contains only template placeholders -- no project-specific principles have been defined. No gates to evaluate. Proceeding.

## Project Structure

### Documentation (this feature)

```text
specs/002-visual-polish-atmosphere/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal -- frontend state only)
├── quickstart.md        # Phase 1 output
├── checklists/          # Quality checklists
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
frontend/
├── index.html                       # Font preloads, favicon [MODIFY]
├── package.json                     # New dependencies [MODIFY]
├── src/
│   ├── main.tsx                     # Font imports [MODIFY]
│   ├── index.css                    # Design tokens, animations, backgrounds [MODIFY]
│   ├── App.tsx                      # Screen transitions, state wiring [MODIFY]
│   ├── assets/
│   │   ├── noise-medium.svg         # Noise texture (keep 1, delete others) [KEEP]
│   │   ├── noise-fine.svg           # [DELETE after selection]
│   │   ├── noise-coarse.svg         # [DELETE after selection]
│   │   ├── icons/                   # New SVG icon components [NEW]
│   │   │   ├── PlainDagger.tsx      # Player piece icon (crysknife)
│   │   │   ├── SeaSerpent.tsx       # CPU piece icon (sandworm)
│   │   │   ├── SpiderAlt.tsx        # Baron faction icon
│   │   │   ├── AllSeeingEye.tsx     # Reverend Mother faction icon
│   │   │   ├── SandSnake.tsx        # Stilgar faction icon
│   │   │   └── HawkEmblem.tsx       # Favicon source / Atreides sigil
│   │   └── favicon.svg              # Generated Dune-themed favicon [NEW]
│   ├── components/
│   │   ├── board-cell.tsx           # Themed icons, hover cursor, ripple [MODIFY]
│   │   ├── game-board.tsx           # Board depth shadows, grid glow [MODIFY]
│   │   ├── turn-indicator.tsx       # Faction text, accent colors, HUD font [MODIFY]
│   │   ├── commentary-box.tsx       # Slide-up animation [MODIFY]
│   │   ├── title-screen.tsx         # Gold title, separator, spice glow [MODIFY]
│   │   ├── opponent-select.tsx      # Faction icons, card accents, badges [MODIFY]
│   │   ├── game-over-overlay.tsx    # Victory titles, confetti, scrim [MODIFY]
│   │   ├── error-toast.tsx          # [NO CHANGE]
│   │   ├── winning-line.tsx         # SVG line connector [NEW]
│   │   ├── opponent-indicator.tsx   # Compact HUD during game [NEW]
│   │   ├── cinematic-interstitial.tsx # Pre-game transition [NEW]
│   │   ├── match-score.tsx          # Running score display [NEW]
│   │   ├── first-move-prompt.tsx    # Opening move guidance [NEW]
│   │   ├── sand-particles.tsx       # Optional ambient effect [NEW]
│   │   ├── screen-transition.tsx    # Crossfade wrapper [NEW]
│   │   └── attribution-footer.tsx   # CC BY 3.0 credits [NEW]
│   ├── hooks/
│   │   ├── use-game.ts             # Match score state, faction identity [MODIFY]
│   │   ├── use-cpu-move.ts         # [NO CHANGE]
│   │   └── use-document-title.ts   # Dynamic title updates [NEW]
│   ├── data/
│   │   ├── characters.ts           # Faction icons, accent colors, victory titles [MODIFY]
│   │   ├── locations.ts            # [NO CHANGE]
│   │   ├── quotes.ts              # [NO CHANGE]
│   │   └── faction-config.ts      # Faction colors, icons, interstitial quotes [NEW]
│   └── types/
│       └── index.ts                # MatchScore type, FactionConfig [MODIFY]
```

**Structure Decision**: This phase modifies the existing frontend SPA structure from Phase 0. No new directories at the root level. New components are added to `frontend/src/components/`, new data files to `frontend/src/data/`, new hooks to `frontend/src/hooks/`, and SVG icon components to `frontend/src/assets/icons/`. The backend directory is not touched.

## Phase 0: Research

### Research Summary

This is a frontend-only visual polish phase. Most technical decisions are pre-specified in the feature description (`project/phase-1-visual-polish.md`), which provides exact CSS code, font choices, icon sources, and package names. Research needs are minimal.

### R1: SVG Icon Acquisition from game-icons.net

**Decision**: Download 6 SVGs from game-icons.net and convert to React components using `currentColor` for theming.

**Icons needed**:
| Icon | Artist | Use | URL Pattern |
|------|--------|-----|-------------|
| Plain Dagger | Lorc | Player piece | `game-icons.net/icons/ffffff/transparent/1x1/lorc/plain-dagger.svg` |
| Sea Serpent | Lorc | CPU piece | `game-icons.net/icons/ffffff/transparent/1x1/lorc/sea-serpent.svg` |
| Spider Alt | Carl Olsen | Baron card | `game-icons.net/icons/ffffff/transparent/1x1/carl-olsen/spider-alt.svg` |
| All-Seeing Eye | Delapouite | Reverend Mother card | `game-icons.net/icons/ffffff/transparent/1x1/delapouite/all-seeing-eye.svg` |
| Sand Snake | Delapouite | Stilgar card | `game-icons.net/icons/ffffff/transparent/1x1/delapouite/sand-snake.svg` |
| Hawk Emblem | Lorc | Favicon / Atreides sigil | `game-icons.net/icons/ffffff/transparent/1x1/lorc/hawk-emblem.svg` |

**Approach**: Download SVGs, strip unnecessary attributes, wrap in React components with `currentColor` fill, export from `assets/icons/`. Add `aria-hidden="true"` to all icon components.

**Attribution**: CC BY 3.0 requires visible in-app credit. Add an `<AttributionFooter>` component.

**Alternatives considered**: Inline SVG strings vs separate `.svg` files. React components chosen for type safety, tree-shaking, and easy `currentColor` integration.

### R2: Font Installation Strategy

**Decision**: Self-host via Fontsource packages, consistent with existing Inter Variable setup.

**Packages**:
- `@fontsource/cinzel-decorative` (~30 kB woff2) -- title only
- `@fontsource-variable/cinzel` (~40 kB woff2) -- headings
- `@fontsource/orbitron` (~15 kB woff2) -- HUD/turn indicator (optional)

**Migration**: Cormorant Garamond is currently loaded via Google Fonts CDN (`<link>` in index.html). This can remain as-is since it's already working and the feature description says to keep it. The new fonts are added alongside.

**Preloading**: Add `<link rel="preload">` for Cinzel Decorative 700 and Cinzel 700 woff2 files in `index.html`. All fonts use `font-display: swap`.

**Alternatives considered**: Google Fonts CDN for all new fonts (rejected: adds external network dependency, inconsistent with self-hosting goal).

### R3: Noise Texture Selection

**Decision**: Defer to implementation -- try all three variants (`noise-fine.svg`, `noise-medium.svg`, `noise-coarse.svg`) visually and select one. Feature description recommends starting with `noise-medium.svg`.

**Approach**: Apply as CSS `background-image` via `::before` pseudo-element on `body` at 4-6% opacity with `mix-blend-mode: overlay`. Import via Vite's asset handling (inline or URL).

**Alternatives considered**: CSS-only `filter: url()` approach (rejected: less portable). External texture generators (rejected: adds complexity).

### R4: Confetti Implementation

**Decision**: Use `@neoconfetti/react` (~3 kB, CSS-only, no canvas) as the primary choice. Fall back to pure CSS keyframes if bundle size is a concern.

**Configuration**: Dune palette colors (`#c4973b`, `#e8b94a`, `#d4722a`). Fire once on player win only (not on CPU win, not on draws). Respect `prefers-reduced-motion`.

**Alternatives considered**: `react-confetti-explosion` (23 kB, too large), `canvas-confetti` (6 kB, uses canvas), pure CSS (0 kB but more implementation effort).

### R5: Winning Line SVG Overlay

**Decision**: Overlay an absolutely-positioned `<svg>` element on the game board. Draw a `<line>` between winning cell centers using calculated coordinates.

**Animation**: Use `stroke-dasharray` and `stroke-dashoffset` to animate the line drawing effect over 400ms. Apply `filter: drop-shadow(0 0 8px rgba(232,185,74,0.5))` for gold glow.

**Z-index**: Line SVG must be above the board cells but visible through the game-over scrim (z-index between surface and modal layers).

**Alternatives considered**: CSS border/outline approach (rejected: can't draw diagonal lines). Canvas overlay (rejected: overkill for a single line).

### R6: Screen Transition Strategy

**Decision**: Wrap screen content in a transition component that applies CSS `opacity` + `transform: translateY(8px)` for enter and reverse for exit. 200ms duration.

**Approach**: Use React state to drive enter/exit classes. On screen change, apply exit animation to current screen, then swap content, then apply enter animation. Use `onTransitionEnd` for timing.

**Alternatives considered**: React Transition Group (rejected: heavy dependency for simple crossfade). Framer Motion (rejected: large bundle). CSS View Transitions API (rejected: limited browser support).

### R7: Custom Cursor

**Decision**: Use the Plain Dagger SVG from game-icons.net, resized to 32x32, as a CSS `cursor: url(...)` value on empty board cells. Fallback to `crosshair`.

**Approach**: Encode the SVG as a data URI for the cursor property. Apply only to `.board-cell:not([disabled])`.

### R8: Favicon Generation

**Decision**: Create an SVG favicon from the Hawk Emblem icon with `#1a1409` background and `#c4973b` icon color. Use SVG format directly (supported by all modern browsers) for simplicity.

**Approach**: Create `favicon.svg` in assets, reference in `index.html` with `<link rel="icon" type="image/svg+xml">`. Remove existing Vite default favicon.

## Phase 1: Design

### Data Model

This phase introduces no persistent data. Two new pieces of frontend state are added:

**Match Score** (React state in `useGame` hook):
- `playerWins: number` -- player's win count in current session
- `cpuWins: number` -- CPU's win count in current session
- Resets to 0 when opponent changes or player returns to title screen
- Draws increment neither counter
- Only active in Human vs CPU mode

**Document Title State** (custom hook `useDocumentTitle`):
- Derives title string from current game state (screen, turn, character)
- Updates `document.title` reactively
- Examples: "Dune Tac Toe", "Your Turn -- Dune Tac Toe", "Baron is thinking...", "Victory! -- Dune Tac Toe"

### Faction Configuration Data

New data file `faction-config.ts` centralizes all faction-related visual configuration:

| Property | Player (Atreides) | Baron | Reverend Mother | Stilgar |
|----------|------------------|-------|-----------------|---------|
| Accent color | `#4a7c8a` (teal) | `--deep-blue` | `--gold` | `--spice-orange` |
| Piece icon | PlainDagger | SeaSerpent | SeaSerpent | SeaSerpent |
| Card icon | -- | SpiderAlt | AllSeeingEye | SandSnake |
| Turn text | "House Atreides moves" | "Baron Harkonnen schemes..." | "The Reverend Mother contemplates..." | "Stilgar reads the sands..." |
| Victory title | "House Atreides Triumphs!" | "The Baron Prevails!" | "The Bene Gesserit See All!" | "The Desert Claims Victory!" |
| Interstitial quote | -- | "The Baron does not play games. He plays you." | "The future is already written." | "The desert tests all who enter." |
| Draw title | -- | "The Desert Claims All" | "The Desert Claims All" | "The Desert Claims All" |

### UI Contracts

No external API contracts change in this phase. All changes are internal to the frontend. The existing `POST /api/move` and `GET /api/health` contracts remain unchanged.

### New CSS Tokens

Added to `:root` in `index.css`:

```
--font-title: 'Cinzel Decorative', 'Cormorant Garamond', Georgia, serif
--font-heading: 'Cinzel', 'Cormorant Garamond', Georgia, serif
--font-hud: 'Orbitron', 'Inter', system-ui, sans-serif
--atreides-blue: #4a7c8a
--difficulty-easy: #5a8a3c
--difficulty-medium: var(--gold)
--difficulty-hard: var(--blood-red)
--dust-bright: #a89b88  (new token for location labels on --sand-medium)
```

### New Keyframe Animations

Added to `index.css`:

| Animation | Purpose | Duration | Easing |
|-----------|---------|----------|--------|
| `draw-line` | Winning line SVG stroke | 400ms | ease-out |
| `screen-enter` | Screen fade+slide in | 200ms | ease-out |
| `screen-exit` | Screen fade+slide out | 200ms | ease-in |
| `ripple-expand` | Piece placement ripple | 200ms | ease-out |
| `glow-burst` | Piece placement glow | 300ms | ease-out |
| `victory-pulse` | Victory title glow cycle | 1500ms | ease-in-out, infinite |
| `slide-up-fade` | Commentary enter | 300ms | ease-out |
| `particle-drift` | Sand particle movement | 20-30s | linear, infinite |

All animations disabled via existing `prefers-reduced-motion` media query.

## Implementation Phases

### Phase A: Foundation (CSS Tokens, Fonts, Background)

**Goal**: Establish the atmospheric base layer that all other features build on.

**Scope**: F1.1 (Background), F1.2 (Typography), F1.8 partial (contrast tokens)

**Changes**:
1. Install font packages (`@fontsource/cinzel-decorative`, `@fontsource-variable/cinzel`, `@fontsource/orbitron`)
2. Add font imports to `main.tsx`, add CSS token declarations to `index.css`
3. Add `<link rel="preload">` for critical fonts in `index.html`
4. Apply warm gradient background + noise texture overlay via `body::before` in `index.css`
5. Add new color tokens (`--atreides-blue`, `--difficulty-easy`, `--dust-bright`)
6. Add new animation keyframes to `index.css`
7. Expose new tokens in Tailwind `@theme inline` block

**Dependencies**: None (foundation layer)
**Validates**: FR-001, FR-002, FR-003, FR-044, FR-045

### Phase B: Title Screen & Board Visual Depth

**Goal**: Transform the two most visible screens -- title and game board.

**Scope**: F1.3 (Title Screen), F1.4 (Board Depth)

**Changes**:
1. Update `title-screen.tsx`: gold gradient title text, spice glow background, subtitle contrast fix, decorative separator, button press feedback
2. Update `game-board.tsx`: layered box-shadow for carved depth, grid line glow
3. Update `board-cell.tsx`: hover scale + brighten location name, custom cursor, location name contrast fix (`--dust-bright`)
4. Update `index.css`: cell hover styles, cursor data URI

**Dependencies**: Phase A (fonts, tokens, background)
**Validates**: FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-019, FR-025

### Phase C: SVG Icons & Opponent Cards

**Goal**: Replace generic markers with themed icons and differentiate opponent cards.

**Scope**: F1.5 (Themed Icons), F1.6 (Opponent Cards), F1.8 partial (debug artifacts)

**Changes**:
1. Download SVGs from game-icons.net, create React icon components in `assets/icons/`
2. Create `faction-config.ts` data file
3. Update `board-cell.tsx`: render icon components instead of "X"/"O" text, add radial ripple animation, maintain aria-labels
4. Update `opponent-select.tsx`: faction icons on cards, accent border colors, hover glow, difficulty badge colors (green/gold/red), replace diamond indicators with filled/unfilled circles
5. Create `attribution-footer.tsx` for CC BY 3.0 credits
6. Remove debug "Clicked" tooltip artifact
7. Generate and add `favicon.svg`

**Dependencies**: Phase A (tokens), Phase B (board cell modifications)
**Validates**: FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-017a, FR-018, FR-026

### Phase D: Faction Identity & Turn Indicator

**Goal**: Make the player feel like House Atreides and the CPU like their faction.

**Scope**: F1.11 (Player Faction Identity), F1.12 (Opponent Presence)

**Changes**:
1. Update `turn-indicator.tsx`: faction-flavored text from `faction-config.ts`, accent color per faction, optional `--font-hud` (Orbitron)
2. Update `board-cell.tsx`: tint player pieces with `--atreides-blue`
3. Create `opponent-indicator.tsx`: compact indicator with faction icon + name + badge, pulse on CPU turn
4. Create `use-document-title.ts` hook: dynamic title updates per game state
5. Update `index.html`: replace default favicon with `favicon.svg`
6. Wire `opponent-indicator.tsx` into game screen in `App.tsx`

**Dependencies**: Phase C (icons, faction-config)
**Validates**: FR-032, FR-033, FR-034, FR-035, FR-036

### Phase E: Animations & Interaction Polish

**Goal**: Add cinematic feel to every interaction.

**Scope**: F1.7 (Interaction Polish)

**Changes**:
1. Update `index.css`: button `:active` scale, glow-burst keyframe, slide-up-fade keyframe
2. Update `commentary-box.tsx`: replace fade-in with slide-up + fade-in
3. Create `winning-line.tsx`: SVG overlay with animated stroke-dasharray line
4. Create `screen-transition.tsx`: crossfade wrapper component
5. Update `board-cell.tsx`: glow burst on piece placement
6. Wire `winning-line.tsx` into game board area in `App.tsx`
7. Wire `screen-transition.tsx` around screen routing in `App.tsx`
8. Verify all animations respect `prefers-reduced-motion`

**Dependencies**: Phase B (board), Phase D (faction styling)
**Validates**: FR-019, FR-020, FR-021, FR-022, FR-023, FR-024

### Phase F: Win Screen, Match Score & Game Flow

**Goal**: Polish the end-game experience and add session continuity.

**Scope**: F1.9 (Win Screen), F1.13 (Cinematic Interstitial), F1.14 (Match Score), F1.15 (First-Move Prompt)

**Changes**:
1. Update `game-over-overlay.tsx`: faction victory titles, reduced scrim opacity, button priority swap (Rematch primary), pulsing victory title glow, draw state marker desaturation
2. Install `@neoconfetti/react`, integrate confetti burst on player win (not draws)
3. Create `cinematic-interstitial.tsx`: opponent name + faction quote, 1-1.5s hold, fade transition, skip on reduced-motion
4. Create `match-score.tsx`: running score display in `--font-hud`, reset logic
5. Update `use-game.ts`: add match score state (playerWins, cpuWins), reset on opponent change
6. Create `first-move-prompt.tsx`: "Claim your first territory" text, fade-out on first move
7. Wire new components into `App.tsx` game screen layout

**Dependencies**: Phase D (faction config, turn indicator), Phase E (transitions, animations)
**Validates**: FR-027, FR-028, FR-028a, FR-029, FR-030, FR-031, FR-037, FR-038, FR-039, FR-040, FR-041

### Phase G: Optional Ambient Effects & Final Accessibility Pass

**Goal**: Add optional atmospheric particles and verify all accessibility requirements.

**Scope**: F1.10 (Ambient Effects -- optional), F1.8 (Accessibility -- final pass)

**Changes**:
1. Create `sand-particles.tsx`: 3-5 CSS-animated dot elements, slow drift, hidden on reduced-motion (optional -- implement only if time permits)
2. Final WCAG AA contrast audit across all screens using automated tooling
3. Verify all new fonts render clearly at designated sizes
4. Verify new green difficulty badge contrast on card background
5. Verify SVG icon contrast against cell backgrounds
6. Delete unused noise texture SVG files (keep only the selected variant)
7. Delete unused boilerplate assets (`react.svg`, `vite.svg`, `hero.png`)

**Dependencies**: All previous phases
**Validates**: FR-042, FR-043, FR-025, SC-001, SC-002

## Quickstart

### Prerequisites

- Node.js 22+ and npm
- Existing frontend dev environment from Phase 0

### Setup

```bash
cd frontend

# Install new dependencies
npm install @fontsource/cinzel-decorative @fontsource-variable/cinzel @fontsource/orbitron @neoconfetti/react

# Start dev server
npm run dev
```

### Development Workflow

1. All changes are in `frontend/src/` -- no backend changes needed
2. The backend is not required for visual development (mock data suffices for styling)
3. Use browser DevTools to verify contrast ratios and animation performance
4. Test `prefers-reduced-motion` by enabling it in DevTools > Rendering > Emulate CSS media feature

### Verification

```bash
# Run frontend tests
npm test

# Type check
npx tsc --noEmit

# Lint
npx biome check .
```

## Complexity Tracking

No constitution violations to justify. The phase adds visual complexity (new components, animations, icons) but no architectural complexity. All new components are presentational leaf nodes.

# Research: Phase 1 - Visual Polish & Atmosphere

**Branch**: `002-visual-polish-atmosphere` | **Date**: 2026-03-27

## Overview

This is a frontend-only visual polish phase. Most technical decisions are pre-specified in the feature description (`project/phase-1-visual-polish.md`), which provides exact CSS code, font choices, icon sources, and package names. Research was focused on validating these choices and resolving minor implementation details.

## R1: SVG Icon Acquisition from game-icons.net

**Decision**: Download 6 SVGs from game-icons.net and convert to React components.

**Rationale**: game-icons.net provides 4,170+ free SVGs under CC BY 3.0 (attribution required). The specific icons were selected in the feature description for thematic fit: Plain Dagger (crysknife) for player, Sea Serpent (sandworm) for CPU, Spider (Baron), All-Seeing Eye (Reverend Mother), Sand Snake (Stilgar), Hawk Emblem (Atreides/favicon).

**Alternatives considered**:
- Custom SVG illustration (rejected: too time-consuming for PoC polish phase)
- Lucide icons (already installed, but no thematic Dune icons available)
- Font Awesome (rejected: no relevant Dune-themed icons)

## R2: Font Installation Strategy

**Decision**: Self-host new fonts via Fontsource (`@fontsource/cinzel-decorative`, `@fontsource-variable/cinzel`, `@fontsource/orbitron`). Keep existing Cormorant Garamond via Google Fonts CDN.

**Rationale**: Fontsource is already used for Inter Variable in the project. Self-hosting eliminates external requests for the new fonts. Cormorant Garamond stays on Google Fonts CDN since it's already working and changing it is out of scope.

**Alternatives considered**:
- Google Fonts CDN for all (rejected: adds external dependency for new fonts)
- Self-host all including Cormorant Garamond (rejected: unnecessary migration risk, out of scope)

## R3: Noise Texture Selection

**Decision**: Start with `noise-medium.svg` (baseFrequency 0.55, 4 octaves) as recommended. Final selection during implementation based on visual testing.

**Rationale**: Three pre-generated SVG noise textures already exist in `frontend/src/assets/`. The medium variant is recommended as a balanced starting point. Applied as `::before` pseudo-element at 4-6% opacity with `mix-blend-mode: overlay`.

**Alternatives considered**:
- Runtime CSS `filter: url()` (rejected: less portable)
- External texture generators (rejected: adds build complexity)
- Image-based textures (rejected: violates CSS-only constraint)

## R4: Confetti Implementation

**Decision**: Use `@neoconfetti/react` (~3 kB gzipped, CSS-only animations, no canvas).

**Rationale**: Smallest bundle size among options that provide a React component API. CSS-only approach aligns with the project's preference for transform/opacity animations. Fires once on player win only.

**Alternatives considered**:
- `react-confetti-explosion` (~23 kB, rejected: too large)
- `canvas-confetti` (~6 kB, rejected: uses canvas, inconsistent with CSS-only approach)
- Pure CSS keyframes (0 kB, kept as fallback: more implementation effort but zero dependencies)

## R5: Winning Line SVG Overlay

**Decision**: Absolutely-positioned `<svg>` element over the game board with `<line>` between winning cell centers, animated via `stroke-dasharray`/`stroke-dashoffset`.

**Rationale**: SVG provides pixel-perfect line drawing including diagonals. The `stroke-dasharray` animation technique is well-documented (CSS-Tricks) and produces a clean "drawing" effect. Gold color with `drop-shadow` filter for glow.

**Alternatives considered**:
- CSS border/pseudo-element approach (rejected: cannot draw diagonal lines)
- Canvas overlay (rejected: overkill for a single animated line)
- CSS clip-path animation (rejected: complex and less supported)

## R6: Screen Transition Strategy

**Decision**: Custom React component using CSS `opacity` + `transform: translateY(8px)` transitions, 200ms duration.

**Rationale**: Lightweight approach matching existing animation patterns in the codebase. No additional dependencies needed. The transition component manages enter/exit states via React state.

**Alternatives considered**:
- React Transition Group (rejected: heavy dependency for simple crossfade)
- Framer Motion (rejected: large bundle, overkill)
- CSS View Transitions API (rejected: limited browser support as of 2026)

## R7: Custom Cursor

**Decision**: Plain Dagger SVG encoded as data URI for CSS `cursor: url()`, 32x32 size, `crosshair` fallback.

**Rationale**: Feature description specifies this approach. Data URI avoids an additional HTTP request. Standard `crosshair` fallback ensures usability if custom cursor fails.

## R8: Favicon Generation

**Decision**: SVG favicon from Hawk Emblem with `#1a1409` background and `#c4973b` icon color. Use `<link rel="icon" type="image/svg+xml">`.

**Rationale**: SVG favicons are supported by all modern browsers and scale perfectly. Avoids the need for multiple PNG sizes. Can be created directly from the Hawk Emblem icon component.

## Existing Codebase Findings

Key observations from the codebase exploration that inform implementation:

1. **Animation infrastructure**: Existing `@keyframes` in `index.css` with Tailwind `@theme inline` exposure. New animations follow the same pattern.
2. **Reduced motion**: Already handled via `@media (prefers-reduced-motion: reduce)` block. New animations are automatically covered.
3. **Component patterns**: Components use Tailwind classes + CSS custom properties. No CSS modules or styled-components.
4. **State management**: React hooks (not Jotai despite tech-stack doc mentioning it). Match score state fits naturally in `useGame` hook.
5. **Screen routing**: `App.tsx` uses local state for screen switching. Screen transition component wraps this existing pattern.
6. **Opponent cards**: Currently use diamond symbols (◊◊◊) for difficulty. These get replaced with filled/unfilled circles.
7. **Game-over modal**: References undefined animations (`animate-fade-in`, `animate-scale-in`). These need to be defined or replaced.
8. **Unused assets**: `hero.png`, `react.svg`, `vite.svg` can be cleaned up.

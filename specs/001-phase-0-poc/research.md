# Research: Phase 0 - Proof of Concept

**Date**: 2026-03-27
**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Summary

Most technology decisions were made during project setup. The existing scaffold confirms all choices. This research documents decisions, rationale, and alternatives considered.

## Decisions

### D1: Screen Navigation — React State vs Router

**Decision**: Use React state (`useState`) to manage the current screen.

**Rationale**: The game has only 4 screens (title, opponent select, game board, game over) with a linear flow. No deep linking, browser history, or URL-based navigation is needed. A router library (React Router, TanStack Router) adds dependency weight and routing concepts that provide no value for this PoC.

**Alternatives considered**:
- React Router v7: Full-featured but overkill for 4 sequential screens
- TanStack Router: Type-safe routing, but same overkill concern

### D2: State Management — Custom Hook vs Jotai Atoms

**Decision**: Use a custom `use-game` hook to encapsulate all game state.

**Rationale**: The game state is a single cohesive unit (board, turn, mode, status, winner). It doesn't need to be shared across distant components — it flows down from the App component. A custom hook provides a clean API (`startGame`, `placeMove`, `resetGame`) without introducing atomic state management overhead. Jotai is available in the project's tech stack doc but isn't installed yet.

**Alternatives considered**:
- Jotai atoms: Better for state that's read/written by many unrelated components. Not the pattern here.
- useReducer: Viable, but a hook wrapping useState gives the same benefits with a simpler API.

### D3: API Integration — Direct Fetch vs Generated SDK

**Decision**: Use `fetch` directly via Vite's dev proxy for the PoC.

**Rationale**: The tech stack doc specifies `@hey-api/openapi-ts` for SDK generation, but this requires the backend to be running to generate types. For the PoC, there's only one API call (`POST /api/move`), and the frontend already has hand-written types (`CpuMoveRequest`, `CpuMoveResponse` in `types/index.ts`) that match the backend models. Direct fetch is simpler and avoids a build-time dependency on the backend. The Vite proxy at `/api` is already configured.

**Alternatives considered**:
- @hey-api/openapi-ts generated SDK: Correct long-term approach per tech stack doc. Not worth the setup cost for a single endpoint in a PoC.
- axios: Unnecessary wrapper around fetch for one API call.

### D4: Game Over Quotes — Pre-written vs LLM-generated

**Decision**: Use pre-written quotes stored in `data/quotes.ts`.

**Rationale**: The spec allows either approach (FR-029, Assumptions). Pre-written quotes avoid an additional LLM call at game end, reducing latency and complexity. The game design doc already provides example quotes for all outcome/character combinations. For a PoC, this delivers the thematic experience without the engineering cost of a second backend endpoint.

**Alternatives considered**:
- LLM-generated: More dynamic and character-specific, but requires a new endpoint and adds latency at a moment when instant feedback matters (game just ended).

### D5: Font Loading — Google Fonts vs Self-hosted

**Decision**: Load Cormorant Garamond via Google Fonts link with `font-display: swap`. Inter is already installed via `@fontsource-variable/inter`.

**Rationale**: Cormorant Garamond is only used for display text (title, commentary). Google Fonts provides CDN-cached delivery with minimal setup. Self-hosting would require downloading font files and configuring @font-face rules — unnecessary complexity for a PoC.

**Alternatives considered**:
- @fontsource/cormorant-garamond: Consistent with how Inter is loaded, but adds an npm dependency for a display font.
- System serif fallback only: Loses the cinematic Dune feel that the theme spec emphasizes.

### D6: CSS Architecture — CSS Custom Properties in index.css

**Decision**: Define all theme tokens (colors, spacing, typography, animation durations) as CSS custom properties at `:root` in `index.css`. Components reference these tokens — no raw hex values in component styles.

**Rationale**: The theme spec defines a comprehensive token system. CSS custom properties provide the simplest implementation that works with Tailwind v4 (which supports arbitrary properties via `var()`). This keeps theming centralized and changeable.

**Alternatives considered**:
- Tailwind theme extension: Tailwind v4 handles this differently than v3. CSS custom properties are the idiomatic Tailwind v4 approach.
- CSS-in-JS (styled-components): Not in the project's tech stack; would conflict with Tailwind.

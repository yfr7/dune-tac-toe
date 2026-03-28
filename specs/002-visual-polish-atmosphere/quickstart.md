# Quickstart: Phase 1 - Visual Polish & Atmosphere

**Branch**: `002-visual-polish-atmosphere` | **Date**: 2026-03-27

## Prerequisites

- Node.js 22+ and npm
- Existing frontend dev environment from Phase 0 (all Phase 0 dependencies installed)
- Backend is NOT required for visual development (useful for testing CPU commentary styling but not needed for most tasks)

## Setup

```bash
cd frontend

# Install new dependencies
npm install @fontsource/cinzel-decorative @fontsource-variable/cinzel @fontsource/orbitron @neoconfetti/react

# Start dev server
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Development Workflow

1. All changes are in `frontend/src/` -- no backend modifications
2. Visual changes can be developed and tested without the backend running
3. To test CPU commentary styling and opponent interactions, start the backend:
   ```bash
   cd backend
   uv run uvicorn main:app --reload --port 8000
   ```

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/index.css` | Design tokens, animations, background styles |
| `src/main.tsx` | Font imports entry point |
| `src/App.tsx` | Screen routing, component wiring |
| `src/data/faction-config.ts` | Faction visual configuration (NEW) |
| `src/assets/icons/` | SVG icon React components (NEW) |
| `index.html` | Font preloads, favicon |

## Testing & Verification

```bash
# Run frontend tests
npm test

# Type check
npx tsc --noEmit

# Lint
npx biome check .
```

### Manual Verification

- **Contrast ratios**: Use browser DevTools > Accessibility panel or axe DevTools extension
- **Reduced motion**: DevTools > Rendering > Emulate CSS media feature > `prefers-reduced-motion: reduce`
- **Animation performance**: DevTools > Performance tab > record during gameplay to verify 60fps
- **Font loading**: DevTools > Network tab > filter by Font to verify swap behavior

## New Dependencies

| Package | Size | Purpose |
|---------|------|---------|
| `@fontsource/cinzel-decorative` | ~30 kB | Title font (H1) |
| `@fontsource-variable/cinzel` | ~40 kB | Heading font (H2-H3) |
| `@fontsource/orbitron` | ~15 kB | HUD/turn indicator font (optional) |
| `@neoconfetti/react` | ~3 kB | Victory confetti effect |

Total new bundle: ~88 kB (fonts load asynchronously with swap)

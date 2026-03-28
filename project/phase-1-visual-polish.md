# Phase 1 - Visual Polish & Atmosphere

> This document details the visual and UX improvements identified from a UI/UX review of the Phase 0 PoC. All changes enhance the Dune atmosphere and interaction quality without altering game logic or backend behavior.

## Objective

Elevate Dune Tac Toe from a functional PoC to a visually immersive experience. Every improvement reinforces the cinematic Dune aesthetic established in the [Theme & Design](theme.md) document while fixing accessibility gaps identified during review.

### Design Principles (from UI/UX Review)

1. **Faction identity over abstract markers** -- The player should feel like House Atreides, not "Player X". Every screen should reinforce who the player is and who they're fighting.
2. **Environmental storytelling** -- Backgrounds, textures, and transitions should evoke Arrakis, not a generic dark UI.
3. **Tactile feedback** -- Every interaction (tap, hover, placement) should feel physical and satisfying.
4. **Cinematic pacing** -- Transitions between screens should build anticipation, not just swap content.

## Current State Assessment

### What's Working

- Color palette is authentic (sand-dark, gold, spice-orange, bone)
- Cormorant Garamond + Inter font pairing is solid for display + body
- Character-specific commentary theming (Baron = deep-blue, Reverend Mother = gold, Stilgar = orange)
- 8px spacing grid is consistent throughout
- Accessibility foundations in place (focus states, reduced-motion, semantic HTML, aria-live)

### Issues Identified

1. **Flat, atmosphereless backgrounds** - Solid `#1a1409` everywhere; no texture, gradient, or environmental storytelling
2. **Game board lacks tactile quality** - Plain HTML-table appearance; no depth, carved edges, or visual weight
3. **Landing screen is sparse** - Title + two buttons on a flat dark rectangle; no sense of Arrakis
4. **Opponent cards lack visual identity** - All three cards look identical except text content; no faction personality
5. **Accessibility contrast failures** - `--dust` on `--sand-medium` (~2.3:1 ratio) used in board cell location labels
6. **Plain X/O markers** - No thematic connection to the Dune universe
7. **Minimal interaction feedback** - No button press states, no page transitions, hover states too subtle
8. **Difficulty badge colors misleading** - Orange (easy) feels harder than gold (medium); doesn't match gaming conventions
9. **No player faction identity** - Player is always "Player X"; no House Atreides theming or emotional investment
10. **No opponent presence during gameplay** - After selecting an opponent, no visual reminder of who you're playing against until commentary appears
11. **No match continuity** - No running score between rematches; each game feels disposable
12. **Generic win/draw titles** - "Player O Wins!" instead of character-flavored victory text
13. **Abrupt screen transitions** - No cinematic pacing between opponent selection and game start
14. **No favicon or document title updates** - Browser tab shows generic Vite default

---

## Features

### F1.1: Background Atmosphere Layer

Add environmental depth to all screens using pure CSS (no image assets).

**Sand-grain noise texture:**

Three pre-generated SVG noise textures are available at `frontend/src/assets/`:

| File | `baseFrequency` | Octaves | Character |
|------|-----------------|---------|-----------|
| `noise-fine.svg` | 0.80 | 4 | Tight, sandy grain -- closest to film-grain / sandpaper |
| `noise-medium.svg` | 0.55 | 4 | Balanced desert sand texture (recommended starting point) |
| `noise-coarse.svg` | 0.35 | 3 | Larger, cloudier grain -- more like dune ridges |

All use `fractalNoise` type, `stitchTiles="stitch"` for seamless tiling, and are desaturated to grayscale via `feColorMatrix`.

- Apply as a `::before` pseudo-element on `body` at 4-6% opacity with `mix-blend-mode: overlay`
- Import directly via Vite (e.g., `import noiseSvg from '@/assets/noise-medium.svg'`) or inline as a data URI to avoid network requests
- Pick one variant during implementation; delete the unused files before shipping

**Warm gradient base:**
```css
background: linear-gradient(180deg, #1a1410 0%, #2d1f0e 40%, #1a1409 70%, #0d0a07 100%);
```

**Spice glow on landing screen:**
- Subtle radial gradient behind the title area:
  ```css
  background: radial-gradient(ellipse at 50% 40%, rgba(231,155,7,0.08) 0%, transparent 60%);
  ```
- Only on the title screen; other screens use the base gradient alone

**Performance constraints:**
- No image files; CSS-only effects
- Noise texture is a single inline SVG, no network request
- `prefers-reduced-motion` does not affect static backgrounds (they're not animated)

### F1.2: Typography Upgrade

Replace the display font for stronger thematic identity. Body font remains Inter for readability.

**New font stack:**

| Role | Current | New | Rationale |
|------|---------|-----|-----------|
| Title (H1 only) | Cormorant Garamond 700 | **Cinzel Decorative** 700 | Roman imperial inscriptions; ornamental capitals evoke Great House authority |
| Headings (H2-H3) | Cormorant Garamond 600 | **Cinzel** 400/700 | Same classical family, cleaner at smaller sizes |
| Flavor text / quotes | Cormorant Garamond Italic | **Cormorant Garamond Italic** (keep) | Already perfect for in-character commentary |
| HUD / turn indicator | Inter 500 | **Orbitron** 400 (optional, small use only) | Futuristic feel for status display; fallback to Inter if readability suffers |
| Body / UI | Inter | **Inter** (keep) | Maximum readability, already installed |

**Installation (self-hosted via Fontsource, consistent with existing Inter Variable setup):**
```bash
npm install @fontsource/cinzel-decorative @fontsource-variable/cinzel @fontsource/orbitron
```

Then import in the app entry point:
```ts
import '@fontsource/cinzel-decorative/700.css';
import '@fontsource-variable/cinzel';
import '@fontsource/orbitron/400.css';
```

**Google Fonts preview (for visual reference only; do not use CDN import):**
```
https://fonts.google.com/share?selection.family=Cinzel+Decorative:wght@700;900|Cinzel:wght@400;700|Orbitron:wght@400;700
```

**New CSS tokens:**
```css
:root {
  --font-title: 'Cinzel Decorative', 'Cormorant Garamond', Georgia, serif;
  --font-heading: 'Cinzel', 'Cormorant Garamond', Georgia, serif;
  --font-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; /* unchanged */
  --font-hud: 'Orbitron', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; /* unchanged */
}
```

**Preload critical fonts** via `<link rel="preload">` for Cinzel Decorative 700 (title) and Cinzel 700 (headings). Use `font-display: swap` on all.

### F1.3: Title Screen Enhancement

Transform the landing screen from minimal to atmospheric.

- **Title text**: Switch to `--font-title` (Cinzel Decorative), add metallic gold gradient + spice-glow:
  ```css
  /* Metallic gold gradient (ref: texteffects.dev/posts/gold-text-effect) */
  background: linear-gradient(to bottom, #cfc09f 22%, #634f2c 24%, #cfc09f 26%, #cfc09f 27%, #ffecb3 40%, #3a2c0f 78%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  ```
  With a duplicate shadow layer behind the text for glow depth:
  ```css
  text-shadow: 0 0 20px rgba(231,155,7,0.3), 0 0 40px rgba(231,155,7,0.1);
  ```
- **Subtitle contrast fix**: Change from `--dust` to `--bone` at 70% opacity for readability while maintaining softness
- **Decorative separator**: Add a thin horizontal rule between title and buttons -- 1px `--gold` at 40% opacity, max-width 200px, centered
- **Button press feedback**: Add `transform: scale(0.97)` on `:active` state for tactile response
- **Spice glow background**: Per F1.1, radial gradient behind the title area

### F1.4: Game Board Visual Depth

Make the board feel like an etched stone war table.

**Board frame:**
- Add layered box-shadow for carved/inset depth effect:
  ```css
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.4),
    0 4px 12px rgba(0,0,0,0.3),
    0 0 20px rgba(196,151,59,0.05);
  ```

**Grid lines:**
- Add subtle spice-glow to cell borders: `box-shadow: 0 0 4px rgba(231,155,7,0.15)` on inner borders
- Consider using `--gold` at 20% opacity instead of `--sand-light` for grid lines to add warmth

**Cell hover improvement:**
- Add `transform: scale(1.02)` on hover in addition to the existing gold inset shadow
- Brighten location name to `--bone` on hover (currently stays `--dust`)
- **Custom themed cursor** on empty cells (ref: [SVG Backgrounds guide](https://www.svgbackgrounds.com/elements/custom-css-cursors/)):
  ```css
  .board-cell:not([disabled]) {
    cursor: url('data:image/svg+xml,...') 16 16, crosshair;
  }
  ```
  Use the Plain Dagger SVG from game-icons.net resized to 32x32 as a cursor asset, with `crosshair` as fallback

**Location name readability:**
- Increase font size from 0.625rem (10px) to 0.75rem (12px)
- Add `letter-spacing: 0.08em` for all-caps legibility
- **Fix contrast**: On `--sand-medium` background, location labels must use a color that achieves 4.5:1. Replace `--dust` (#8a7d6b, 3.80:1 on sand-medium) with a new token `--dust-bright` (#a89b88) or use `--bone` at 60% opacity.

### F1.5: Themed Game Piece Icons

Replace plain X and O text markers with SVG icons that connect to the Dune universe.

**Source:** [game-icons.net](https://game-icons.net) (4,170+ free SVGs, CC BY 3.0 license -- attribution required)

SVG download pattern: `game-icons.net/icons/ffffff/transparent/1x1/{artist}/{name}.svg`

**Recommended game piece pairing:**

| Marker | Icon | Artist | URL | Color |
|--------|------|--------|-----|-------|
| Player (House Atreides) | Plain Dagger (crysknife) | Lorc | [plain-dagger](https://game-icons.net/1x1/lorc/plain-dagger.html) | `--bone` |
| CPU | Sea Serpent (sandworm) | Lorc | [sea-serpent](https://game-icons.net/1x1/lorc/sea-serpent.html) | `--gold` |

**Alternative game piece pairings:**

| Player Icon | CPU Icon | Thematic Angle |
|-------------|----------|----------------|
| [Hawk Emblem](https://game-icons.net/1x1/lorc/hawk-emblem.html) (Lorc) | [Sea Serpent](https://game-icons.net/1x1/lorc/sea-serpent.html) (Lorc) | Atreides hawk vs sandworm |
| [Eagle Emblem](https://game-icons.net/1x1/lorc/eagle-emblem.html) (Lorc) | [Bull Horns](https://game-icons.net/1x1/lorc/bull-horns.html) (Lorc) | Raptor vs Old Duke's bull |
| [All-Seeing Eye](https://game-icons.net/1x1/delapouite/all-seeing-eye.html) (Delapouite) | [Sand Snake](https://game-icons.net/1x1/delapouite/sand-snake.html) (Delapouite) | Bene Gesserit eye vs desert predator |

**Faction card icons** (for opponent selection differentiation, see F1.6):

| Character | Icon | Artist | URL | Rationale |
|-----------|------|--------|-----|-----------|
| Baron Harkonnen | Spider | Carl Olsen | [spider-alt](https://game-icons.net/1x1/carl-olsen/spider-alt.html) | Scheming, web-spinning predator |
| Reverend Mother | All-Seeing Eye | Delapouite | [all-seeing-eye](https://game-icons.net/1x1/delapouite/all-seeing-eye.html) | Bene Gesserit prescience |
| Stilgar | Sand Snake | Delapouite | [sand-snake](https://game-icons.net/1x1/delapouite/sand-snake.html) | Desert survivalist, patient hunter |

**Implementation:**
- Download SVGs, inline them as React components
- Size: 2rem (matching current text markers)
- Color via `currentColor` so they inherit from the existing `--bone` / `--gold` token system
- Keep the scale-in placement animation (0.8 -> 1.0)
- Add a **radial ripple** on placement: a thin ring of faction-colored light expands outward (200ms, opacity 1 to 0) for extra tactile satisfaction
- Ensure `aria-label` on cells still says "Player X" / "CPU O" (screen reader doesn't need to know the icon)
- Add `aria-hidden="true"` to all SVG icon elements

**Attribution:** Add a footer link or about/credits section: "Game icons by [game-icons.net](https://game-icons.net) under CC BY 3.0. Icons by Lorc, Delapouite, and Carl Olsen."

### F1.6: Opponent Card Differentiation

Give each opponent card a distinct visual identity reflecting their faction.

**Card accent colors and faction icons:**

| Character | Border Color | Accent Detail | Icon (from F1.5) | Icon URL |
|-----------|-------------|---------------|-------------------|----------|
| Baron Harkonnen | `--deep-blue` | Subtle red inner glow | Spider | [spider-alt](https://game-icons.net/1x1/carl-olsen/spider-alt.html) |
| Reverend Mother | `--gold` | Mystic shimmer (subtle gradient border) | All-Seeing Eye | [all-seeing-eye](https://game-icons.net/1x1/delapouite/all-seeing-eye.html) |
| Stilgar | `--spice-orange` | Sand-warm undertone | Sand Snake | [sand-snake](https://game-icons.net/1x1/delapouite/sand-snake.html) |

Place each icon at the top of its card (above the character name) at 2rem size, colored with the card's accent color. Use `currentColor` for easy theming.

**Difficulty badge color fix** (match universal gaming conventions):

| Difficulty | Current Color | New Color | Token |
|------------|--------------|-----------|-------|
| Easy | `--spice-orange` | Muted green `#5a8a3c` | `--difficulty-easy` |
| Medium | `--gold` | `--gold` (keep) | `--difficulty-medium` |
| Hard | `--blood-red` | `--blood-red` (keep) | `--difficulty-hard` |

**Card hover:**
- `translateY(-4px)` lift (current is -2px)
- Faction-colored glow `box-shadow` matching the card's accent

**Difficulty indicator upgrade:**
- Replace diamond symbols (◇) with small filled/unfilled circle SVGs or star icons for clearer visual weight

### F1.7: Interaction & Animation Polish

Improve micro-interactions across all screens.

**Button press feedback (all buttons):**
```css
button:active {
  transform: scale(0.97);
  transition: transform 80ms ease-out;
}
```

**Commentary slide-up:**
- Change from pure fade-in to `translateY(8px) + opacity 0` -> `translateY(0) + opacity 1` over 300ms
- Adds spatial meaning: commentary rises from below the board

**Winning line connector** (ref: [CSS-Tricks: SVG Line Animation](https://css-tricks.com/svg-line-animation-works/)):
- Overlay an `<svg>` element on the board, draw a `<line>` between winning cell centers
- Gold line, 2px stroke width, with glow: `filter: drop-shadow(0 0 8px rgba(232,185,74,0.5))`
- Animate using `stroke-dasharray` / `stroke-dashoffset`: set both to line length, animate `stroke-dashoffset` to 0 over 400ms
- The line should remain visible through the win overlay scrim (ensure sufficient z-index)
  ```css
  @keyframes draw-line {
    from { stroke-dashoffset: var(--line-length); }
    to { stroke-dashoffset: 0; }
  }
  ```

**Screen transitions:**
- Add a 200ms crossfade between screens (title -> opponent select -> game -> game over)
- Use CSS `opacity` + `transform: translateY(8px)` for entering screen, reverse for exiting
- Respect `prefers-reduced-motion`: instant cut when enabled

**Cell placement glow burst:**
- On piece placement, briefly flash a spice-glow `text-shadow` on the marker:
  ```css
  text-shadow: 0 0 12px rgba(232,185,74,0.6);
  ```
- Fades to normal over 300ms

### F1.8: Accessibility Fixes

Address contrast failures and interaction gaps identified during review.

**Contrast fixes:**

| Element | Current | Fix | New Ratio |
|---------|---------|-----|-----------|
| Board cell location names | `--dust` on `--sand-medium` (3.80:1) | Use `--bone` at 60% opacity or new `--dust-bright` (#a89b88) | >= 4.5:1 |
| Landing subtitle | `--dust` italic, small size | Bump to `--bone` at 70% opacity | >= 4.5:1 |
| Difficulty badges (small text) | Various on colored bg | Verify each pairing meets 4.5:1; adjust text/bg as needed | >= 4.5:1 |

**Remove debug artifacts:**
- The "Clicked" tooltip visible in the walkthrough GIF must be removed before any release

**Additional checks:**
- Verify new Cinzel Decorative font renders clearly at title size (3rem); test at 2rem as lower bound
- Verify new green difficulty-easy badge meets contrast on `--sand-medium` card background
- Ensure SVG game piece icons have sufficient contrast against cell backgrounds

### F1.9: Win Screen Refinement

Polish the game-over overlay.

- **Reduce scrim opacity** from 0.75 to 0.60 -- keep the winning line connector and board state visible through the overlay
- **Character-flavored victory titles**: Replace generic "Player O Wins!" with faction-specific text:
  - Player wins: *"House Atreides Triumphs!"*
  - Baron wins: *"The Baron Prevails!"*
  - Reverend Mother wins: *"The Bene Gesserit See All!"*
  - Stilgar wins: *"The Desert Claims Victory!"*
  - Draw: *"The Desert Claims All"* (thematic stalemate)
- **Add spice-glow to title text**: pulsing `text-shadow` animation on victory title (1.5s cycle)
- **Swap button priority**: Make "Rematch" the primary (gold-filled) button since it's the faster action; "Play Again" becomes secondary (outlined)
- **Victory particle burst** using [`@neoconfetti/react`](https://www.npmjs.com/package/@neoconfetti/react) (~3 kB, CSS-only, no canvas):
  ```bash
  npm install @neoconfetti/react
  ```
  Configure with Dune palette colors (`#c4973b`, `#e8b94a`, `#d4722a`), fire once on win (not on draw). Alternatively, implement a pure CSS burst with 8-12 gold particle keyframes (0 kB)
- **Draw state**: Both markers fade to a desaturated tone (as if buried by sand); show a thematic draw quote from the opponent character

### F1.10: Optional Ambient Effects (Low Priority)

Atmospheric touches that add life. Implement only if time permits, as these are purely decorative.

**Drifting sand particles (CSS-only):**
- 3-5 small dot elements (`2-4px`, `--gold` at 15-25% opacity)
- Slow horizontal drift animation (20-30s cycle) with slight vertical oscillation
- Positioned in the background layer (`z-index: -1`)
- Hidden when `prefers-reduced-motion: reduce`

**Alternative: tsParticles (React library):**
- Library: `@tsparticles/react` (MIT license)
- Configure sand-colored particles: colors `#c4a46a`, `#e79b07`; size 1-3px; opacity 0.3-0.6; slow movement
- Only render on title screen and game-over screen to limit performance impact
- GitHub: `github.com/tsparticles/tsparticles`

### F1.11: Player Faction Identity

The single biggest missed opportunity for emotional investment. The player should feel like House Atreides, not "Player X".

**Turn indicator upgrade:**
- Replace "Player X's turn" with faction-flavored text:
  - Player's turn: *"House Atreides moves"*
  - CPU's turn: *"Baron Harkonnen schemes..."* / *"The Reverend Mother contemplates..."* / *"Stilgar reads the sands..."*
- Color the turn indicator text with the active faction's accent color
- Use `--font-hud` (Orbitron) for the turn indicator to reinforce the HUD aesthetic

**Game piece identity:**
- Player's marker colored with a subtle blue-teal tint (Atreides blue) rather than plain `--bone`
- CPU's marker keeps `--gold` (universal antagonist warmth)
- Add a new CSS token: `--atreides-blue: #4a7c8a` (muted teal, Atreides house color from the films)

**Favicon and document title:**
- Generate a favicon from the [Hawk Emblem](https://game-icons.net/1x1/lorc/hawk-emblem.html) SVG using [favicon.io](https://favicon.io/) or [RealFaviconGenerator](https://realfavicongenerator.net/)
- Background: `#1a1409` (sand-dark), icon color: `#c4973b` (gold)
- Update `document.title` dynamically during gameplay:
  - Title screen: *"Dune Tac Toe"*
  - In game: *"Your Turn -- Dune Tac Toe"* / *"Baron is thinking..."*
  - Win: *"Victory! -- Dune Tac Toe"*

### F1.12: Opponent Presence on Game Screen

After selecting an opponent, add persistent visual context during gameplay.

- Show a **compact opponent indicator** near the top of the game screen: faction icon + name + difficulty badge
- Format: `[icon] vs Baron Harkonnen [HARD]`
- When it's the CPU's turn, the opponent indicator subtly pulses with their faction color
- Keeps the player oriented without needing to wait for commentary

### F1.13: Pre-Game Cinematic Transition

Add a brief interstitial (1-1.5 seconds) between opponent selection and the game board.

- Display the opponent's name in large `--font-title` (Cinzel Decorative)
- Show a faction-flavored one-liner:
  - Baron: *"The Baron does not play games. He plays you."*
  - Reverend Mother: *"The future is already written."*
  - Stilgar: *"The desert tests all who enter."*
- Fade into the game board
- Use CSS-only crossfade (`opacity` + `translateY`), 200ms enter + 800ms hold + 200ms exit
- Respect `prefers-reduced-motion`: skip interstitial, go directly to board

### F1.14: Running Match Score

Add session-persistent score tracking for replayability.

- Display a compact score line above or beside the board:
  ```
  House Atreides 2 — 1 Baron Harkonnen
  ```
- Styled in `--font-hud` (Orbitron), small size (0.75rem), `--dust` color
- Resets only when the player returns to the title screen or changes opponents
- Increment on win; draws add to neither side
- Creates natural "best of 5" dynamics without explicit implementation

### F1.15: Empty Board First-Move Prompt

Add atmospheric direction for the opening move of each game.

- On game start, show a brief text prompt below the turn indicator: *"Claim your first territory"*
- Styled in `--font-display` (Cormorant Garamond italic), `--dust` color, fades out after the first move (300ms)
- Optionally, subtly pulse The Palace (center cell) with a very faint spice glow to hint at strategic value for new players

---

## Asset Catalog

### Fonts (SIL Open Font License -- no attribution required)

| Font | Role | npm Package | Google Fonts | Bundle |
|------|------|-------------|-------------|--------|
| **Cinzel Decorative** 700 | Title (H1) | [`@fontsource/cinzel-decorative`](https://www.npmjs.com/package/@fontsource/cinzel-decorative) | [Specimen](https://fonts.google.com/specimen/Cinzel+Decorative) | ~30 kB woff2 |
| **Cinzel** 400/700 (variable) | Headings (H2-H3) | [`@fontsource-variable/cinzel`](https://www.npmjs.com/package/@fontsource-variable/cinzel) | [Specimen](https://fonts.google.com/specimen/Cinzel) | ~40 kB woff2 |
| **Orbitron** 400 | HUD / turn indicator | [`@fontsource/orbitron`](https://www.npmjs.com/package/@fontsource/orbitron) | [Specimen](https://fonts.google.com/specimen/Orbitron) | ~15 kB woff2 |
| **Cormorant Garamond** (keep) | Flavor text / quotes | already installed | - | - |
| **Inter Variable** (keep) | Body / UI | already installed | - | - |

Self-hosted via Fontsource to avoid external network requests. Preload Cinzel Decorative 700 and Cinzel 700 via `<link rel="preload">`. Use `font-display: swap` on all.

### SVG Game Icons (CC BY 3.0 -- attribution required)

Source: [game-icons.net](https://game-icons.net) (4,170+ free SVGs)

Download pattern: `game-icons.net/icons/ffffff/transparent/1x1/{artist}/{name}.svg`

**Game Pieces:**

| Role | Icon | Artist | URL |
|------|------|--------|-----|
| Player marker | Plain Dagger (crysknife) | Lorc | [plain-dagger](https://game-icons.net/1x1/lorc/plain-dagger.html) |
| CPU marker | Sea Serpent (sandworm) | Lorc | [sea-serpent](https://game-icons.net/1x1/lorc/sea-serpent.html) |

**Faction Card Icons:**

| Character | Icon | Artist | URL |
|-----------|------|--------|-----|
| Baron Harkonnen | Spider | Carl Olsen | [spider-alt](https://game-icons.net/1x1/carl-olsen/spider-alt.html) |
| Reverend Mother | All-Seeing Eye | Delapouite | [all-seeing-eye](https://game-icons.net/1x1/delapouite/all-seeing-eye.html) |
| Stilgar | Sand Snake | Delapouite | [sand-snake](https://game-icons.net/1x1/delapouite/sand-snake.html) |

**Alternative / Secondary Icons:**

| Icon | Artist | URL | Use Case |
|------|--------|-----|----------|
| Hawk Emblem | Lorc | [hawk-emblem](https://game-icons.net/1x1/lorc/hawk-emblem.html) | Player identity / favicon source / Atreides sigil |
| Eagle Emblem | Lorc | [eagle-emblem](https://game-icons.net/1x1/lorc/eagle-emblem.html) | Alternative player marker (more detailed raptor) |
| Bull Horns | Lorc | [bull-horns](https://game-icons.net/1x1/lorc/bull-horns.html) | Old Duke's bull lore reference |
| Sand Snake | Delapouite | [sand-snake](https://game-icons.net/1x1/delapouite/sand-snake.html) | Alternative CPU marker / Stilgar card |
| Sea Dragon | Lorc | [sea-dragon](https://game-icons.net/1x1/lorc/sea-dragon.html) | Alternative sandworm representation |

**In-app attribution (required):** `"Game icons by game-icons.net under CC BY 3.0. Icons by Lorc, Delapouite, and Carl Olsen."`

### Background Textures & Noise (free, no attribution)

**Pre-generated SVG noise** already in `frontend/src/assets/` (fine, medium, coarse). Pick one during implementation, delete unused.

**Online generators for custom textures:**

| Tool | URL | Use For |
|------|-----|---------|
| fffuel nnnoise | [fffuel.co/nnnoise](https://www.fffuel.co/nnnoise/) | Custom feTurbulence SVG noise with live preview |
| fffuel gggrain | [fffuel.co/gggrain](https://www.fffuel.co/gggrain/) | Organic grainy gradient overlays (sand dune effect) |
| Frontend Hero Noise Generator | [frontend-hero.com/css-noise-generator](https://frontend-hero.com/css-noise-generator) | Quick CSS + SVG filter code with copy-paste output |
| Hero Patterns | [heropatterns.com](https://heropatterns.com/) | Repeatable SVG patterns (topography = dune ridges) -- CC BY 4.0 |

### Victory Celebration (optional npm dependency)

| Package | Bundle | Approach | URL |
|---------|--------|----------|-----|
| **@neoconfetti/react** (recommended) | ~3 kB | CSS-only, no canvas | [npm](https://www.npmjs.com/package/@neoconfetti/react) |
| react-confetti-explosion | ~23 kB | CSS-only, explosion burst | [npm](https://www.npmjs.com/package/react-confetti-explosion) |
| canvas-confetti | ~6 kB | Canvas, most customizable | [GitHub](https://github.com/catdad/canvas-confetti) |
| Pure CSS (0 kB) | 0 kB | DIY 8-12 particle keyframes | [Examples](https://foolishdeveloper.com/css-confetti-animations-code/) |

Configure with Dune palette (`#c4973b`, `#e8b94a`, `#d4722a`). Fire once on player win, not continuously.

### Favicon Generation

Generate from the Hawk Emblem SVG:

| Tool | URL |
|------|-----|
| favicon.io | [favicon.io](https://favicon.io/) |
| RealFaviconGenerator | [realfavicongenerator.net](https://realfavicongenerator.net/) |
| FaviconGenerator.io | [favicongenerator.io](https://favicongenerator.io/) |

Settings: background `#1a1409` (sand-dark), icon color `#c4973b` (gold).

### Bundle Impact Summary

| Asset Category | Estimated Size | Loading |
|----------------|---------------|---------|
| Fonts (Cinzel Decorative + Cinzel + Orbitron) | ~85 kB woff2 | Async, `font-display: swap` |
| SVG icons (6-8 icons inlined) | ~2 kB | Bundled, no network request |
| SVG noise texture | ~2 kB | Inlined as data URI |
| @neoconfetti/react (optional) | ~3 kB | Lazy-loaded on win screen |
| **Total** | **~92 kB** | Mostly async / deferred |

### Color Palette References

Research/inspiration sources, not assets requiring licensing:

- [ColorsWall Dune Movie Palette](https://colorswall.com/palette/168968) -- 6 hex codes from the 2021 poster
- [Rdune R Package](https://nvietto.github.io/Rdune/) -- faction-specific palettes for Arrakis, Atreides, Fremen, Harkonnen, Corrino, Bene Gesserit
- [Pixflow Dune Cinematography Analysis](https://pixflow.net/blog/dune-movies-cinematography-color-palette/)
- Color theory applied to Dune Part Two by Cecile Yadro

### CSS Effect References

| Technique | Reference |
|-----------|-----------|
| SVG feTurbulence noise | [CSS-Tricks: Grainy Gradients](https://css-tricks.com/grainy-gradients/) |
| feTurbulence MDN spec | [MDN feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence) |
| Grainy backgrounds tutorial | [freeCodeCamp: SVG Filters](https://www.freecodecamp.org/news/grainy-css-backgrounds-using-svg-filters/) |
| Gold text gradient effect | [texteffects.dev](https://texteffects.dev/posts/gold-text-effect) |
| Gold gradient CodePen | [codepen.io/mandymichael](https://codepen.io/mandymichael/pen/xpLNeV) |
| Animated gold shine | [codepen.io/ponycorn](https://codepen.io/ponycorn/pen/LYRJOxW) |
| SVG line draw animation | [CSS-Tricks: SVG Line Animation](https://css-tricks.com/svg-line-animation-works/) |
| SVG stroke-dasharray tutorial | [dev.to/paulryan7](https://dev.to/paulryan7/simple-svg-drawing-effect-with-stroke-dasharray-stroke-dashoffset-3m8e) |
| Tic Tac Toe with SVG | [codepen.io/jh3y](https://codepen.io/jh3y/pen/BVaGKP) |
| Text-shadow glow approach | [CSS-Tricks: Neon Text](https://css-tricks.com/how-to-create-neon-text-with-css/) |
| CSS glow effects gallery | [FreeFrontend: 71 Glow Effects](https://freefrontend.com/css-glow-effects/) |
| CSS particle backgrounds | [FreeFrontend: 14 Particle Backgrounds](https://freefrontend.com/css-particle-backgrounds/) |
| Custom CSS cursors | [SVG Backgrounds guide](https://www.svgbackgrounds.com/elements/custom-css-cursors/) |
| CSS cursor MDN spec | [MDN cursor](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/cursor) |

---

## Implementation Priority

Ordered by visual impact per effort:

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| 1 | F1.11 Player faction identity | Medium | Very High -- transforms "X vs O" into "Atreides vs Harkonnen" |
| 2 | F1.1 Background atmosphere | Small | High -- transforms every screen |
| 3 | F1.2 Typography upgrade | Small | High -- title becomes iconic |
| 4 | F1.8 Accessibility fixes | Small | Critical -- fixes WCAG failures |
| 5 | F1.3 Title screen enhancement | Small | High -- first impression + gold gradient text |
| 6 | F1.14 Running match score | Small | High -- drives replayability |
| 7 | F1.4 Board visual depth | Medium | High -- centerpiece of the game |
| 8 | F1.12 Opponent presence on game screen | Small | High -- contextualizes every move |
| 9 | F1.7 Interaction polish | Medium | Medium -- perceived quality lift |
| 10 | F1.6 Opponent card differentiation | Medium | Medium -- character identity |
| 11 | F1.5 Themed game piece icons | Medium | Medium -- thematic connection |
| 12 | F1.9 Win screen refinement | Medium | Medium -- celebration + faction titles |
| 13 | F1.13 Pre-game cinematic transition | Small | Medium -- builds anticipation |
| 14 | F1.15 Empty board first-move prompt | Small | Low-Medium -- onboarding atmosphere |
| 15 | F1.10 Ambient effects | Medium | Low -- decorative only |

## Design Verification Checklist

Before shipping Phase 1, verify against the [Theme & Design checklist](theme.md#pre-delivery-checklist) plus:

### Visual Atmosphere
- [ ] Background gradient visible on all screens (not flat solid color)
- [ ] Sand-grain noise texture visible at subtle opacity
- [ ] Title screen has spice-glow radial gradient
- [ ] No visual regression on existing screens

### Typography
- [ ] Cinzel Decorative renders correctly at 3rem title size
- [ ] Cinzel renders correctly at heading sizes (1.5rem, 1.25rem)
- [ ] Font fallbacks display acceptably if web fonts fail to load
- [ ] `font-display: swap` set on all new fonts
- [ ] Critical fonts preloaded via `<link rel="preload">`

### Game Board
- [ ] Board frame has carved/inset depth shadow
- [ ] Cell hover shows scale + gold border + brightened location name
- [ ] Location names meet 4.5:1 contrast on `--sand-medium`
- [ ] SVG game pieces (if implemented) render at correct size with correct colors
- [ ] Winning line connector animates correctly for all 8 win patterns

### Opponent Cards
- [ ] Each card has distinct faction-colored border/accent
- [ ] Difficulty badges use green/gold/red convention
- [ ] Card hover lift and glow are visually distinct per character

### Interactions
- [ ] All buttons have `:active` scale feedback
- [ ] Screen transitions crossfade smoothly (200ms)
- [ ] Commentary slides up from below (not just fades)
- [ ] Piece placement has brief glow burst + radial ripple
- [ ] Custom themed cursor on empty board cells
- [ ] All animations respect `prefers-reduced-motion: reduce`

### Faction Identity
- [ ] Turn indicator shows faction names, not "Player X" / "Player O"
- [ ] Turn indicator colored with active faction's accent
- [ ] Opponent indicator visible during gameplay (icon + name + difficulty)
- [ ] Win overlay shows faction-flavored victory title
- [ ] Draw state shows thematic message (*"The Desert Claims All"*)
- [ ] Running match score visible during game and between rematches

### Cinematic Pacing
- [ ] Pre-game interstitial displays opponent name + faction quote
- [ ] First-move atmospheric prompt appears and fades after first move
- [ ] Victory confetti burst fires on win (gold particles, Dune palette)

### Accessibility
- [ ] All text/background contrast ratios >= 4.5:1 (verified with DevTools)
- [ ] "Clicked" debug tooltip removed
- [ ] New SVG icons have appropriate `aria-hidden="true"` (cell aria-label handles semantics)
- [ ] CC BY 3.0 attribution for game-icons.net present in app (Lorc, Delapouite, Carl Olsen)
- [ ] Pre-game interstitial skipped when `prefers-reduced-motion: reduce`

### Browser Chrome
- [ ] Favicon generated from Hawk Emblem SVG (gold on sand-dark)
- [ ] Document title updates dynamically per screen/state

## Dependencies

- [Phase 0](phase-0.md) -- All Phase 0 features must be complete and stable
- [Theme & Design](theme.md) -- Phase 1 extends but does not replace the existing design system
- [Game Design](game-design.md) -- No gameplay changes; visual-only modifications

## Out of Scope (Future Phases)

- Sound effects and music
- Animated sandworm or spice blow full-screen effects
- Mobile-optimized responsive layout
- Dark/light mode toggle (app is dark-only by design)
- Custom game piece selection by the player
- Character portrait illustrations
- Multiplayer / online play
- Keyboard shortcut grid navigation (numpad 1-9 mapping)
- Opponent card hover preview (sample quip before selecting)
- Commentary box side-positioning on wider viewports
- Idle taunts (opponent quips after player inactivity)

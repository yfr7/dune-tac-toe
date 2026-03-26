# Theme & Design

> Visual design system and UI/UX guidelines for [Dune Tac Toe](prd.md), inspired by Denis Villeneuve's Dune films.

## Design Philosophy

The UI should evoke the cinematic grandeur of Villeneuve's Dune - vast, austere, and dramatic. The game board feels like a strategic war table in a dimly lit Arrakeen palace. Every visual choice serves the atmosphere: muted desert tones, sharp gold accents, and generous use of negative space.

**Guiding principles:**
- **Atmosphere over decoration** - Every visual element reinforces the Dune setting; nothing is purely ornamental
- **Clarity under darkness** - Dark theme demands verified contrast; readability is non-negotiable
- **Responsive feedback** - Every interaction provides immediate, meaningful visual acknowledgment
- **Accessible by default** - Keyboard navigation, screen reader support, and reduced motion are built in, not bolted on

## Color Palette

### Tokens

| Token | Hex | Usage | Role |
|-------|-----|-------|------|
| `--sand-dark` | `#1a1409` | Page background, deepest layer | `background` |
| `--sand-medium` | `#2d2417` | Card backgrounds, board container | `surface` |
| `--sand-light` | `#4a3c2a` | Board grid lines, decorative borders | `border` |
| `--gold` | `#c4973b` | Primary accent, headings, active states | `primary` |
| `--gold-bright` | `#e8b94a` | Hover states, highlights, focus rings | `primary-hover` |
| `--spice-orange` | `#d4722a` | Secondary accent, alerts, spice references | `secondary` |
| `--dust` | `#8a7d6b` | Secondary text on dark backgrounds only | `muted` |
| `--bone` | `#e8dcc8` | Primary text | `foreground` |
| `--deep-blue` | `#0a1628` | Harkonnen-themed elements, shadows | `accent-harkonnen` |
| `--blood-red` | `#c44040` | Error states, destructive actions | `destructive` |
| `--success-spice` | `#b8860b` | Success confirmations | `success` |

### Contrast Verification

All text/background combinations must meet WCAG AA (4.5:1 for normal text, 3:1 for large text). Verified pairings:

| Foreground | Background | Ratio | AA Normal | AA Large |
|------------|------------|-------|-----------|----------|
| `--bone` | `--sand-dark` | 13.50:1 | PASS | PASS |
| `--bone` | `--sand-medium` | 11.26:1 | PASS | PASS |
| `--gold` | `--sand-dark` | 6.83:1 | PASS | PASS |
| `--gold` | `--sand-medium` | 5.69:1 | PASS | PASS |
| `--gold-bright` | `--sand-dark` | 9.99:1 | PASS | PASS |
| `--dust` | `--sand-dark` | 4.55:1 | PASS | PASS |
| `--spice-orange` | `--sand-dark` | 5.44:1 | PASS | PASS |
| `--bone` | `--deep-blue` | 13.38:1 | PASS | PASS |

**Corrected from original design:**
- `--blood-red` changed from `#6b1a1a` to `#c44040` - the original was invisible on dark backgrounds (1.56:1 ratio). New value achieves 4.82:1 on `--sand-dark`.
- `--dust` must only be used on `--sand-dark`, never on `--sand-medium` (3.80:1 fails AA normal text).
- `--sand-light` borders are decorative only (1.72:1) - never use for text or meaningful UI boundaries. For interactive element borders requiring 3:1 contrast, use `--dust` or `--gold`.

### Color Rules

- **Never use color alone** to convey meaning. Pair error red with an icon and text label. Pair turn indicators with text ("Your turn" / "CPU thinking").
- **Scrim opacity**: Game over overlay uses `rgba(26, 20, 9, 0.75)` (`--sand-dark` at 75%) to maintain foreground legibility.
- Define all colors via CSS custom properties at `:root`. No raw hex values in component styles.

## Typography

### Font Stack

For a cinematic Dune feel, use **Cormorant Garamond** (display/commentary) paired with **Inter** (UI/body). System fonts serve as fallback.

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

Use `font-display: swap` to avoid invisible text during font load.

### Type Scale

| Element | Font | Weight | Size | Line Height | Letter Spacing |
|---------|------|--------|------|-------------|----------------|
| Game title | `--font-display` | 700 | 3rem (48px) | 1.1 | -0.02em |
| Screen headings | `--font-body` | 600 | 1.5rem (24px) | 1.3 | -0.01em |
| Body text | `--font-body` | 400 | 1rem (16px) | 1.5 | 0 |
| Commentary | `--font-display` italic | 400 | 1.125rem (18px) | 1.6 | 0 |
| Board labels | `--font-body` | 500 | 0.75rem (12px) | 1.2 | 0.05em |
| Buttons | `--font-body` | 600 | 1rem (16px) | 1 | 0.02em |
| Turn indicator | `--font-body` | 500 | 0.875rem (14px) | 1.4 | 0.03em |

### Typography Rules

- **Minimum body text**: 16px. Never go below 12px for any visible text.
- **Line length**: Limit commentary and body text to 60-75 characters per line (`max-width: 40ch` on commentary box).
- **Hierarchy via weight**: Bold (700) for titles, Semi-bold (600) for headings, Medium (500) for labels, Regular (400) for body.

## Spacing System

Use an 8px base grid. All spacing values are multiples of 4px or 8px.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps (icon-to-text, border padding) |
| `--space-2` | 8px | Inner padding, grid line width |
| `--space-3` | 12px | Small component padding |
| `--space-4` | 16px | Standard component padding, card insets |
| `--space-6` | 24px | Section gaps, board cell padding |
| `--space-8` | 32px | Large section spacing |
| `--space-12` | 48px | Screen section separation |
| `--space-16` | 64px | Major layout sections |

### Elevation & Layering

| Layer | z-index | Usage |
|-------|---------|-------|
| Base | 0 | Page background, board |
| Surface | 10 | Cards, board cells |
| Overlay | 40 | Commentary area, tooltips |
| Modal | 100 | Game over overlay |
| Toast | 1000 | Error notifications |

## Board Design

The game board is the visual centerpiece. Each cell is a named Dune location (see [Game Design - Board](game-design.md#the-board)).

```
┌──────────────┬──────────────┬──────────────┐
│              │              │              │
│   ARRAKEEN   │   CARTHAG    │  GIEDI PRIME │
│              │              │              │
├──────────────┼──────────────┼──────────────┤
│              │              │              │
│  SIETCH TABR │  THE PALACE  │    SALUSA    │
│              │              │  SECUNDUS    │
├──────────────┼──────────────┼──────────────┤
│              │              │              │
│   JACURUTU   │ TUONO BASIN  │  HEIGHLINER  │
│              │              │              │
└──────────────┴──────────────┴──────────────┘
```

### Board Specifications

- **Board max-width**: 480px (desktop), centered in viewport
- **Cell size**: Minimum 120px x 120px to ensure comfortable click targets
- **Grid lines**: 2px solid `--sand-light`
- **Border-radius**: 4px on outer board corners
- **Board container**: `--sand-medium` background with `--space-4` padding

### Cell States

| State | Visual Treatment | Transition |
|-------|-----------------|------------|
| Empty | Location name in `--dust`, `--sand-medium` background | — |
| Hover | `--gold-bright` border glow (inset `box-shadow`), location name shifts to `--bone` | 150ms ease-out |
| Focus (keyboard) | 2px `--gold-bright` outline with 2px offset, location name shifts to `--bone` | instant |
| X placed | `--bone` X marker (scale-in from 0.8), location name dims to 50% opacity | 200ms ease-out |
| O placed | `--gold` O marker (scale-in from 0.8), location name dims to 50% opacity | 200ms ease-out |
| Winning line | Cells pulse with `--gold-bright` glow (`box-shadow: 0 0 20px`) | 1s ease-in-out infinite |
| Disabled (CPU thinking) | 60% opacity, `cursor: wait`, pointer-events disabled | 150ms ease-out |
| Invalid click | Brief 200ms red flash (`--blood-red` at 20% opacity) then revert | 200ms |

### Cell Interaction

- Each cell is a `<button>` element for native keyboard and screen reader support.
- Cells receive `aria-label` with format: `"Arrakeen - empty"`, `"Carthag - X"`, `"The Palace - O"`.
- Tab order follows reading order: top-left to bottom-right (rows first).
- Enter or Space on a focused cell places a piece.

## Animation & Motion

### Timing Tokens

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--duration-fast` | 150ms | `ease-out` | Hover states, button press, focus |
| `--duration-base` | 200ms | `ease-out` | Piece placement, cell state changes |
| `--duration-slow` | 300ms | `ease-out` | Commentary fade-in, screen transitions |
| `--duration-pulse` | 1000ms | `ease-in-out` | Winning line glow (looping) |

### Animation Rules

- **Max 1-2 animated elements per state change**. Piece placement + commentary fade-in is the upper bound.
- **Exit animations are shorter than enter**: Commentary exit is ~60% of enter duration (180ms vs 300ms).
- **Transform/opacity only**: Never animate `width`, `height`, `top`, `left`, or layout-triggering properties.
- **No blocking animations**: The UI must remain interactive during all animations. Never disable input while something fades in.
- **Piece placement animation**: `transform: scale(0.8) → scale(1)` + `opacity: 0 → 1` over `--duration-base`.

### Reduced Motion

Respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

When reduced motion is enabled:
- Piece placement appears instantly (no scale animation)
- Commentary appears instantly (no fade)
- Winning line uses a static `--gold-bright` border instead of pulsing glow
- Screen transitions use instant cut instead of fade

## Commentary Display

When the CPU makes a move, its commentary appears in a styled dialogue area:

- Positioned below the board, centered, max-width 480px (aligned with board)
- Character name and difficulty shown as a label above commentary text
- Commentary text in `--font-display` italic
- Fade-in animation: `opacity 0 → 1` over `--duration-slow` (300ms)
- `aria-live="polite"` so screen readers announce new commentary without interrupting
- Max line length: `max-width: 40ch` for readability

### Opponent-Themed Styling

| Opponent | Background | Border | Label Color |
|----------|-----------|--------|-------------|
| Baron Harkonnen | `--deep-blue` at 40% opacity | 1px solid `--dust` | `--bone` |
| Reverend Mother | `--sand-medium` | 1px solid `--gold` | `--gold` |
| Stilgar | `--sand-medium` | 1px solid `--spice-orange` | `--spice-orange` |

## Loading & Error States

### CPU Thinking State

When waiting for the LLM response:

1. Board cells become disabled (60% opacity, `cursor: wait`)
2. Turn indicator updates to "**[Character] is thinking...**" with a subtle ellipsis animation (3 dots cycling, `--duration-slow`)
3. Commentary area shows a skeleton pulse: two bars (`--sand-light` at 20% opacity) mimicking text lines
4. If response exceeds 5 seconds, add text: "The spice is taking longer than usual..."

### Error State

When the LLM API fails:

1. Display error toast at bottom-center: `--blood-red` background, `--bone` text
2. Toast content: clear cause + recovery action (e.g., "Connection lost. [Retry]")
3. Toast auto-dismisses after 5 seconds but includes a manual dismiss (X) button
4. Toast uses `role="alert"` and `aria-live="assertive"` for screen reader announcement
5. Board remains in last valid state (don't clear pieces)
6. Fallback move executes with fallback commentary (see [Game Design](game-design.md#fallback-behavior))

### Empty States

- **No game in progress (title screen)**: Not applicable - title screen always has content
- **Commentary area before first CPU move**: Hidden entirely, not shown as empty

## Screen Layouts

### Title Screen
- Centered layout, vertically and horizontally
- Game title in `--font-display` at 3rem, `--gold` color
- Subtitle: *"The Spice Must Flow... But First, Tic-Tac-Toe"* in `--dust`, `--font-display` italic
- Two mode buttons: min-width 200px, min-height 48px, stacked vertically with `--space-4` gap
- Buttons: `--sand-medium` background, `--bone` text, 1px `--sand-light` border, `border-radius: 4px`
- Button hover: `--gold` border, `--gold-bright` text
- Button focus: 2px `--gold-bright` outline with 2px offset
- Subtle background: solid `--sand-dark` (avoid texture images for PoC performance)

### Opponent Selection
- Three cards in a row (flex, gap `--space-6`), centered
- Each card: min-width 180px, padding `--space-6`, `--sand-medium` background, `border-radius: 8px`
- Card content: character name (heading), difficulty label (badge), 1-2 line personality teaser
- Difficulty badge: uppercase `--font-body` 500, `--space-1` vertical + `--space-2` horizontal padding
  - Hard (Baron): `--blood-red` background, `--bone` text
  - Medium (Reverend Mother): `--gold` background, `--sand-dark` text
  - Easy (Stilgar): `--spice-orange` background, `--sand-dark` text
- Card hover: `border: 1px solid --gold`, transform `translateY(-2px)`, `--duration-fast`
- Selected card: `border: 2px solid --gold-bright`, `box-shadow: 0 0 12px rgba(232, 185, 74, 0.3)`
- Cards are `<button>` elements for keyboard access; tab between them with arrow keys

### Game Screen
- Board centered in viewport with `--space-12` top margin
- Turn indicator above board: `--font-body` 500, `--bone` text, `--space-4` below
- Board component (see [Board Design](#board-design))
- Commentary area below board with `--space-6` gap
- Minimal chrome - let the board breathe

### Game Over
- Semi-transparent overlay: `rgba(26, 20, 9, 0.75)` covering entire viewport
- Centered modal: `--sand-medium` background, `border-radius: 8px`, `--space-8` padding
- Winner text: `--font-display` 700 at 2rem, `--gold-bright`
- Closing quote: `--font-display` italic at 1.125rem, `--bone`, max-width 40ch
- Action buttons: "Play Again" (primary: `--gold` background, `--sand-dark` text) and "Rematch" (secondary: outlined, `--gold` border, `--gold` text)
- Buttons: min-height 48px, min-width 140px, `--space-4` gap between them
- Overlay fades in over `--duration-slow`; modal scales from 0.95 + fades in
- Focus trapped within modal while open (tab cycles through buttons only)
- Escape key closes overlay and returns to mode select

## Accessibility

### Keyboard Navigation

- **All interactive elements** are reachable via Tab key
- **Board cells**: Tab moves through cells in reading order; Enter/Space places a piece
- **Opponent cards**: Tab to first card, arrow keys to navigate between cards, Enter to select
- **Game over modal**: Focus trapped within modal; Tab cycles through action buttons; Escape dismisses
- **Focus indicator**: 2px `--gold-bright` outline with 2px offset on all interactive elements. Never remove `outline` without providing a visible alternative.

### Screen Reader Support

- **Board state**: Each cell has `aria-label` describing location and occupant: `"Arrakeen - empty"`, `"Carthag - Player X"`, `"The Palace - CPU O"`
- **Turn announcements**: Turn changes use `aria-live="polite"` region: `"Your turn"` / `"Baron Harkonnen is thinking..."`
- **Commentary**: `aria-live="polite"` so new commentary is announced
- **Game result**: `aria-live="assertive"` for win/draw announcement
- **Board region**: `role="group"` with `aria-label="Game board - 3 by 3 grid"`

### Color Independence

- Turn indicator uses text label ("Your turn" / "CPU turn"), not just X/O color
- Winning line uses glow effect + text announcement, not just color change
- Difficulty badges use text labels alongside color coding
- Error states pair `--blood-red` color with an SVG warning icon and descriptive text

## Responsive Considerations

For the PoC, optimize for desktop viewport (1024px+). The board should be comfortably playable but mobile optimization is out of scope (see [Phase 0 - Out of Scope](phase-0.md#out-of-scope-future-phases)).

### Desktop Layout (1024px+)

- **Viewport meta**: `<meta name="viewport" content="width=device-width, initial-scale=1">` (always include, never disable zoom)
- **Content max-width**: 640px centered for the game area
- **Board**: 480px max-width, cells 120px minimum

### Graceful Degradation (768px-1023px)

Even though mobile isn't in scope, avoid breaking on smaller windows:
- Board scales down proportionally (percentage-based width with min-width)
- Opponent cards wrap to stack vertically if space is tight
- No horizontal scrollbar at any viewport width

## Performance

- **No image assets for PoC**: Use CSS for all visual effects (gradients, shadows, glows). SVG only for icons if needed.
- **Font loading**: `font-display: swap` prevents invisible text during web font load. Preload the two font files using `<link rel="preload">`.
- **No layout shift**: Reserve vertical space for the commentary area (min-height) even before content appears, so the page doesn't jump when commentary loads.
- **Transform-only animations**: All animations use `transform` and `opacity` to stay on the compositor thread and avoid layout thrashing.
- **CSS custom properties**: Defined once at `:root`, referenced everywhere. No redundant hex values.

## Pre-Delivery Checklist

Before shipping any screen, verify:

### Visual Quality
- [ ] No emojis used as icons (use SVG or CSS)
- [ ] All colors reference CSS custom properties, no raw hex in components
- [ ] Consistent border-radius (4px buttons, 8px cards, 4px board corners)
- [ ] Spacing follows 4/8px grid system

### Interaction
- [ ] All clickable elements have cursor: pointer
- [ ] All buttons/cells have visible hover state (150ms transition)
- [ ] All buttons/cells have visible focus state (2px gold-bright outline)
- [ ] Board disabled state is clear during CPU turn (opacity + cursor change)
- [ ] Piece placement has feedback animation (200ms scale-in)

### Accessibility
- [ ] Primary text contrast >= 4.5:1 on all backgrounds
- [ ] `--dust` text only used on `--sand-dark`, never on `--sand-medium`
- [ ] All board cells are `<button>` elements with `aria-label`
- [ ] Keyboard navigation works for all flows (title -> select -> game -> game over)
- [ ] `aria-live` regions announce turn changes, commentary, and game results
- [ ] `prefers-reduced-motion` respected (no animations when enabled)
- [ ] Focus visible on all interactive elements (never `outline: none` without replacement)
- [ ] Color is never the only indicator of state

### Loading & Error
- [ ] CPU thinking state shows clear feedback (indicator text + skeleton)
- [ ] LLM errors show toast with cause + retry action
- [ ] Commentary area reserves space (no layout shift on appear)

## Related Documents

- [PRD](prd.md) - Product vision and goals
- [Phase 0](phase-0.md) - Feature scope
- [Tech Stack](tech-stack.md) - Technology choices
- [Game Design](game-design.md) - Board layout and game mechanics

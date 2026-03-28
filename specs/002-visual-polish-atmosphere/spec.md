# Feature Specification: Phase 1 - Visual Polish & Atmosphere

**Feature Branch**: `002-visual-polish-atmosphere`
**Created**: 2026-03-27
**Status**: Draft
**Input**: User description: "Phase 1 - Visual Polish & Atmosphere for Dune Tac Toe. 15 features (F1.1-F1.15) covering background atmosphere, typography, title screen, board depth, themed icons, opponent cards, animations, accessibility, win screen, ambient effects, faction identity, opponent presence, cinematic transitions, match score, and first-move prompt. Frontend-only visual polish phase. No backend or game logic changes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Immersive Desert Atmosphere (Priority: P1)

As a player, I want the game to evoke the cinematic feel of Arrakis through textured backgrounds, upgraded typography, and an enhanced title screen, so that every screen feels like a Dune experience rather than a generic dark UI.

**Why this priority**: The background, typography, and title screen are the first things a player sees and the foundation for all other visual improvements. Without this atmospheric base layer, individual polish features look disconnected.

**Independent Test**: Can be fully tested by loading the app and navigating through all screens (title, opponent select, game, game over) to verify textured backgrounds, new fonts, and title screen enhancements are visible and cohesive.

**Acceptance Scenarios**:

1. **Given** the player opens the app, **When** the title screen loads, **Then** the background displays a warm vertical gradient with a subtle sand-grain noise texture overlay, and the title area has a soft spice-colored radial glow behind it.
2. **Given** the player is on any screen, **When** they look at the background, **Then** it displays the warm gradient with noise texture rather than a flat solid color.
3. **Given** the title screen is displayed, **When** the player reads the title text, **Then** it appears in a decorative serif font with a metallic gold gradient effect and a soft glow.
4. **Given** the title screen is displayed, **When** the player reads the subtitle, **Then** it has sufficient contrast (at least 4.5:1 ratio against the background).
5. **Given** the title screen is displayed, **When** the player looks between the title and buttons, **Then** a thin gold decorative separator line is visible.
6. **Given** any screen is displayed, **When** the player reads headings, **Then** they appear in a classical serif font distinct from both the ornamental title font and the body text font.
7. **Given** the player views the turn indicator or HUD elements, **When** they read the text, **Then** it optionally appears in a futuristic sans-serif font that reinforces the sci-fi aesthetic while remaining readable.

---

### User Story 2 - Faction Identity & Themed Pieces (Priority: P2)

As a player, I want to feel like I represent House Atreides with a distinct visual identity (custom icons, faction colors, dynamic titles), so that the game creates emotional investment beyond abstract X and O markers.

**Why this priority**: Faction identity is the single biggest opportunity for player immersion. Replacing generic markers with themed icons and giving the player a house identity transforms the experience from "tic-tac-toe with a skin" to "commanding House Atreides."

**Independent Test**: Can be fully tested by starting a Human vs CPU game and verifying the player's pieces display as themed icons with Atreides coloring, the turn indicator uses faction-flavored text, the browser tab updates dynamically, and a custom favicon is displayed.

**Acceptance Scenarios**:

1. **Given** a game is in progress, **When** the player places a piece, **Then** a themed Dune-universe icon (representing a crysknife/dagger) appears instead of a plain "X" text marker, colored with the player's faction tint.
2. **Given** a game is in progress, **When** the CPU places a piece, **Then** a themed Dune-universe icon (representing a sandworm) appears instead of a plain "O" text marker, colored in gold.
3. **Given** it is the player's turn, **When** the turn indicator updates, **Then** it displays faction-flavored text (e.g., "House Atreides moves") rather than "Player X's turn."
4. **Given** it is the CPU's turn, **When** the turn indicator updates, **Then** it displays character-specific text (e.g., "Baron Harkonnen schemes...") rather than "Player O's turn."
5. **Given** it is the player's turn, **When** the turn indicator is displayed, **Then** its text is colored with the Atreides faction accent color.
6. **Given** it is the CPU's turn, **When** the turn indicator is displayed, **Then** its text is colored with the CPU opponent's faction accent color.
7. **Given** the player is in a game, **When** they look at the browser tab, **Then** it shows a context-aware title (e.g., "Your Turn -- Dune Tac Toe" or "Baron is thinking...") and a custom Dune-themed favicon.
8. **Given** a game piece icon is placed, **When** a screen reader reads the cell, **Then** the aria-label still announces the piece in accessible terms (e.g., "Player X" / "CPU O") regardless of the visual icon.

---

### User Story 3 - Distinctive Opponent Cards (Priority: P3)

As a player selecting an opponent, I want each character card to have a unique visual identity (faction icon, accent color, distinct hover effect), so I can immediately sense each opponent's personality before reading their description.

**Why this priority**: Opponent selection is the player's first meaningful choice. Visually distinct cards with faction icons make this choice feel impactful and reinforce character personality.

**Independent Test**: Can be fully tested by navigating to the opponent selection screen and verifying each card has a unique faction icon, accent color, hover glow, and that difficulty badges follow standard color conventions (green/gold/red).

**Acceptance Scenarios**:

1. **Given** the opponent selection screen is displayed, **When** the player views the three character cards, **Then** each card has a unique faction icon displayed above the character name.
2. **Given** the opponent selection screen is displayed, **When** the player views the difficulty badges, **Then** Easy shows as green, Medium as gold, and Hard as red, matching universal gaming conventions.
3. **Given** the opponent selection screen is displayed, **When** the player hovers over a card, **Then** the card lifts upward and displays a faction-colored glow effect.
4. **Given** the opponent selection screen is displayed, **When** the player views the cards, **Then** each card has a distinct border color matching its faction identity.
5. **Given** the opponent selection screen is displayed, **When** the player views difficulty indicators on each card, **Then** they are rendered as filled/unfilled shapes (circles or stars) rather than diamond symbols, conveying visual weight more clearly.

---

### User Story 4 - Polished Interactions & Animations (Priority: P4)

As a player, I want smooth, satisfying micro-interactions (button feedback, commentary slide-up, winning line animation, screen transitions, placement glow), so that every action feels tactile and cinematic.

**Why this priority**: Interaction polish amplifies the atmospheric foundation. Without it, the visual upgrades feel static and lifeless.

**Independent Test**: Can be fully tested by playing through a complete game and verifying button press feedback, commentary animation, winning line connector, screen transitions, and piece placement glow are all present and smooth.

**Acceptance Scenarios**:

1. **Given** any button on any screen, **When** the player presses (clicks/taps) it, **Then** the button visually compresses slightly for tactile feedback.
2. **Given** the CPU has made a move, **When** commentary appears below the board, **Then** it slides upward and fades in rather than appearing instantly.
3. **Given** a player wins the game, **When** the winning line is detected, **Then** a gold line animates across the three winning cells from start to end, and remains visible through the game-over overlay.
4. **Given** the player navigates between screens, **When** the transition occurs, **Then** the exiting screen fades out and the entering screen fades in with a slight upward motion.
5. **Given** a piece is placed on the board, **When** the placement animation completes, **Then** a brief spice-colored glow flashes on the piece and fades out.
6. **Given** the user has `prefers-reduced-motion` enabled, **When** any animation would normally play, **Then** the content appears or transitions instantly without animation.

---

### User Story 5 - Tactile Game Board (Priority: P5)

As a player, I want the game board to feel like a carved stone war table with visual depth, glowing grid lines, and responsive cell hover effects, so that the board feels like a physical artifact rather than a flat HTML table.

**Why this priority**: The board is the visual centerpiece of every game. Depth and hover polish directly enhance the core gameplay experience.

**Independent Test**: Can be fully tested by viewing the game board and hovering over cells to verify shadow depth, grid line glow, cell hover lift, location name readability, and custom cursor.

**Acceptance Scenarios**:

1. **Given** the game board is displayed, **When** the player views it, **Then** the board frame has a layered shadow effect that creates the appearance of carved/inset depth.
2. **Given** the game board is displayed, **When** the player views the grid lines, **Then** they have a subtle warm glow rather than plain flat borders.
3. **Given** an empty cell on the board, **When** the player hovers over it, **Then** the cell slightly scales up, and the location name brightens.
4. **Given** an empty cell on the board, **When** the player moves the cursor over it, **Then** the cursor changes to a custom themed cursor (with a standard fallback).
5. **Given** any board cell with a location name, **When** the player reads it, **Then** the text meets WCAG AA contrast requirements (at least 4.5:1 ratio) against the cell background.

---

### User Story 6 - Enhanced Win & Game-Over Experience (Priority: P6)

As a player, I want the game-over screen to celebrate victories with faction-specific titles, a confetti burst on wins, and visible game state through a lighter overlay, so the end of each game feels dramatic and rewarding.

**Why this priority**: The win screen is the emotional payoff. Faction-flavored titles and victory celebration create memorable moments that encourage rematches.

**Independent Test**: Can be fully tested by winning, losing, and drawing a game and verifying faction-specific victory titles, confetti on wins (not draws), lighter overlay showing the board state, and correct button priority.

**Acceptance Scenarios**:

1. **Given** the player wins a game, **When** the game-over overlay appears, **Then** the victory title reads "House Atreides Triumphs!" instead of a generic "Player X Wins!" message.
2. **Given** a CPU opponent wins, **When** the game-over overlay appears, **Then** the victory title uses a character-specific phrase (e.g., "The Baron Prevails!").
3. **Given** the game ends in a draw, **When** the game-over overlay appears, **Then** a thematic draw message is displayed (e.g., "The Desert Claims All") and no confetti fires.
4. **Given** the player wins a game, **When** the victory overlay appears, **Then** a burst of confetti in Dune palette colors fires once.
5. **Given** the game-over overlay is visible, **When** the player looks through it, **Then** the winning line and board state are partially visible through a semi-transparent scrim.
6. **Given** the game-over overlay is visible, **When** the player views the action buttons, **Then** "Rematch" is the primary (filled) button and "Play Again" is the secondary (outlined) button.
7. **Given** the game-over overlay displays a victory title, **When** the player observes the title text, **Then** it displays a pulsing spice-colored glow animation that cycles approximately every 1.5 seconds.
8. **Given** the user has `prefers-reduced-motion` enabled, **When** the game-over overlay displays a victory title, **Then** the glow is static (no pulsing animation).

---

### User Story 7 - Opponent Presence & Match Continuity (Priority: P7)

As a player in a Human vs CPU game, I want to see my opponent's identity on the game screen and a running match score across rematches, so I feel engaged in an ongoing rivalry rather than isolated games.

**Why this priority**: These features add context and replayability but are not essential to the core visual polish experience.

**Independent Test**: Can be fully tested by selecting an opponent, verifying the opponent indicator is visible during gameplay, playing multiple rematches, and checking the score increments correctly.

**Acceptance Scenarios**:

1. **Given** the player has selected an opponent, **When** the game screen loads, **Then** a compact opponent indicator (icon + name + difficulty badge) is displayed near the top of the screen.
2. **Given** it is the CPU's turn, **When** the opponent indicator is visible, **Then** it subtly pulses with the opponent's faction color.
3. **Given** the player has won a game and clicked "Rematch", **When** the new game loads, **Then** a score line displays the running tally (e.g., "House Atreides 1 -- 0 Baron Harkonnen").
4. **Given** the player returns to the title screen or changes opponents, **When** they start a new game, **Then** the match score resets to 0-0.
5. **Given** a game ends in a draw, **When** the score updates, **Then** neither side's score increments.

---

### User Story 8 - Cinematic Transition & First-Move Prompt (Priority: P8)

As a player, I want a brief cinematic interstitial after selecting my opponent and a thematic prompt guiding my first move, so the game builds anticipation and provides atmospheric direction.

**Why this priority**: Cinematic pacing and first-move guidance add immersion but are lower priority than core visual and interaction improvements.

**Independent Test**: Can be fully tested by selecting an opponent and verifying a brief interstitial displays the opponent's name with a faction quote before fading into the game board, and that an empty board shows a first-move prompt that disappears after the first piece is placed.

**Acceptance Scenarios**:

1. **Given** the player selects an opponent, **When** the transition to the game screen begins, **Then** a brief interstitial (1-1.5 seconds) displays the opponent's name in a large decorative font with a faction-flavored one-liner.
2. **Given** the interstitial is displayed, **When** the hold duration elapses, **Then** it fades into the game board.
3. **Given** the user has `prefers-reduced-motion` enabled, **When** they select an opponent, **Then** the interstitial is skipped and the game board loads directly.
4. **Given** a new game starts with an empty board, **When** the player views the screen, **Then** a thematic prompt (e.g., "Claim your first territory") appears below the turn indicator.
5. **Given** the first-move prompt is displayed, **When** the player places their first piece, **Then** the prompt fades out within 300ms.

---

### User Story 9 - Accessibility Compliance (Priority: P9)

As a player using assistive technology or with visual impairments, I want all contrast ratios to meet WCAG AA standards and all debug artifacts removed, so the game is usable and professional.

**Why this priority**: Accessibility fixes are critical for compliance but are tracked separately because they cut across all other stories rather than representing a standalone user journey.

**Independent Test**: Can be fully tested by auditing all text/background color combinations with a contrast checker, verifying no debug tooltips appear, and confirming new fonts render clearly at their designated sizes.

**Acceptance Scenarios**:

1. **Given** any board cell with a location name, **When** the contrast ratio is measured against its background, **Then** it meets at least 4.5:1 (WCAG AA for normal text).
2. **Given** any difficulty badge with text, **When** the contrast ratio is measured, **Then** it meets at least 4.5:1 (WCAG AA for normal text).
3. **Given** the subtitle on the title screen, **When** the contrast ratio is measured, **Then** it meets at least 4.5:1 (WCAG AA for normal text).
4. **Given** any screen in the application, **When** the player interacts with the UI, **Then** no debug tooltips, console artifacts, or development-only visual elements are visible.
5. **Given** SVG game piece icons are displayed, **When** a screen reader encounters them, **Then** they are hidden from the accessibility tree (aria-hidden) and the cell's aria-label provides the equivalent text.

---

### User Story 10 - Optional Ambient Sand Particles (Priority: P10)

As a player, I want subtle drifting sand particles in the background on select screens, so the environment feels alive and windswept like Arrakis.

**Why this priority**: Purely decorative atmospheric enhancement. Implement only if time permits after all higher-priority stories are complete.

**Independent Test**: Can be fully tested by loading the title screen and verifying small particles drift slowly across the background, disappear when `prefers-reduced-motion` is enabled, and do not interfere with interactive elements.

**Acceptance Scenarios**:

1. **Given** the player is on the title screen or game-over screen, **When** they observe the background, **Then** 3-5 small dot-like particles drift slowly across the screen.
2. **Given** the user has `prefers-reduced-motion` enabled, **When** any screen loads, **Then** no ambient particles are rendered.
3. **Given** ambient particles are visible, **When** the player interacts with UI elements, **Then** the particles do not obscure or interfere with any clickable or readable content.

---

### Edge Cases

- What happens when custom fonts fail to load? The system falls back gracefully to system fonts without breaking layout or readability.
- What happens when the browser does not support CSS backdrop effects or modern gradients? The base solid background color (`--sand-dark`) remains visible as a safe fallback.
- What happens when the SVG noise texture fails to render? The warm gradient base still provides atmospheric background without the texture overlay.
- What happens when a player rapidly clicks Rematch multiple times? The match score increments only once per completed game, and the cinematic interstitial does not stack.
- What happens when the game-over overlay appears before the winning line animation completes? The winning line continues to animate and remains visible through the semi-transparent overlay.
- What happens when the custom cursor SVG is not supported by the browser? The standard `crosshair` cursor fallback is displayed.
- What happens when confetti is triggered on a low-performance device? The confetti fires once and does not loop, minimizing performance impact.
- What happens in Human vs Human mode? Universal visual upgrades (backgrounds, board, fonts, animations, themed icons) apply. Faction-specific features (faction turn text, cinematic interstitial, opponent indicator, match score) are skipped; turn indicator uses generic "Player 1's turn" / "Player 2's turn."

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a warm vertical gradient background with an SVG noise texture overlay on all screens.
- **FR-002**: The system MUST use a decorative serif font for the main title (H1), a classical serif font for headings (H2-H3), and retain the existing serif italic for flavor text.
- **FR-003**: The system MUST optionally use a futuristic sans-serif font for HUD/turn indicator elements, falling back to the existing body font if readability is insufficient.
- **FR-004**: The title screen MUST display the game title with a metallic gold gradient text effect and a soft spice-colored glow behind the title area.
- **FR-005**: The title screen MUST include a decorative gold separator between the title area and action buttons.
- **FR-006**: The title screen subtitle MUST meet WCAG AA contrast (4.5:1 minimum) against its background.
- **FR-007**: The game board MUST display layered shadows creating a carved/inset depth effect.
- **FR-008**: Board grid lines MUST have a subtle warm glow effect.
- **FR-009**: Empty board cells MUST scale slightly on hover, brighten the location name, and display a custom themed cursor with a standard fallback.
- **FR-010**: Board cell location names MUST meet WCAG AA contrast (4.5:1 minimum) on their background.
- **FR-011**: The system MUST replace plain X/O text markers with themed SVG icons (crysknife for player, sandworm for CPU).
- **FR-012**: SVG game piece icons MUST use `currentColor` for theming, include `aria-hidden="true"`, and maintain existing cell aria-labels for accessibility.
- **FR-013**: A brief radial ripple animation MUST play when a piece is placed, expanding outward from the piece.
- **FR-014**: The system MUST display an in-app attribution notice for game-icons.net SVG assets (CC BY 3.0 license requirement).
- **FR-015**: Each opponent card MUST display a unique faction icon above the character name, colored with the card's accent color.
- **FR-016**: Each opponent card MUST have a distinct border color matching its faction identity.
- **FR-017**: Difficulty badges MUST use standard gaming color conventions: green for Easy, gold for Medium, red for Hard.
- **FR-017a**: Difficulty level indicators MUST use filled/unfilled shapes (circles or stars) instead of diamond symbols to convey visual weight more clearly.
- **FR-018**: Opponent card hover MUST lift the card upward and display a faction-colored glow.
- **FR-019**: All buttons across the application MUST display a slight scale-down on press/active state for tactile feedback.
- **FR-020**: CPU commentary MUST animate in with a combined upward slide and fade-in effect.
- **FR-021**: When a player wins, a gold animated line MUST draw across the three winning cells and remain visible through the game-over overlay.
- **FR-022**: Screen transitions (title, opponent select, game, game over) MUST use a crossfade with slight vertical motion.
- **FR-023**: Piece placement MUST include a brief spice-colored glow burst that fades out.
- **FR-024**: All animations MUST respect `prefers-reduced-motion` by providing instant transitions or skipping animations entirely.
- **FR-025**: All text/background combinations MUST meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text).
- **FR-026**: All debug artifacts (tooltips, development overlays) MUST be removed.
- **FR-027**: The game-over overlay scrim MUST be semi-transparent enough to keep the winning line and board state visible.
- **FR-028**: Victory titles MUST use faction-specific text (e.g., "House Atreides Triumphs!", "The Baron Prevails!") instead of generic messages.
- **FR-028a**: The victory title text MUST display a pulsing spice-colored glow animation (cycling glow effect on the text, approximately 1.5 second cycle), respecting `prefers-reduced-motion` (static glow when enabled).
- **FR-029**: A confetti burst in Dune palette colors MUST fire once on player win, but NOT on draws.
- **FR-030**: The "Rematch" button MUST be the primary (filled) action on the game-over screen; "Play Again" MUST be secondary (outlined).
- **FR-031**: Draw state MUST display a thematic message and both markers should visually desaturate.
- **FR-032**: In Human vs CPU mode, the turn indicator MUST display faction-flavored text (e.g., "House Atreides moves", "Baron Harkonnen schemes...") colored with the active faction's accent color. In Human vs Human mode, the turn indicator MUST use generic labels ("Player 1's turn" / "Player 2's turn").
- **FR-033**: The player's game piece MUST be tinted with a muted teal (Atreides house color) rather than plain default.
- **FR-034**: The browser MUST display a custom Dune-themed favicon and dynamically update the document title based on game state.
- **FR-035**: During Human vs CPU games only, a compact opponent indicator (faction icon + name + difficulty badge) MUST be visible on the game screen. This feature does not apply to Human vs Human mode.
- **FR-036**: The opponent indicator MUST pulse with the faction color during the CPU's turn.
- **FR-037**: In Human vs CPU mode, after selecting an opponent, a brief cinematic interstitial (1-1.5 seconds) MUST display the opponent's name and a faction-flavored one-liner before transitioning to the game board. This feature does not apply to Human vs Human mode.
- **FR-038**: The cinematic interstitial MUST be skipped when `prefers-reduced-motion` is enabled.
- **FR-039**: In Human vs CPU mode, a running match score MUST be displayed during games, tracking wins across rematches within the same session and opponent. This feature does not apply to Human vs Human mode.
- **FR-040**: The match score MUST reset when the player returns to the title screen or changes opponents.
- **FR-041**: On game start with an empty board, a thematic first-move prompt (e.g., "Claim your first territory") MUST appear and fade out after the first piece is placed.
- **FR-042**: Ambient sand particles (3-5 small dots drifting slowly) MAY be displayed on the title and game-over screens as an optional low-priority enhancement.
- **FR-043**: Ambient particles MUST be hidden when `prefers-reduced-motion` is enabled.
- **FR-044**: All font loading MUST use `font-display: swap` with system font fallbacks to prevent invisible text during load.
- **FR-045**: All background effects (gradients, noise texture) MUST be CSS-only with no external image file requests.
- **FR-046**: No backend or game logic changes are permitted in this phase; all changes are frontend-only.

### Key Entities

- **Match Score**: A session-scoped counter tracking player wins and CPU wins across rematches. Resets on opponent change or return to title. Draws increment neither side.
- **Faction Identity**: A visual theming concept associating the player with House Atreides (teal tint, dagger icon, house name) and each CPU opponent with their faction (icons, colors, flavor text).
- **Cinematic Interstitial**: A brief transitional screen displayed between opponent selection and game start, showing the opponent's name and a faction quote.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of text/background color combinations across all screens meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text) as verified by automated contrast analysis.
- **SC-002**: Zero debug artifacts (tooltips, console overlays, development-only elements) are visible during normal gameplay.
- **SC-003**: All screens (title, opponent select, game, game over) display a textured atmospheric background rather than a flat solid color.
- **SC-004**: All game pieces display as themed SVG icons instead of plain text markers.
- **SC-005**: All three opponent cards are visually distinguishable by icon, border color, and accent without reading text content.
- **SC-006**: All victory messages use faction-specific titles instead of generic "Player X/O Wins" text.
- **SC-007**: Every interactive element (button, cell) provides visible feedback within 200ms of user interaction (hover, press, focus).
- **SC-008**: All animations degrade gracefully to instant transitions when `prefers-reduced-motion` is enabled, with no animations playing.
- **SC-009**: No additional network requests are introduced for background effects (all CSS-only).
- **SC-010**: The browser tab displays a custom favicon and context-aware document title at all game states.
- **SC-011**: Match scores correctly persist across rematches and reset on opponent change or return to title.
- **SC-012**: All SVG icon assets include proper CC BY 3.0 attribution visible in the application.

## Clarifications

### Session 2026-03-27

- Q: How do faction-specific features (faction turn text, cinematic interstitial, opponent indicator, match score) behave in Human vs Human mode? → A: HvH mode receives only universal visual upgrades (backgrounds, board depth, fonts, animations, themed icons). Faction-specific features (faction turn indicator text, cinematic interstitial, opponent indicator, match score) are skipped in HvH mode. Turn indicator uses generic "Player 1's turn" / "Player 2's turn" labels. Both players use themed SVG icons (dagger and sandworm) in their existing colors (player 1 as teal-tinted, player 2 as gold).

## Assumptions

- The existing Phase 0 PoC frontend codebase is stable and functional, providing the base for all visual enhancements.
- All visual changes are additive (no removal of existing functionality or game logic).
- The self-hosted Fontsource approach for web fonts is consistent with the existing Inter Variable font setup already in the project.
- SVG icons from game-icons.net will be downloaded and inlined as components rather than loaded at runtime, consistent with the "no external image requests" constraint.
- The recommended game piece pairing (Plain Dagger for player, Sea Serpent for CPU) and faction card icons (Spider, All-Seeing Eye, Sand Snake) will be used as specified in the feature description.
- The noise texture variant selection (fine, medium, or coarse) will be made during implementation based on visual testing; unused variants will be deleted.
- Session-scoped match scores are stored in application state only (no persistence to local storage or backend), meaning they reset on page refresh.
- Desktop viewport (1024px+) is the primary target; responsive behavior on smaller viewports is out of scope per Phase 0 constraints.
- The `@neoconfetti/react` package (or a pure CSS alternative) will be used for victory confetti, chosen during implementation based on bundle size evaluation.
- The Orbitron font for HUD elements is optional; it will be included only if it maintains readability at the designated sizes.

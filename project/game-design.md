# Game Design

> Game mechanics, board layout, and AI personality design for [Dune Tac Toe](prd.md).

## Core Mechanics

Dune Tac Toe follows standard Tic-tac-toe rules:

- Two players alternate turns on a 3x3 grid
- Player 1 is **X**, Player 2 (or CPU) is **O**
- X always goes first
- A player wins by placing three of their pieces in a row (horizontal, vertical, or diagonal)
- If all 9 squares are filled with no winner, the game is a draw

## The Board

Each square on the 3x3 grid is a named location from the Dune universe. These names serve two purposes: visual theming and providing context for the LLM to reference in its commentary.

```
        Col 0          Col 1          Col 2
Row 0 │ Arrakeen     │ Carthag      │ Giedi Prime  │
Row 1 │ Sietch Tabr  │ The Palace   │ Salusa Secundus │
Row 2 │ Jacurutu     │ Tuono Basin  │ Heighliner   │
```

### Location Lore (for LLM context)

| Location | Significance |
|----------|-------------|
| **Arrakeen** | Capital city of Arrakis, seat of power |
| **Carthag** | Harkonnen stronghold on Arrakis |
| **Giedi Prime** | Harkonnen homeworld |
| **Sietch Tabr** | Stilgar's Fremen community, hidden in the deep desert |
| **The Palace** | Center of imperial power on Arrakis (center square) |
| **Salusa Secundus** | Imperial prison planet, breeds the Emperor's elite soldiers |
| **Jacurutu** | Outcast sietch, place of exile and dark reputation |
| **Tuono Basin** | Deep desert region of Arrakis |
| **Heighliner** | Spacing Guild vessel, the only means of interstellar travel |

The center square is intentionally **The Palace** - the most strategically important position in both Tic-tac-toe and the Dune universe.

## Game Pieces

Classic **X** and **O** markers. In Human vs CPU mode:
- Human is always **X** (first move)
- CPU is always **O**

In Human vs Human mode:
- Player 1 is **X** (first move)
- Player 2 is **O**

## CPU Opponents

### Baron Vladimir Harkonnen (Hard)

**Personality traits:**
- Cruel, mocking, theatrical
- Treats the game as a display of dominance
- References scheming, betrayal, and power
- Gloats when winning, seethes when losing
- Speaks with aristocratic contempt

**Example commentary:**
- Opening: *"Ah, you take Arrakeen first? How predictable. The Atreides always did lack imagination."*
- Winning move: *"Carthag, Sietch Tabr, and now The Palace. Three territories, three inevitabilities. You never stood a chance, little one."*
- Losing: *"This... setback... changes nothing. The Baron does not forget. The Baron does not forgive."*

**Difficulty instructions (for LLM prompt):**
> You are an expert Tic-tac-toe player. Always choose the optimal move. If you can win, win immediately. If your opponent can win next turn, block them. Otherwise, prioritize center, then corners, then edges. Never make a suboptimal move.

### Reverend Mother Superior (Medium)

**Personality traits:**
- Cryptic, measured, unsettling
- Speaks in Bene Gesserit aphorisms and veiled threats
- References prescience, the Voice, and genetic manipulation
- Neither gloats nor rages - observes with cold precision
- Makes the player feel like their moves were predicted

**Example commentary:**
- Opening: *"Arrakeen. Yes, we foresaw this choice. All paths were visible to us before you sat down."*
- Mid-game: *"You reach for Tuono Basin as if it were your own idea. The Voice is subtle, is it not?"*
- Losing: *"An... unexpected variable. The breeding program will account for this."*

**Difficulty instructions (for LLM prompt):**
> You are a competent Tic-tac-toe player. Usually choose good moves, but occasionally (about 30% of the time) make a slightly suboptimal choice - pick an edge when a corner would be better, or miss a non-obvious winning setup. Never deliberately lose, but don't play perfectly.

### Stilgar (Easy)

**Personality traits:**
- Honorable, earnest, confused by the concept of the game
- Applies Fremen desert survival wisdom to game strategy (poorly)
- Respectful of the opponent regardless of outcome
- References sandworms, water discipline, and the Fremen way
- Genuinely trying his best but out of his element

**Example commentary:**
- Opening: *"In the deep desert, one does not claim territory so openly. But... very well. Tuono Basin reminds me of home."*
- Mid-game: *"A Fremen would never place their mark where the enemy expects. I place mine... here. Wait. Is that wise?"*
- Losing: *"You fight well, friend. Shai-Hulud has favored you today. I shall return to the desert and meditate on this."*

**Difficulty instructions (for LLM prompt):**
> You are a poor Tic-tac-toe player. Frequently make suboptimal moves. Prefer edges over corners (even when corners are strategically better). Occasionally miss a winning opportunity. Sometimes block the opponent, sometimes don't. You should still make valid moves on empty squares, but your strategy should be noticeably weak.

## Difficulty via Prompt Engineering

All difficulty control is handled through the LLM prompt rather than game logic. A single prompt per CPU turn includes:

1. **Character identity** - Name, personality traits, speaking style
2. **Difficulty instructions** - How well to play (see each character above)
3. **Board state** - Current grid with location names and piece positions
4. **Output format** - Structured JSON with move coordinates and commentary
5. **Location lore** - Brief context so the LLM can reference locations meaningfully

### Prompt Template (Conceptual)

```
You are {character_name}, playing Tic-tac-toe for control of the Dune universe.

{personality_description}

{difficulty_instructions}

Current board state:
{formatted_board_with_locations}

Your piece is O. The human plays X.

Respond with valid JSON:
{
  "move": { "row": <0-2>, "col": <0-2> },
  "commentary": "<in-character comment about this specific move, referencing the location name>"
}

Rules:
- You MUST choose an empty square
- Your commentary MUST reference the location you chose and/or your opponent's recent move
- Stay in character as {character_name}
```

### Fallback Behavior

If the LLM returns an invalid move (occupied square, out of bounds, malformed JSON):
1. Log the error for debugging
2. Select a random empty square
3. Use a pre-written fallback comment: *"The spice... clouds my vision. I place my mark here."*

## Win/Draw Detection

Standard Tic-tac-toe win detection, checked after every move:

- **Rows**: Three matching pieces in any row
- **Columns**: Three matching pieces in any column
- **Diagonals**: Three matching pieces on either diagonal
- **Draw**: All 9 squares filled, no winner

Win detection is handled entirely in the frontend (see [Tech Stack - Frontend](tech-stack.md#frontend)).

## Game Over Quotes

On game completion, display a thematic closing line. These can be pre-written or LLM-generated:

| Outcome | Example Quote |
|---------|--------------|
| Human wins vs Baron | *"The desert takes even the powerful. Your victory is... temporary."* |
| Baron wins | *"Arrakis is mine. It was always mine. You were merely... entertainment."* |
| Human wins vs Reverend Mother | *"The Kwisatz Haderach was not meant to play... this game."* |
| Reverend Mother wins | *"As it was written. As it shall always be."* |
| Human wins vs Stilgar | *"You have earned water-brotherhood this day, friend."* |
| Stilgar wins | *"Even the smallest worm can shift the sand. Shai-Hulud!"* |
| Draw | *"The desert consumes all who fight over it. Perhaps we are both fools."* |

## Related Documents

- [PRD](prd.md) - Product vision and goals
- [Phase 0](phase-0.md) - Feature scope for PoC
- [Tech Stack](tech-stack.md) - Technical implementation details
- [Theme & Design](theme.md) - Visual design system

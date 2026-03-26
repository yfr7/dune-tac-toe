# Dune Tac Toe - Product Requirements Document

## Vision

Dune Tac Toe is a proof-of-concept game that brings the political intrigue and larger-than-life personalities of Frank Herbert's Dune universe into a classic Tic-tac-toe experience. Players battle for control of iconic locations across Arrakis and beyond, facing off against LLM-powered opponents who trash-talk in character as members of the great houses.

The game explores the intersection of traditional game mechanics with generative AI, using an LLM not just to determine CPU moves but to deliver an immersive, personality-driven experience where every move comes with sassy, in-character commentary.

## Goals

1. **Demonstrate LLM-powered gameplay** - Prove that an LLM can serve as both a game engine (selecting moves at varying difficulty levels) and a narrative engine (generating in-character dialogue) in a single call.
2. **Deliver an entertaining experience** - The Dune theming and character personalities should make a simple game genuinely fun and replayable.
3. **Establish a clean architecture** - Build a decoupled frontend/backend that could serve as a foundation for more complex LLM-powered games.
4. **Keep scope tight** - This is a PoC. Ship a playable, polished vertical slice rather than a sprawling feature set.

## Game Modes

| Mode | Description |
|------|-------------|
| Human vs Human | Two players share a screen, taking turns placing pieces on the board |
| Human vs CPU | A single player faces an LLM-powered opponent with selectable personality and difficulty |

## CPU Opponents

Three opponents are available in Human vs CPU mode, each mapping a Dune character to a difficulty level:

| Character | Difficulty | Personality |
|-----------|-----------|-------------|
| Baron Vladimir Harkonnen | Hard | Cruel, scheming, mocking. Plays to win and revels in your mistakes. |
| Reverend Mother Superior | Medium | Calculating, cryptic, manipulative. Uses Bene Gesserit rhetoric to unsettle. |
| Stilgar | Easy | Honorable but out of his element. Misapplies desert wisdom to the game board. |

See [Game Design](game-design.md) for board layout, pieces, and detailed game mechanics.

## User Flow

```
Title Screen
  "The Spice Must Flow... But First, Tic-Tac-Toe"
       |
  Mode Select
  [ Human vs Human ]  [ Human vs CPU ]
       |                      |
       |               Pick Opponent
       |          [ Baron | Reverend Mother | Stilgar ]
       |                      |
       +----------+-----------+
                  |
            Game Board
       (Dune-themed 3x3 grid)
                  |
            Game Over
    (Winner/draw with dramatic quote)
```

## Success Criteria

- A player can complete a full game in both modes without errors
- CPU opponents play at noticeably different difficulty levels
- Each CPU move is accompanied by an in-character comment that references the game state
- The UI evokes the Dune cinematic aesthetic
- Average LLM response time per move is under 3 seconds

## Related Documents

- [Phase 0 - Features](phase-0.md) - Detailed feature breakdown for the PoC
- [Tech Stack](tech-stack.md) - Technology choices and architecture
- [Theme & Design](theme.md) - Visual design system and Dune theming
- [Game Design](game-design.md) - Board layout, pieces, mechanics, and AI personality details

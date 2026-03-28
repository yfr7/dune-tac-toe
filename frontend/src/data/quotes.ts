import type { CharacterId } from '../types';

/**
 * Pre-written game over quotes by outcome and opponent.
 * See game-design.md for example quotes and spec.md FR-029 for requirements.
 */

export type GameOutcome = 'human_wins' | 'cpu_wins' | 'draw';

export interface QuoteEntry {
  text: string;
}

/** Quotes for Human vs CPU games, keyed by opponent and outcome. */
const CPU_QUOTES: Record<CharacterId, Record<GameOutcome, QuoteEntry>> = {
  baron_harkonnen: {
    human_wins: {
      text: 'The desert takes even the powerful. Your victory is... temporary.',
    },
    cpu_wins: {
      text: 'Arrakis is mine. It was always mine. You were merely... entertainment.',
    },
    draw: {
      text: 'A stalemate? How tedious. The Baron does not share power — we shall settle this again.',
    },
  },
  reverend_mother: {
    human_wins: {
      text: 'The Kwisatz Haderach was not meant to play... this game.',
    },
    cpu_wins: {
      text: 'As it was written. As it shall always be.',
    },
    draw: {
      text: 'The threads of fate are tangled. Neither victory nor defeat — only the pattern remains.',
    },
  },
  stilgar: {
    human_wins: {
      text: 'You have earned water-brotherhood this day, friend.',
    },
    cpu_wins: {
      text: 'Even the smallest worm can shift the sand. Shai-Hulud!',
    },
    draw: {
      text: 'Neither Fremen nor offworlder claims victory today. The sands remain unchanged.',
    },
  },
};

/** Quotes for Human vs Human games, keyed by outcome. */
const HVH_QUOTES: Record<'x_wins' | 'o_wins' | 'draw', QuoteEntry> = {
  x_wins: {
    text: 'The first to strike claims the throne. Arrakis remembers the bold.',
  },
  o_wins: {
    text: 'Patience conquers all. The second wave takes what the storm leaves behind.',
  },
  draw: {
    text: 'The desert consumes all who fight over it. Perhaps we are both fools.',
  },
};

/** Fallback commentary when the backend returns an invalid or empty response. */
export const FALLBACK_COMMENTARY = 'The spice... clouds my vision. I place my mark here.';

/**
 * Get a game over quote for a Human vs CPU game.
 */
export function getCpuGameQuote(characterId: CharacterId, outcome: GameOutcome): string {
  return CPU_QUOTES[characterId][outcome].text;
}

/**
 * Get a game over quote for a Human vs Human game.
 */
export function getHvhGameQuote(winner: 'X' | 'O' | null): string {
  if (winner === 'X') return HVH_QUOTES.x_wins.text;
  if (winner === 'O') return HVH_QUOTES.o_wins.text;
  return HVH_QUOTES.draw.text;
}

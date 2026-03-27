import type { Character } from '../types';

/**
 * CPU opponent definitions matching the backend's three characters.
 * See game-design.md for full personality details and difficulty instructions.
 */
export const CHARACTERS: readonly Character[] = [
  {
    id: 'baron_harkonnen',
    name: 'Baron Harkonnen',
    difficulty: 'hard',
    difficultyRank: 3,
    description:
      'Cruel and theatrical. Treats the game as a display of dominance, mocking every move you make.',
  },
  {
    id: 'reverend_mother',
    name: 'Reverend Mother',
    difficulty: 'medium',
    difficultyRank: 2,
    description:
      'Cryptic and unsettling. Speaks in Bene Gesserit riddles and makes you feel your moves were predicted.',
  },
  {
    id: 'stilgar',
    name: 'Stilgar',
    difficulty: 'easy',
    difficultyRank: 1,
    description:
      'Earnest and confused. Applies Fremen desert wisdom to game strategy — poorly.',
  },
] as const;

/** Look up a character by ID. */
export function getCharacter(id: string): Character | undefined {
  return CHARACTERS.find((c) => c.id === id);
}

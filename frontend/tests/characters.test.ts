import { describe, it, expect } from 'vitest';
import { CHARACTERS, getCharacter } from '../src/data/characters';
import type { CharacterId } from '../src/types';

describe('Character data', () => {
  it('defines exactly 3 opponents', () => {
    expect(CHARACTERS).toHaveLength(3);
  });

  it('has unique IDs for each character', () => {
    const ids = CHARACTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(3);
  });

  it('defines Baron Harkonnen as hard with rank 3', () => {
    const baron = CHARACTERS.find((c) => c.id === 'baron_harkonnen');
    expect(baron).toBeDefined();
    expect(baron!.name).toBe('Baron Harkonnen');
    expect(baron!.difficulty).toBe('hard');
    expect(baron!.difficultyRank).toBe(3);
  });

  it('defines Reverend Mother as medium with rank 2', () => {
    const rm = CHARACTERS.find((c) => c.id === 'reverend_mother');
    expect(rm).toBeDefined();
    expect(rm!.name).toBe('Reverend Mother');
    expect(rm!.difficulty).toBe('medium');
    expect(rm!.difficultyRank).toBe(2);
  });

  it('defines Stilgar as easy with rank 1', () => {
    const stilgar = CHARACTERS.find((c) => c.id === 'stilgar');
    expect(stilgar).toBeDefined();
    expect(stilgar!.name).toBe('Stilgar');
    expect(stilgar!.difficulty).toBe('easy');
    expect(stilgar!.difficultyRank).toBe(1);
  });

  it('each character has a non-empty description', () => {
    for (const character of CHARACTERS) {
      expect(character.description.length).toBeGreaterThan(0);
    }
  });

  it('getCharacter returns the correct character by ID', () => {
    const baron = getCharacter('baron_harkonnen');
    expect(baron?.name).toBe('Baron Harkonnen');
  });

  it('getCharacter returns undefined for unknown ID', () => {
    expect(getCharacter('unknown' as CharacterId)).toBeUndefined();
  });

  it('difficultyRank values are 1, 2, 3 (one per difficulty)', () => {
    const ranks = CHARACTERS.map((c) => c.difficultyRank).sort();
    expect(ranks).toEqual([1, 2, 3]);
  });
});

import { describe, expect, it } from 'vitest';
import { getTitle } from '../src/hooks/use-document-title';
import type { UseDocumentTitleOptions } from '../src/hooks/use-document-title';

const base: UseDocumentTitleOptions = {
  screen: 'title',
  gameStatus: 'idle',
  currentTurn: 'X',
  winner: null,
  isHvCpu: false,
  cpuThinking: false,
  characterName: null,
};

describe('getTitle', () => {
  it('returns "Dune Tac Toe" on title screen', () => {
    expect(getTitle({ ...base, screen: 'title' })).toBe('Dune Tac Toe');
  });

  it('returns opponent select title', () => {
    expect(getTitle({ ...base, screen: 'opponent-select' })).toBe(
      'Choose Your Opponent \u2014 Dune Tac Toe',
    );
  });

  it('returns "Your Turn" in HvCPU game when player turn', () => {
    expect(
      getTitle({
        ...base,
        screen: 'game',
        gameStatus: 'playing',
        isHvCpu: true,
        currentTurn: 'X',
      }),
    ).toBe('Your Turn \u2014 Dune Tac Toe');
  });

  it('returns "{Character} is thinking..." when CPU is thinking', () => {
    expect(
      getTitle({
        ...base,
        screen: 'game',
        gameStatus: 'playing',
        isHvCpu: true,
        cpuThinking: true,
        currentTurn: 'O',
        characterName: 'Baron Harkonnen',
      }),
    ).toBe('Baron Harkonnen is thinking... \u2014 Dune Tac Toe');
  });

  it('returns "Player X\'s Turn" in HvH game', () => {
    expect(
      getTitle({
        ...base,
        screen: 'game',
        gameStatus: 'playing',
        isHvCpu: false,
        currentTurn: 'X',
      }),
    ).toBe("Player X's Turn \u2014 Dune Tac Toe");
  });

  it('returns "Victory!" when player wins in HvCPU', () => {
    expect(
      getTitle({
        ...base,
        screen: 'game-over',
        gameStatus: 'won',
        isHvCpu: true,
        winner: 'X',
      }),
    ).toBe('Victory! \u2014 Dune Tac Toe');
  });

  it('returns "Defeat" when CPU wins in HvCPU', () => {
    expect(
      getTitle({
        ...base,
        screen: 'game-over',
        gameStatus: 'won',
        isHvCpu: true,
        winner: 'O',
      }),
    ).toBe('Defeat \u2014 Dune Tac Toe');
  });

  it('returns "Draw" on draw', () => {
    expect(
      getTitle({
        ...base,
        screen: 'game-over',
        gameStatus: 'draw',
      }),
    ).toBe('Draw \u2014 Dune Tac Toe');
  });

  it('returns "Player X Wins!" in HvH game over', () => {
    expect(
      getTitle({
        ...base,
        screen: 'game-over',
        gameStatus: 'won',
        isHvCpu: false,
        winner: 'X',
      }),
    ).toBe('Player X Wins! \u2014 Dune Tac Toe');
  });
});

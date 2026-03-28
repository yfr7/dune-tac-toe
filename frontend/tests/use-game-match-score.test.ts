import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useGame } from '../src/hooks/use-game';

describe('useGame matchScore (T025)', () => {
  it('initializes matchScore to {0, 0}', () => {
    const { result } = renderHook(() => useGame());
    expect(result.current.matchScore).toEqual({ playerWins: 0, cpuWins: 0 });
  });

  it('resets matchScore to {0, 0} on startGame', () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.startGame('human-vs-cpu', 'baron_harkonnen'));
    expect(result.current.matchScore).toEqual({ playerWins: 0, cpuWins: 0 });
  });

  it('increments playerWins when X wins in HvCPU mode', () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.startGame('human-vs-cpu', 'baron_harkonnen'));

    // X wins top row: X(0,0), CPU O(1,0), X(0,1), CPU O(1,1), X(0,2)
    act(() => result.current.placeMove(0, 0)); // X
    act(() => result.current.placeCpuMove(1, 0)); // O
    act(() => result.current.placeMove(0, 1)); // X
    act(() => result.current.placeCpuMove(1, 1)); // O
    act(() => result.current.placeMove(0, 2)); // X wins

    expect(result.current.gameStatus).toBe('won');
    expect(result.current.winner).toBe('X');
    expect(result.current.matchScore).toEqual({ playerWins: 1, cpuWins: 0 });
  });

  it('increments cpuWins when O wins via placeCpuMove in HvCPU mode', () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.startGame('human-vs-cpu', 'baron_harkonnen'));

    // O wins middle row: X(0,0), O(1,0), X(0,1), O(1,1), X(2,2), O(1,2)
    act(() => result.current.placeMove(0, 0)); // X
    act(() => result.current.placeCpuMove(1, 0)); // O
    act(() => result.current.placeMove(0, 1)); // X
    act(() => result.current.placeCpuMove(1, 1)); // O
    act(() => result.current.placeMove(2, 2)); // X
    act(() => result.current.placeCpuMove(1, 2)); // O wins

    expect(result.current.gameStatus).toBe('won');
    expect(result.current.winner).toBe('O');
    expect(result.current.matchScore).toEqual({ playerWins: 0, cpuWins: 1 });
  });

  it('does not increment score on draw', () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.startGame('human-vs-cpu', 'baron_harkonnen'));

    // Play to a draw
    act(() => result.current.placeMove(0, 0)); // X
    act(() => result.current.placeCpuMove(0, 1)); // O
    act(() => result.current.placeMove(0, 2)); // X
    act(() => result.current.placeCpuMove(1, 2)); // O
    act(() => result.current.placeMove(1, 0)); // X
    act(() => result.current.placeCpuMove(2, 0)); // O
    act(() => result.current.placeMove(1, 1)); // X
    act(() => result.current.placeCpuMove(2, 2)); // O
    act(() => result.current.placeMove(2, 1)); // X — draw

    expect(result.current.gameStatus).toBe('draw');
    expect(result.current.matchScore).toEqual({ playerWins: 0, cpuWins: 0 });
  });

  it('preserves matchScore across rematches', () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.startGame('human-vs-cpu', 'baron_harkonnen'));

    // X wins
    act(() => result.current.placeMove(0, 0));
    act(() => result.current.placeCpuMove(1, 0));
    act(() => result.current.placeMove(0, 1));
    act(() => result.current.placeCpuMove(1, 1));
    act(() => result.current.placeMove(0, 2));

    expect(result.current.matchScore).toEqual({ playerWins: 1, cpuWins: 0 });

    // Rematch — score should persist
    act(() => result.current.rematch());
    expect(result.current.matchScore).toEqual({ playerWins: 1, cpuWins: 0 });
    expect(result.current.gameStatus).toBe('playing');

    // X wins again
    act(() => result.current.placeMove(0, 0));
    act(() => result.current.placeCpuMove(1, 0));
    act(() => result.current.placeMove(0, 1));
    act(() => result.current.placeCpuMove(1, 1));
    act(() => result.current.placeMove(0, 2));

    expect(result.current.matchScore).toEqual({ playerWins: 2, cpuWins: 0 });
  });

  it('resets matchScore on resetGame (return to title)', () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.startGame('human-vs-cpu', 'baron_harkonnen'));

    // X wins
    act(() => result.current.placeMove(0, 0));
    act(() => result.current.placeCpuMove(1, 0));
    act(() => result.current.placeMove(0, 1));
    act(() => result.current.placeCpuMove(1, 1));
    act(() => result.current.placeMove(0, 2));

    expect(result.current.matchScore).toEqual({ playerWins: 1, cpuWins: 0 });

    act(() => result.current.resetGame());
    expect(result.current.matchScore).toEqual({ playerWins: 0, cpuWins: 0 });
  });

  it('resets matchScore on opponent change (new startGame)', () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.startGame('human-vs-cpu', 'baron_harkonnen'));

    // X wins
    act(() => result.current.placeMove(0, 0));
    act(() => result.current.placeCpuMove(1, 0));
    act(() => result.current.placeMove(0, 1));
    act(() => result.current.placeCpuMove(1, 1));
    act(() => result.current.placeMove(0, 2));

    expect(result.current.matchScore).toEqual({ playerWins: 1, cpuWins: 0 });

    // Start new game with different opponent
    act(() => result.current.startGame('human-vs-cpu', 'stilgar'));
    expect(result.current.matchScore).toEqual({ playerWins: 0, cpuWins: 0 });
  });

  it('does not increment score in HvH mode', () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.startGame('human-vs-human'));

    // X wins top row
    act(() => result.current.placeMove(0, 0));
    act(() => result.current.placeMove(1, 0));
    act(() => result.current.placeMove(0, 1));
    act(() => result.current.placeMove(1, 1));
    act(() => result.current.placeMove(0, 2));

    expect(result.current.gameStatus).toBe('won');
    expect(result.current.matchScore).toEqual({ playerWins: 0, cpuWins: 0 });
  });
});

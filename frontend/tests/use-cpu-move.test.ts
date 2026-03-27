import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCpuMove } from '../src/hooks/use-cpu-move';
import type { Board } from '../src/types';

const emptyBoard: Board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const boardWithMove: Board = [
  ['X', null, null],
  [null, null, null],
  [null, null, null],
];

const mockResponse = {
  move: { row: 1, col: 1 },
  commentary: 'The Palace is mine now.',
};

describe('useCpuMove', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with idle state', () => {
    const { result } = renderHook(() => useCpuMove());
    expect(result.current.move).toBeNull();
    expect(result.current.commentary).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets isLoading to true while request is in flight', async () => {
    let resolveResponse: (value: Response) => void;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });
    vi.mocked(fetch).mockReturnValue(fetchPromise as Promise<Response>);

    const { result } = renderHook(() => useCpuMove());

    let movePromise: Promise<unknown>;
    act(() => {
      movePromise = result.current.requestMove(boardWithMove, 'baron_harkonnen');
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveResponse!(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      await movePromise!;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('returns move and commentary on success', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { result } = renderHook(() => useCpuMove());

    await act(async () => {
      const data = await result.current.requestMove(
        boardWithMove,
        'baron_harkonnen',
      );
      expect(data).toEqual(mockResponse);
    });

    expect(result.current.move).toEqual({ row: 1, col: 1 });
    expect(result.current.commentary).toBe('The Palace is mine now.');
    expect(result.current.error).toBeNull();
  });

  it('sends correct request body', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const { result } = renderHook(() => useCpuMove());

    await act(async () => {
      await result.current.requestMove(boardWithMove, 'stilgar');
    });

    expect(fetch).toHaveBeenCalledWith('/api/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board: boardWithMove,
        character: 'stilgar',
        player_piece: 'X',
        cpu_piece: 'O',
      }),
    });
  });

  it('sets error on network failure', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useCpuMove());

    await act(async () => {
      const data = await result.current.requestMove(
        boardWithMove,
        'baron_harkonnen',
      );
      expect(data).toBeNull();
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.move).toBeNull();
  });

  it('sets error on non-200 response', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      }),
    );

    const { result } = renderHook(() => useCpuMove());

    await act(async () => {
      await result.current.requestMove(boardWithMove, 'reverend_mother');
    });

    expect(result.current.error).toBe(
      'Backend error: 500 Internal Server Error',
    );
    expect(result.current.move).toBeNull();
  });

  it('retry re-sends the last request', async () => {
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

    const { result } = renderHook(() => useCpuMove());

    // First call fails
    await act(async () => {
      await result.current.requestMove(boardWithMove, 'baron_harkonnen');
    });
    expect(result.current.error).toBe('Network error');

    // Retry succeeds
    await act(async () => {
      result.current.retry();
    });

    // Wait for the retry to complete
    await act(async () => {
      await vi.waitFor(() => {
        expect(result.current.move).toEqual({ row: 1, col: 1 });
      });
    });

    expect(result.current.error).toBeNull();
    expect(result.current.commentary).toBe('The Palace is mine now.');
  });
});

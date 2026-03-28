import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';

describe('App - Cinematic Interstitial Flow (T027)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ move: { row: 1, col: 1 }, commentary: 'Interesting.' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );
    // Motion allowed by default
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  async function goToOpponentSelect(user: ReturnType<typeof userEvent.setup>) {
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs cpu/i }));
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /choose your opponent/i }),
      ).toBeInTheDocument();
    });
  }

  it('shows interstitial after selecting opponent (before game starts)', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await goToOpponentSelect(user);

    await user.click(screen.getByText('Baron Harkonnen'));

    // Interstitial should be visible
    await waitFor(() => {
      expect(screen.getByRole('status', { name: /facing baron harkonnen/i })).toBeInTheDocument();
    });

    // Game board should NOT be visible yet
    expect(screen.queryByRole('group', { name: /game board/i })).not.toBeInTheDocument();
  });

  it('transitions to game after interstitial completes', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await goToOpponentSelect(user);

    await user.click(screen.getByText('Baron Harkonnen'));

    // Wait for interstitial
    await waitFor(() => {
      expect(screen.getByRole('status', { name: /facing baron harkonnen/i })).toBeInTheDocument();
    });

    // Advance past full animation (200 + 1000 + 200 = 1400ms)
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Game board should appear
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });

    // Interstitial should be gone
    expect(screen.queryByRole('status', { name: /facing/i })).not.toBeInTheDocument();
  });

  it('skips interstitial for HvH mode', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.click(screen.getByRole('button', { name: /human vs human/i }));

    // Should go directly to game
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });

    // No interstitial should appear
    expect(screen.queryByRole('status', { name: /facing/i })).not.toBeInTheDocument();
  });

  it('skips interstitial when prefers-reduced-motion is enabled', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await goToOpponentSelect(user);

    await user.click(screen.getByText('Baron Harkonnen'));

    // Should skip straight to game (onComplete fires immediately)
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });
  });

  it('shows correct faction data in interstitial for different characters', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await goToOpponentSelect(user);

    await user.click(screen.getByText('Stilgar'));

    await waitFor(() => {
      expect(screen.getByRole('status', { name: /facing stilgar/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/The desert tests all who enter/)).toBeInTheDocument();
  });
});

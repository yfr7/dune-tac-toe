import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';

describe('App game HUD wiring (T026)', () => {
  const mockCpuResponse = {
    move: { row: 1, col: 1 },
    commentary: 'The Palace is mine now.',
  };

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockCpuResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function startCpuGame(user: ReturnType<typeof userEvent.setup>) {
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs cpu/i }));
    await user.click(screen.getByText('Baron Harkonnen'));
  }

  it('shows opponent indicator in HvCPU game', async () => {
    const user = userEvent.setup();
    await startCpuGame(user);
    expect(screen.getByLabelText(/Opponent: Baron Harkonnen, Hard/)).toBeInTheDocument();
  });

  it('does not show opponent indicator in HvH game', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));
    expect(screen.queryByLabelText(/Opponent:/)).not.toBeInTheDocument();
  });

  it('shows match score in HvCPU game', async () => {
    const user = userEvent.setup();
    await startCpuGame(user);
    expect(screen.getByLabelText(/Score: House Atreides 0, Baron Harkonnen 0/)).toBeInTheDocument();
  });

  it('does not show match score in HvH game', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));
    expect(screen.queryByLabelText(/Score:/)).not.toBeInTheDocument();
  });

  it('opponent indicator pulses during CPU turn', async () => {
    let resolveResponse: (value: Response) => void;
    vi.mocked(fetch).mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveResponse = resolve;
      }) as Promise<Response>,
    );

    const user = userEvent.setup();
    await startCpuGame(user);

    // Human plays — triggers CPU turn
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));

    // Opponent indicator should be pulsing during CPU turn
    const indicator = screen.getByLabelText(/Opponent: Baron Harkonnen/);
    expect(indicator.style.animation).toBe('var(--animate-opponent-pulse)');

    // Resolve the CPU response
    await vi.waitFor(() => {
      resolveResponse!(
        new Response(JSON.stringify(mockCpuResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });

    // After CPU move, should stop pulsing (it's player's turn)
    await waitFor(() => {
      const ind = screen.getByLabelText(/Opponent: Baron Harkonnen/);
      expect(ind.style.animation).toBe('');
    });
  });

  it('match score increments after player win and persists on rematch', async () => {
    const user = userEvent.setup();
    await startCpuGame(user);

    // Play a game where X wins top row
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /the palace - o/i })).toBeInTheDocument();
    });

    // Mock next CPU move at (2,0)
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ move: { row: 2, col: 0 }, commentary: 'Hmm.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await user.click(screen.getByRole('button', { name: /carthag - empty/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /jacurutu - o/i })).toBeInTheDocument();
    });

    // Mock won't be needed — X wins on next move
    await user.click(screen.getByRole('button', { name: /giedi prime - empty/i }));

    // Game over — score should be 1-0
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /game over/i })).toBeInTheDocument();
    });
  });
});

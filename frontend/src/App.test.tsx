import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, vi } from 'vitest';
import App from './App';

describe('App screen routing', () => {
  it('renders title screen by default', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /dune tac toe/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /human vs human/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /human vs cpu/i })).toBeInTheDocument();
  });

  it('navigates to game screen when HvH mode is selected', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));
    // Game board should appear (wait for screen transition)
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });
    // Turn indicator should show
    expect(screen.getByText("Player 1's turn")).toBeInTheDocument();
    // Title screen should be gone
    expect(screen.queryByRole('heading', { name: /dune tac toe/i })).not.toBeInTheDocument();
  });

  it('shows game over overlay when game ends in a win', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });

    // Play a quick game: X wins with top row (0,0), (0,1), (0,2)
    // X plays (0,0)
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));
    // O plays (1,0)
    await user.click(screen.getByRole('button', { name: /sietch tabr - empty/i }));
    // X plays (0,1)
    await user.click(screen.getByRole('button', { name: /carthag - empty/i }));
    // O plays (1,1)
    await user.click(screen.getByRole('button', { name: /the palace - empty/i }));
    // X plays (0,2) — wins!
    await user.click(screen.getByRole('button', { name: /giedi prime - empty/i }));

    // Game over overlay should appear
    expect(screen.getByRole('dialog', { name: /game over/i })).toBeInTheDocument();
    expect(screen.getByText('Player X Wins!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rematch/i })).toBeInTheDocument();
  });

  it('returns to title screen when Play Again is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });

    // X wins top row
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));
    await user.click(screen.getByRole('button', { name: /sietch tabr - empty/i }));
    await user.click(screen.getByRole('button', { name: /carthag - empty/i }));
    await user.click(screen.getByRole('button', { name: /the palace - empty/i }));
    await user.click(screen.getByRole('button', { name: /giedi prime - empty/i }));

    // Click Play Again
    await user.click(screen.getByRole('button', { name: /play again/i }));

    // Should be back on title screen (wait for screen transition)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dune tac toe/i })).toBeInTheDocument();
    });
  });

  it('starts a new game when Rematch is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });

    // X wins top row
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));
    await user.click(screen.getByRole('button', { name: /sietch tabr - empty/i }));
    await user.click(screen.getByRole('button', { name: /carthag - empty/i }));
    await user.click(screen.getByRole('button', { name: /the palace - empty/i }));
    await user.click(screen.getByRole('button', { name: /giedi prime - empty/i }));

    // Click Rematch
    await user.click(screen.getByRole('button', { name: /rematch/i }));

    // Should be back on game screen with empty board
    expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    expect(screen.getByText("Player 1's turn")).toBeInTheDocument();
    // All cells should be empty
    expect(screen.getByRole('button', { name: /arrakeen - empty/i })).toBeInTheDocument();
  });

  it('detects a draw when all 9 squares are filled', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });

    // Play to a draw:
    // X O X    (0,0)X (0,1)O (0,2)X
    // X X O    (1,0)X (1,1)X (1,2)O
    // O X O    (2,0)O (2,1)X (2,2)O
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i })); // X (0,0)
    await user.click(screen.getByRole('button', { name: /carthag - empty/i })); // O (0,1)
    await user.click(screen.getByRole('button', { name: /giedi prime - empty/i })); // X (0,2)
    await user.click(screen.getByRole('button', { name: /salusa secundus - empty/i })); // O (1,2)
    await user.click(screen.getByRole('button', { name: /sietch tabr - empty/i })); // X (1,0)
    await user.click(screen.getByRole('button', { name: /jacurutu - empty/i })); // O (2,0)
    await user.click(screen.getByRole('button', { name: /the palace - empty/i })); // X (1,1)
    await user.click(screen.getByRole('button', { name: /heighliner - empty/i })); // O (2,2)
    await user.click(screen.getByRole('button', { name: /tuono basin - empty/i })); // X (2,1) — draw!

    expect(screen.getByRole('dialog', { name: /game over/i })).toBeInTheDocument();
    expect(screen.getByText('The Desert Claims All')).toBeInTheDocument();
  });

  it('alternates turns correctly (X first, then O)', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });

    expect(screen.getByText("Player 1's turn")).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));
    expect(screen.getByText("Player 2's turn")).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /carthag - empty/i }));
    expect(screen.getByText("Player 1's turn")).toBeInTheDocument();
  });

  it('shows O winning with correct text', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });

    // O wins left column: O at (0,0), (1,0), (2,0) won't work since X goes first
    // Instead: X plays non-winning, O wins column 1
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i })); // X (0,0)
    await user.click(screen.getByRole('button', { name: /carthag - empty/i })); // O (0,1)
    await user.click(screen.getByRole('button', { name: /sietch tabr - empty/i })); // X (1,0)
    await user.click(screen.getByRole('button', { name: /the palace - empty/i })); // O (1,1)
    await user.click(screen.getByRole('button', { name: /giedi prime - empty/i })); // X (0,2)
    await user.click(screen.getByRole('button', { name: /tuono basin - empty/i })); // O (2,1) — wins column 1!

    expect(screen.getByText('Player O Wins!')).toBeInTheDocument();
  });

  it('shows opponent selection when HvCPU mode is selected', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs cpu/i }));

    // Opponent selection screen should appear (wait for screen transition)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /choose your opponent/i })).toBeInTheDocument();
    });
    // All three characters should be visible
    expect(screen.getByText('Baron Harkonnen')).toBeInTheDocument();
    expect(screen.getByText('Reverend Mother')).toBeInTheDocument();
    expect(screen.getByText('Stilgar')).toBeInTheDocument();
    // Title screen should be gone
    expect(screen.queryByRole('heading', { name: /dune tac toe/i })).not.toBeInTheDocument();
  });

  it('starts HvCPU game when opponent is selected', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs cpu/i }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /choose your opponent/i })).toBeInTheDocument();
    });
    // Select Baron Harkonnen
    await user.click(screen.getByText('Baron Harkonnen'));

    // Game board should appear (wait for screen transition)
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });
    expect(screen.getByText('House Atreides moves')).toBeInTheDocument();
    // Opponent selection should be gone
    expect(
      screen.queryByRole('heading', { name: /choose your opponent/i }),
    ).not.toBeInTheDocument();
  });
});

describe('HvCPU flow', () => {
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
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /choose your opponent/i })).toBeInTheDocument();
    });
    await user.click(screen.getByText('Baron Harkonnen'));
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });
  }

  it('triggers CPU move after human places a piece', async () => {
    const user = userEvent.setup();
    await startCpuGame(user);

    // Human plays (0,0)
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));

    // Wait for CPU move to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /the palace - o/i })).toBeInTheDocument();
    });

    // Commentary should be displayed
    expect(screen.getByText(/The Palace is mine now/)).toBeInTheDocument();
    // Character name should appear (in opponent indicator and commentary box)
    expect(screen.getAllByText('Baron Harkonnen').length).toBeGreaterThanOrEqual(1);
  });

  it('disables board during CPU thinking', async () => {
    let resolveResponse: (value: Response) => void;
    vi.mocked(fetch).mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveResponse = resolve;
      }) as Promise<Response>,
    );

    const user = userEvent.setup();
    await startCpuGame(user);

    // Human plays
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));

    // Turn indicator should show character thinking
    expect(screen.getByText(/Baron Harkonnen is thinking/)).toBeInTheDocument();

    // Resolve the CPU response
    await vi.waitFor(() => {
      resolveResponse!(
        new Response(JSON.stringify(mockCpuResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });

    // Wait for CPU move to be placed
    await waitFor(() => {
      expect(screen.getByText('House Atreides moves')).toBeInTheDocument();
    });
  });

  it('sends correct request to backend', async () => {
    const user = userEvent.setup();
    await startCpuGame(user);

    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/move',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });

    const callBody = JSON.parse((vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string);
    expect(callBody.character).toBe('baron_harkonnen');
    expect(callBody.player_piece).toBe('X');
    expect(callBody.cpu_piece).toBe('O');
    expect(callBody.board[0][0]).toBe('X');
  });

  it('shows error toast when CPU move fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const user = userEvent.setup();
    await startCpuGame(user);

    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('retains board pieces during error state', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const user = userEvent.setup();
    await startCpuGame(user);

    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Human's piece should still be on the board
    expect(screen.getByRole('button', { name: /arrakeen - x/i })).toBeInTheDocument();
  });

  it('retries CPU move when Retry is clicked', async () => {
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(mockCpuResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

    const user = userEvent.setup();
    await startCpuGame(user);

    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Click Retry
    await user.click(screen.getByRole('button', { name: /retry/i }));

    // CPU should make its move after retry
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /the palace - o/i })).toBeInTheDocument();
    });

    // Error toast should be gone
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('dismisses error toast when dismiss is clicked', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const user = userEvent.setup();
    await startCpuGame(user);

    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Click dismiss
    await user.click(screen.getByRole('button', { name: /dismiss error/i }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

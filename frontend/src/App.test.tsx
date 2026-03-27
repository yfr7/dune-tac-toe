import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App screen routing', () => {
  it('renders title screen by default', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /dune tac toe/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /human vs human/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /human vs cpu/i }),
    ).toBeInTheDocument();
  });

  it('navigates to game screen when HvH mode is selected', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole('button', { name: /human vs human/i }),
    );
    // Game board should appear
    expect(
      screen.getByRole('group', { name: /game board/i }),
    ).toBeInTheDocument();
    // Turn indicator should show
    expect(screen.getByText("Player X's turn")).toBeInTheDocument();
    // Title screen should be gone
    expect(
      screen.queryByRole('heading', { name: /dune tac toe/i }),
    ).not.toBeInTheDocument();
  });

  it('shows game over overlay when game ends in a win', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole('button', { name: /human vs human/i }),
    );

    // Play a quick game: X wins with top row (0,0), (0,1), (0,2)
    // X plays (0,0)
    await user.click(
      screen.getByRole('button', { name: /arrakeen - empty/i }),
    );
    // O plays (1,0)
    await user.click(
      screen.getByRole('button', { name: /sietch tabr - empty/i }),
    );
    // X plays (0,1)
    await user.click(
      screen.getByRole('button', { name: /carthag - empty/i }),
    );
    // O plays (1,1)
    await user.click(
      screen.getByRole('button', { name: /the palace - empty/i }),
    );
    // X plays (0,2) — wins!
    await user.click(
      screen.getByRole('button', { name: /giedi prime - empty/i }),
    );

    // Game over overlay should appear
    expect(
      screen.getByRole('dialog', { name: /game over/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Player X Wins!')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /play again/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /rematch/i }),
    ).toBeInTheDocument();
  });

  it('returns to title screen when Play Again is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole('button', { name: /human vs human/i }),
    );

    // X wins top row
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));
    await user.click(screen.getByRole('button', { name: /sietch tabr - empty/i }));
    await user.click(screen.getByRole('button', { name: /carthag - empty/i }));
    await user.click(screen.getByRole('button', { name: /the palace - empty/i }));
    await user.click(screen.getByRole('button', { name: /giedi prime - empty/i }));

    // Click Play Again
    await user.click(screen.getByRole('button', { name: /play again/i }));

    // Should be back on title screen
    expect(
      screen.getByRole('heading', { name: /dune tac toe/i }),
    ).toBeInTheDocument();
  });

  it('starts a new game when Rematch is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole('button', { name: /human vs human/i }),
    );

    // X wins top row
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));
    await user.click(screen.getByRole('button', { name: /sietch tabr - empty/i }));
    await user.click(screen.getByRole('button', { name: /carthag - empty/i }));
    await user.click(screen.getByRole('button', { name: /the palace - empty/i }));
    await user.click(screen.getByRole('button', { name: /giedi prime - empty/i }));

    // Click Rematch
    await user.click(screen.getByRole('button', { name: /rematch/i }));

    // Should be back on game screen with empty board
    expect(
      screen.getByRole('group', { name: /game board/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Player X's turn")).toBeInTheDocument();
    // All cells should be empty
    expect(
      screen.getByRole('button', { name: /arrakeen - empty/i }),
    ).toBeInTheDocument();
  });

  it('detects a draw when all 9 squares are filled', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));

    // Play to a draw:
    // X O X    (0,0)X (0,1)O (0,2)X
    // X X O    (1,0)X (1,1)X (1,2)O
    // O X O    (2,0)O (2,1)X (2,2)O
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));       // X (0,0)
    await user.click(screen.getByRole('button', { name: /carthag - empty/i }));        // O (0,1)
    await user.click(screen.getByRole('button', { name: /giedi prime - empty/i }));    // X (0,2)
    await user.click(screen.getByRole('button', { name: /salusa secundus - empty/i }));// O (1,2)
    await user.click(screen.getByRole('button', { name: /sietch tabr - empty/i }));    // X (1,0)
    await user.click(screen.getByRole('button', { name: /jacurutu - empty/i }));       // O (2,0)
    await user.click(screen.getByRole('button', { name: /the palace - empty/i }));     // X (1,1)
    await user.click(screen.getByRole('button', { name: /heighliner - empty/i }));     // O (2,2)
    await user.click(screen.getByRole('button', { name: /tuono basin - empty/i }));    // X (2,1) — draw!

    expect(screen.getByRole('dialog', { name: /game over/i })).toBeInTheDocument();
    expect(screen.getByText("A Draw in the Desert")).toBeInTheDocument();
  });

  it('alternates turns correctly (X first, then O)', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));

    expect(screen.getByText("Player X's turn")).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));
    expect(screen.getByText("Player O's turn")).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /carthag - empty/i }));
    expect(screen.getByText("Player X's turn")).toBeInTheDocument();
  });

  it('shows O winning with correct text', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /human vs human/i }));

    // O wins left column: O at (0,0), (1,0), (2,0) won't work since X goes first
    // Instead: X plays non-winning, O wins column 1
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));       // X (0,0)
    await user.click(screen.getByRole('button', { name: /carthag - empty/i }));        // O (0,1)
    await user.click(screen.getByRole('button', { name: /sietch tabr - empty/i }));    // X (1,0)
    await user.click(screen.getByRole('button', { name: /the palace - empty/i }));     // O (1,1)
    await user.click(screen.getByRole('button', { name: /giedi prime - empty/i }));    // X (0,2)
    await user.click(screen.getByRole('button', { name: /tuono basin - empty/i }));    // O (2,1) — wins column 1!

    expect(screen.getByText('Player O Wins!')).toBeInTheDocument();
  });
});

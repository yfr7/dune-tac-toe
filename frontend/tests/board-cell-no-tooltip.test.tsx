import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BoardCell } from '../src/components/board-cell';

describe('BoardCell - no debug tooltip (T029)', () => {
  it('does not have a title attribute that would show a tooltip', () => {
    render(
      <BoardCell
        locationName="Arrakeen"
        cellValue={null}
        isWinningCell={false}
        disabled={false}
        onClick={vi.fn()}
      />,
    );
    const button = screen.getByRole('button', { name: /arrakeen - empty/i });
    expect(button).not.toHaveAttribute('title');
  });

  it('does not render any "Clicked" text after clicking', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <BoardCell
        locationName="Arrakeen"
        cellValue={null}
        isWinningCell={false}
        disabled={false}
        onClick={onClick}
      />,
    );
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));
    expect(screen.queryByText(/clicked/i)).not.toBeInTheDocument();
  });

  it('does not have a title attribute on occupied cell', () => {
    render(
      <BoardCell
        locationName="Arrakeen"
        cellValue="X"
        isWinningCell={false}
        disabled={false}
        onClick={vi.fn()}
      />,
    );
    const button = screen.getByRole('button', { name: /arrakeen - x/i });
    expect(button).not.toHaveAttribute('title');
  });
});

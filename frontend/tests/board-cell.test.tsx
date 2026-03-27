import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BoardCell } from '../src/components/board-cell';

describe('BoardCell', () => {
  const defaultProps = {
    locationName: 'Arrakeen',
    cellValue: null as import('../src/types').CellValue,
    isWinningCell: false,
    disabled: false,
    onClick: vi.fn(),
  };

  it('renders as a button element', () => {
    render(<BoardCell {...defaultProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays location name when empty', () => {
    render(<BoardCell {...defaultProps} />);
    expect(screen.getByText('Arrakeen')).toBeInTheDocument();
  });

  it('has aria-label "Arrakeen - empty" when no piece placed', () => {
    render(<BoardCell {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: 'Arrakeen - empty' }),
    ).toBeInTheDocument();
  });

  it('has aria-label "Arrakeen - X" when X is placed', () => {
    render(<BoardCell {...defaultProps} cellValue="X" />);
    expect(
      screen.getByRole('button', { name: 'Arrakeen - X' }),
    ).toBeInTheDocument();
  });

  it('has aria-label "The Palace - O" when O is placed', () => {
    render(
      <BoardCell {...defaultProps} locationName="The Palace" cellValue="O" />,
    );
    expect(
      screen.getByRole('button', { name: 'The Palace - O' }),
    ).toBeInTheDocument();
  });

  it('shows X piece marker when cellValue is X', () => {
    render(<BoardCell {...defaultProps} cellValue="X" />);
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('shows O piece marker when cellValue is O', () => {
    render(<BoardCell {...defaultProps} cellValue="O" />);
    expect(screen.getByText('O')).toBeInTheDocument();
  });

  it('does not show piece marker when empty', () => {
    render(<BoardCell {...defaultProps} />);
    // Only the location name text should be present, not X or O
    expect(screen.queryByText('X')).not.toBeInTheDocument();
    expect(screen.queryByText('O')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<BoardCell {...defaultProps} onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<BoardCell {...defaultProps} disabled onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies disabled attribute when disabled', () => {
    render(<BoardCell {...defaultProps} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies winning pulse class when isWinningCell is true', () => {
    render(<BoardCell {...defaultProps} isWinningCell />);
    expect(screen.getByRole('button').className).toContain(
      'animate-winning-pulse',
    );
  });

  it('does not apply winning pulse class when isWinningCell is false', () => {
    render(<BoardCell {...defaultProps} />);
    expect(screen.getByRole('button').className).not.toContain(
      'animate-winning-pulse',
    );
  });

  it('applies piece placement animation class on placed pieces', () => {
    render(<BoardCell {...defaultProps} cellValue="X" />);
    const pieceElement = screen.getByText('X');
    expect(pieceElement.className).toContain('animate-piece-place');
  });

  it('X piece uses bone color and O piece uses gold color', () => {
    const { rerender } = render(
      <BoardCell {...defaultProps} cellValue="X" />,
    );
    expect(screen.getByText('X').className).toContain('text-bone');

    rerender(<BoardCell {...defaultProps} cellValue="O" />);
    expect(screen.getByText('O').className).toContain('text-gold');
  });

  it('dims location name when piece is placed', () => {
    const { rerender } = render(<BoardCell {...defaultProps} />);
    const emptyName = screen.getByText('Arrakeen');
    expect(emptyName.className).toContain('text-dust');
    expect(emptyName.className).not.toContain('text-dust/50');

    rerender(<BoardCell {...defaultProps} cellValue="X" />);
    const placedName = screen.getByText('Arrakeen');
    expect(placedName.className).toContain('text-dust/50');
  });
});

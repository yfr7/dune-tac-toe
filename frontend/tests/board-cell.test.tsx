import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
    expect(emptyName.className).toContain('text-dust-bright');
    expect(emptyName.className).not.toContain('text-dust/50');

    rerender(<BoardCell {...defaultProps} cellValue="X" />);
    const placedName = screen.getByText('Arrakeen');
    expect(placedName.className).toContain('text-dust/50');
  });

  describe('T011: Board cell hover and contrast enhancements', () => {
    it('applies scale-[1.02] hover class on empty non-disabled cells', () => {
      render(<BoardCell {...defaultProps} />);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('hover:scale-[1.02]');
    });

    it('does not apply hover scale on occupied cells', () => {
      render(<BoardCell {...defaultProps} cellValue="X" />);
      const btn = screen.getByRole('button');
      expect(btn.className).not.toContain('hover:scale-[1.02]');
    });

    it('uses --dust-bright for empty cell location name contrast', () => {
      render(<BoardCell {...defaultProps} />);
      const name = screen.getByText('Arrakeen');
      expect(name.className).toContain('text-dust-bright');
    });

    it('uses letter-spacing 0.08em on location name', () => {
      render(<BoardCell {...defaultProps} />);
      const name = screen.getByText('Arrakeen');
      expect(name.className).toContain('tracking-[0.08em]');
    });

    it('applies custom dagger cursor on empty non-disabled cells', () => {
      render(<BoardCell {...defaultProps} />);
      const btn = screen.getByRole('button');
      expect(btn.style.cursor).toContain('crosshair');
      expect(btn.style.cursor).toContain('data:image/svg+xml');
    });

    it('does not apply custom cursor on occupied cells', () => {
      render(<BoardCell {...defaultProps} cellValue="X" />);
      const btn = screen.getByRole('button');
      expect(btn.style.cursor).toBe('');
    });

    it('does not apply custom cursor on disabled cells', () => {
      render(<BoardCell {...defaultProps} disabled />);
      const btn = screen.getByRole('button');
      expect(btn.style.cursor).toBe('');
    });
  });

  describe('invalid move flash (T024)', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('shows blood-red flash when clicking an occupied cell', () => {
      render(<BoardCell {...defaultProps} cellValue="X" />);
      const btn = screen.getByRole('button');

      act(() => { btn.click(); });
      expect(btn.className).toContain('bg-blood-red/20');
    });

    it('removes flash after 200ms', () => {
      render(<BoardCell {...defaultProps} cellValue="X" />);
      const btn = screen.getByRole('button');

      act(() => { btn.click(); });
      expect(btn.className).toContain('bg-blood-red/20');

      act(() => { vi.advanceTimersByTime(200); });
      expect(btn.className).not.toContain('bg-blood-red/20');
    });

    it('does not flash when clicking an empty cell', () => {
      render(<BoardCell {...defaultProps} />);
      const btn = screen.getByRole('button');

      act(() => { btn.click(); });
      expect(btn.className).not.toContain('bg-blood-red/20');
    });

    it('does not call onClick when clicking an occupied cell', () => {
      const onClick = vi.fn();
      render(<BoardCell {...defaultProps} cellValue="X" onClick={onClick} />);

      act(() => { screen.getByRole('button').click(); });
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});

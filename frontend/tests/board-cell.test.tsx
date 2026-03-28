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

  it('shows PlainDagger SVG icon when cellValue is X', () => {
    const { container } = render(<BoardCell {...defaultProps} cellValue="X" />);
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).toBeInTheDocument();
  });

  it('shows SeaSerpent SVG icon when cellValue is O', () => {
    const { container } = render(<BoardCell {...defaultProps} cellValue="O" />);
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).toBeInTheDocument();
  });

  it('does not show piece marker when empty', () => {
    const { container } = render(<BoardCell {...defaultProps} />);
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).not.toBeInTheDocument();
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
    const { container } = render(<BoardCell {...defaultProps} cellValue="X" />);
    const pieceWrapper = container.querySelector('[aria-hidden="true"]')?.closest('span');
    expect(pieceWrapper?.className).toContain('animate-piece-place');
  });

  it('X piece uses atreides-blue color and O piece uses gold color', () => {
    const { container, rerender } = render(
      <BoardCell {...defaultProps} cellValue="X" />,
    );
    const xWrapper = container.querySelector('svg[aria-hidden="true"]')?.closest('span[aria-hidden="true"]');
    expect(xWrapper?.className).toContain('text-atreides-blue');

    rerender(<BoardCell {...defaultProps} cellValue="O" />);
    const oWrapper = container.querySelector('svg[aria-hidden="true"]')?.closest('span[aria-hidden="true"]');
    expect(oWrapper?.className).toContain('text-gold');
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

  describe('T012: Themed SVG icons and ripple animation', () => {
    it('renders PlainDagger icon for X pieces', () => {
      const { container } = render(<BoardCell {...defaultProps} cellValue="X" />);
      // PlainDagger has a specific path starting with M43.53
      const path = container.querySelector('svg path');
      expect(path?.getAttribute('d')).toContain('M43.53');
    });

    it('renders SeaSerpent icon for O pieces', () => {
      const { container } = render(<BoardCell {...defaultProps} cellValue="O" />);
      // SeaSerpent has a specific path starting with m220
      const path = container.querySelector('svg path');
      expect(path?.getAttribute('d')).toContain('m220');
    });

    it('uses currentColor for icon fill (themed via parent text color)', () => {
      const { container } = render(<BoardCell {...defaultProps} cellValue="X" />);
      const path = container.querySelector('svg path');
      expect(path).toHaveAttribute('fill', 'currentColor');
    });

    it('icons are 2rem size', () => {
      const { container } = render(<BoardCell {...defaultProps} cellValue="X" />);
      const svg = container.querySelector('svg');
      expect(svg?.classList.contains('w-[2rem]')).toBe(true);
      expect(svg?.classList.contains('h-[2rem]')).toBe(true);
    });

    it('preserves cell aria-labels regardless of icon change', () => {
      render(<BoardCell {...defaultProps} cellValue="X" />);
      expect(screen.getByRole('button', { name: 'Arrakeen - X' })).toBeInTheDocument();
    });

    it('renders ripple-expand animation element on placed pieces', () => {
      const { container } = render(<BoardCell {...defaultProps} cellValue="X" />);
      const ripple = container.querySelector('.animate-ripple-expand');
      expect(ripple).toBeInTheDocument();
    });

    it('ripple uses atreides-blue border for X pieces', () => {
      const { container } = render(<BoardCell {...defaultProps} cellValue="X" />);
      const ripple = container.querySelector('.animate-ripple-expand') as HTMLElement;
      expect(ripple.style.borderColor).toBe('var(--atreides-blue)');
    });

    it('ripple uses gold border for O pieces', () => {
      const { container } = render(<BoardCell {...defaultProps} cellValue="O" />);
      const ripple = container.querySelector('.animate-ripple-expand') as HTMLElement;
      expect(ripple.style.borderColor).toBe('var(--gold)');
    });

    it('no ripple when cell is empty', () => {
      const { container } = render(<BoardCell {...defaultProps} />);
      const ripple = container.querySelector('.animate-ripple-expand');
      expect(ripple).not.toBeInTheDocument();
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

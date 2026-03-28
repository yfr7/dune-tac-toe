import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WinningLine } from '../src/components/winning-line';

describe('WinningLine', () => {
  const horizontalTop: [number, number][] = [[0, 0], [0, 1], [0, 2]];
  const verticalLeft: [number, number][] = [[0, 0], [1, 0], [2, 0]];
  const diagonal: [number, number][] = [[0, 0], [1, 1], [2, 2]];

  it('renders an SVG with a line element', () => {
    const { container } = render(<WinningLine winningLine={horizontalTop} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    const line = svg?.querySelector('line');
    expect(line).toBeInTheDocument();
  });

  it('is aria-hidden for accessibility', () => {
    const { container } = render(<WinningLine winningLine={horizontalTop} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('is pointer-events-none so it does not block clicks', () => {
    const { container } = render(<WinningLine winningLine={horizontalTop} />);
    const svg = container.querySelector('svg');
    expect(svg?.className.baseVal).toContain('pointer-events-none');
  });

  it('uses gold-bright stroke color', () => {
    const { container } = render(<WinningLine winningLine={horizontalTop} />);
    const line = container.querySelector('line');
    expect(line).toHaveAttribute('stroke', 'var(--gold-bright)');
  });

  it('has stroke-width of 2', () => {
    const { container } = render(<WinningLine winningLine={horizontalTop} />);
    const line = container.querySelector('line');
    expect(line).toHaveAttribute('stroke-width', '2');
  });

  it('applies drop-shadow filter for gold glow', () => {
    const { container } = render(<WinningLine winningLine={horizontalTop} />);
    const line = container.querySelector('line');
    expect(line?.getAttribute('filter')).toContain('drop-shadow');
  });

  it('sets pathLength=1 and stroke-dasharray=1 for draw-line animation', () => {
    const { container } = render(<WinningLine winningLine={horizontalTop} />);
    const line = container.querySelector('line');
    expect(line).toHaveAttribute('pathLength', '1');
    expect(line).toHaveAttribute('stroke-dasharray', '1');
    expect(line).toHaveAttribute('stroke-dashoffset', '1');
  });

  it('applies the draw-line animation class', () => {
    const { container } = render(<WinningLine winningLine={horizontalTop} />);
    const line = container.querySelector('line');
    expect(line?.classList.contains('animate-draw-line')).toBe(true);
  });

  it('computes correct coordinates for horizontal top row (0,0)→(0,2)', () => {
    const { container } = render(<WinningLine winningLine={horizontalTop} />);
    const line = container.querySelector('line')!;
    // Cell (0,0) center: x = (0+0.5)/3*100 = 16.67, y = (0+0.5)/3*100 = 16.67
    // Cell (0,2) center: x = (2+0.5)/3*100 = 83.33, y = 16.67
    expect(parseFloat(line.getAttribute('x1')!)).toBeCloseTo(16.67, 1);
    expect(parseFloat(line.getAttribute('y1')!)).toBeCloseTo(16.67, 1);
    expect(parseFloat(line.getAttribute('x2')!)).toBeCloseTo(83.33, 1);
    expect(parseFloat(line.getAttribute('y2')!)).toBeCloseTo(16.67, 1);
  });

  it('computes correct coordinates for vertical left column (0,0)→(2,0)', () => {
    const { container } = render(<WinningLine winningLine={verticalLeft} />);
    const line = container.querySelector('line')!;
    // Cell (0,0): (16.67, 16.67), Cell (2,0): (16.67, 83.33)
    expect(parseFloat(line.getAttribute('x1')!)).toBeCloseTo(16.67, 1);
    expect(parseFloat(line.getAttribute('y1')!)).toBeCloseTo(16.67, 1);
    expect(parseFloat(line.getAttribute('x2')!)).toBeCloseTo(16.67, 1);
    expect(parseFloat(line.getAttribute('y2')!)).toBeCloseTo(83.33, 1);
  });

  it('computes correct coordinates for diagonal (0,0)→(2,2)', () => {
    const { container } = render(<WinningLine winningLine={diagonal} />);
    const line = container.querySelector('line')!;
    // Cell (0,0): (16.67, 16.67), Cell (2,2): (83.33, 83.33)
    expect(parseFloat(line.getAttribute('x1')!)).toBeCloseTo(16.67, 1);
    expect(parseFloat(line.getAttribute('y1')!)).toBeCloseTo(16.67, 1);
    expect(parseFloat(line.getAttribute('x2')!)).toBeCloseTo(83.33, 1);
    expect(parseFloat(line.getAttribute('y2')!)).toBeCloseTo(83.33, 1);
  });

  it('returns null when winningLine has fewer than 2 cells', () => {
    const { container } = render(<WinningLine winningLine={[[0, 0]]} />);
    expect(container.firstChild).toBeNull();
  });

  it('is absolutely positioned with inset matching board padding', () => {
    const { container } = render(<WinningLine winningLine={horizontalTop} />);
    const svg = container.querySelector('svg');
    expect(svg?.className.baseVal).toContain('absolute');
    expect(svg?.className.baseVal).toContain('inset-[var(--space-4)]');
  });
});

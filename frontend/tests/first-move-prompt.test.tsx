import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FirstMovePrompt } from '../src/components/first-move-prompt';
import type { Board } from '../src/types';

const EMPTY_BOARD: Board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

describe('FirstMovePrompt (T028)', () => {
  it('renders "Claim your first territory" text', () => {
    render(<FirstMovePrompt board={EMPTY_BOARD} />);
    expect(screen.getByText('Claim your first territory')).toBeInTheDocument();
  });

  it('is visible (opacity 1) when board is empty', () => {
    render(<FirstMovePrompt board={EMPTY_BOARD} />);
    const el = screen.getByText('Claim your first territory');
    expect(el.style.opacity).toBe('1');
  });

  it('is hidden (opacity 0) when board has a piece', () => {
    const board: Board = [
      ['X', null, null],
      [null, null, null],
      [null, null, null],
    ];
    render(<FirstMovePrompt board={board} />);
    const el = screen.getByText('Claim your first territory');
    expect(el.style.opacity).toBe('0');
  });

  it('sets aria-hidden=true when not visible', () => {
    const board: Board = [
      [null, 'O', null],
      [null, null, null],
      [null, null, null],
    ];
    render(<FirstMovePrompt board={board} />);
    const el = screen.getByText('Claim your first territory');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('sets aria-hidden=false when visible', () => {
    render(<FirstMovePrompt board={EMPTY_BOARD} />);
    const el = screen.getByText('Claim your first territory');
    expect(el).toHaveAttribute('aria-hidden', 'false');
  });

  it('uses font-display italic styling', () => {
    render(<FirstMovePrompt board={EMPTY_BOARD} />);
    const el = screen.getByText('Claim your first territory');
    expect(el.className).toContain('font-display');
    expect(el.className).toContain('italic');
  });

  it('uses dust color', () => {
    render(<FirstMovePrompt board={EMPTY_BOARD} />);
    const el = screen.getByText('Claim your first territory');
    expect(el.className).toContain('text-dust');
  });

  it('has 300ms transition duration', () => {
    render(<FirstMovePrompt board={EMPTY_BOARD} />);
    const el = screen.getByText('Claim your first territory');
    expect(el.className).toContain('duration-300');
  });

  it('is hidden when board is partially filled', () => {
    const board: Board = [
      ['X', 'O', null],
      [null, 'X', null],
      [null, null, 'O'],
    ];
    render(<FirstMovePrompt board={board} />);
    const el = screen.getByText('Claim your first territory');
    expect(el.style.opacity).toBe('0');
  });
});

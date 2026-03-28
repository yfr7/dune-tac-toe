import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';

describe('App - First Move Prompt (T028)', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ move: { row: 1, col: 1 }, commentary: 'Interesting.' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows first-move prompt in HvH game on empty board', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /human vs human/i }));
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });

    const prompt = screen.getByText('Claim your first territory');
    expect(prompt).toBeInTheDocument();
    expect(prompt.style.opacity).toBe('1');
  });

  it('shows first-move prompt in HvCPU game on empty board', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /human vs cpu/i }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /choose your opponent/i })).toBeInTheDocument();
    });
    await user.click(screen.getByText('Baron Harkonnen'));

    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });

    const prompt = screen.getByText('Claim your first territory');
    expect(prompt).toBeInTheDocument();
    expect(prompt.style.opacity).toBe('1');
  });

  it('hides first-move prompt after first piece is placed (HvH)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /human vs human/i }));
    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });

    // Place first move
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));

    const prompt = screen.getByText('Claim your first territory');
    expect(prompt.style.opacity).toBe('0');
  });

  it('hides first-move prompt after first piece is placed (HvCPU)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /human vs cpu/i }));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /choose your opponent/i })).toBeInTheDocument();
    });
    await user.click(screen.getByText('Baron Harkonnen'));

    await waitFor(() => {
      expect(screen.getByRole('group', { name: /game board/i })).toBeInTheDocument();
    });

    // Place first move
    await user.click(screen.getByRole('button', { name: /arrakeen - empty/i }));

    const prompt = screen.getByText('Claim your first territory');
    expect(prompt.style.opacity).toBe('0');
  });

  it('prompt is not on title screen', () => {
    render(<App />);
    expect(screen.queryByText('Claim your first territory')).not.toBeInTheDocument();
  });
});

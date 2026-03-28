import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TurnIndicator } from '../src/components/turn-indicator';

describe('TurnIndicator', () => {
  it('displays "Player 1\'s turn" when currentTurn is X in HvH mode', () => {
    render(<TurnIndicator currentTurn="X" />);
    expect(screen.getByText("Player 1's turn")).toBeInTheDocument();
  });

  it('displays "Player 2\'s turn" when currentTurn is O in HvH mode', () => {
    render(<TurnIndicator currentTurn="O" />);
    expect(screen.getByText("Player 2's turn")).toBeInTheDocument();
  });

  it('displays "CPU is thinking" when cpuThinking is true and no characterName', () => {
    render(<TurnIndicator currentTurn="O" cpuThinking />);
    expect(screen.getByText(/CPU is thinking/)).toBeInTheDocument();
  });

  it('has aria-live="polite" for screen reader announcements', () => {
    render(<TurnIndicator currentTurn="X" />);
    const indicator = screen.getByText("Player 1's turn").closest('[aria-live]');
    expect(indicator).toHaveAttribute('aria-live', 'polite');
  });

  it('defaults cpuThinking to false', () => {
    render(<TurnIndicator currentTurn="O" />);
    expect(screen.getByText("Player 2's turn")).toBeInTheDocument();
    expect(screen.queryByText(/is thinking/)).not.toBeInTheDocument();
  });

  describe('T023: CPU thinking loading states', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('displays "[Character] is thinking" with character name', () => {
      render(
        <TurnIndicator
          currentTurn="O"
          cpuThinking
          characterName="Baron Harkonnen"
        />,
      );
      expect(screen.getByText(/Baron Harkonnen is thinking/)).toBeInTheDocument();
    });

    it('shows animated ellipsis element when thinking', () => {
      render(
        <TurnIndicator
          currentTurn="O"
          cpuThinking
          characterName="Stilgar"
        />,
      );
      const dots = screen.getByText('...', { selector: 'span[aria-hidden]' });
      expect(dots).toBeInTheDocument();
    });

    it('does not show delay message before 5 seconds', () => {
      render(
        <TurnIndicator
          currentTurn="O"
          cpuThinking
          characterName="Baron Harkonnen"
        />,
      );
      act(() => {
        vi.advanceTimersByTime(4999);
      });
      expect(
        screen.queryByText(/spice is taking longer/),
      ).not.toBeInTheDocument();
    });

    it('shows delay message after 5 seconds', () => {
      render(
        <TurnIndicator
          currentTurn="O"
          cpuThinking
          characterName="Baron Harkonnen"
        />,
      );
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(
        screen.getByText('The spice is taking longer than usual...'),
      ).toBeInTheDocument();
    });

    it('clears delay message when cpuThinking becomes false', () => {
      const { rerender } = render(
        <TurnIndicator
          currentTurn="O"
          cpuThinking
          characterName="Baron Harkonnen"
        />,
      );
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(
        screen.getByText(/spice is taking longer/),
      ).toBeInTheDocument();

      rerender(
        <TurnIndicator
          currentTurn="X"
          cpuThinking={false}
          characterName="Baron Harkonnen"
        />,
      );
      expect(
        screen.queryByText(/spice is taking longer/),
      ).not.toBeInTheDocument();
    });

    it('does not show delay message or dots when not thinking', () => {
      render(
        <TurnIndicator
          currentTurn="X"
          characterName="Baron Harkonnen"
        />,
      );
      expect(screen.queryByText(/is thinking/)).not.toBeInTheDocument();
      expect(screen.queryByText(/spice is taking longer/)).not.toBeInTheDocument();
    });
  });

  describe('T013: Faction-flavored turn text', () => {
    it('shows "House Atreides moves" for player turn in HvCPU mode', () => {
      render(
        <TurnIndicator
          currentTurn="X"
          gameMode="human-vs-cpu"
          characterId="baron_harkonnen"
        />,
      );
      expect(screen.getByText('House Atreides moves')).toBeInTheDocument();
    });

    it('shows "Baron Harkonnen schemes..." for CPU turn in HvCPU mode', () => {
      render(
        <TurnIndicator
          currentTurn="O"
          gameMode="human-vs-cpu"
          characterId="baron_harkonnen"
        />,
      );
      expect(screen.getByText('Baron Harkonnen schemes...')).toBeInTheDocument();
    });

    it('shows "The Reverend Mother contemplates..." for RM CPU turn', () => {
      render(
        <TurnIndicator
          currentTurn="O"
          gameMode="human-vs-cpu"
          characterId="reverend_mother"
        />,
      );
      expect(screen.getByText('The Reverend Mother contemplates...')).toBeInTheDocument();
    });

    it('shows "Stilgar reads the sands..." for Stilgar CPU turn', () => {
      render(
        <TurnIndicator
          currentTurn="O"
          gameMode="human-vs-cpu"
          characterId="stilgar"
        />,
      );
      expect(screen.getByText('Stilgar reads the sands...')).toBeInTheDocument();
    });

    it('colors player turn text with Atreides accent color in HvCPU mode', () => {
      render(
        <TurnIndicator
          currentTurn="X"
          gameMode="human-vs-cpu"
          characterId="baron_harkonnen"
        />,
      );
      const textSpan = screen.getByText('House Atreides moves');
      expect(textSpan.style.color).toBe('var(--atreides-blue)');
    });

    it('colors CPU turn text with opponent faction accent color', () => {
      render(
        <TurnIndicator
          currentTurn="O"
          gameMode="human-vs-cpu"
          characterId="baron_harkonnen"
        />,
      );
      const textSpan = screen.getByText('Baron Harkonnen schemes...');
      expect(textSpan.style.color).toBe('var(--deep-blue)');
    });

    it('uses generic "Player 1/2" text in HvH mode even with characterId', () => {
      render(
        <TurnIndicator
          currentTurn="X"
          gameMode="human-vs-human"
          characterId="baron_harkonnen"
        />,
      );
      expect(screen.getByText("Player 1's turn")).toBeInTheDocument();
    });

    it('applies --font-hud font family', () => {
      render(<TurnIndicator currentTurn="X" />);
      const indicator = screen.getByText("Player 1's turn").closest('[aria-live]');
      expect(indicator?.className).toContain('font-[var(--font-hud)]');
    });
  });
});

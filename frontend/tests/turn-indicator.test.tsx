import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TurnIndicator } from '../src/components/turn-indicator';

describe('TurnIndicator', () => {
  it('displays "Player X\'s turn" when currentTurn is X', () => {
    render(<TurnIndicator currentTurn="X" />);
    expect(screen.getByText("Player X's turn")).toBeInTheDocument();
  });

  it('displays "Player O\'s turn" when currentTurn is O', () => {
    render(<TurnIndicator currentTurn="O" />);
    expect(screen.getByText("Player O's turn")).toBeInTheDocument();
  });

  it('displays "CPU is thinking" when cpuThinking is true and no characterName', () => {
    render(<TurnIndicator currentTurn="O" cpuThinking />);
    expect(screen.getByText(/CPU is thinking/)).toBeInTheDocument();
  });

  it('has aria-live="polite" for screen reader announcements', () => {
    render(<TurnIndicator currentTurn="X" />);
    const indicator = screen.getByText("Player X's turn").closest('[aria-live]');
    expect(indicator).toHaveAttribute('aria-live', 'polite');
  });

  it('defaults cpuThinking to false', () => {
    render(<TurnIndicator currentTurn="O" />);
    expect(screen.getByText("Player O's turn")).toBeInTheDocument();
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
});

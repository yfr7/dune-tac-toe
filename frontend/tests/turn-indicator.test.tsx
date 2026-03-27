import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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

  it('displays "CPU is thinking..." when cpuThinking is true', () => {
    render(<TurnIndicator currentTurn="O" cpuThinking />);
    expect(screen.getByText('CPU is thinking...')).toBeInTheDocument();
  });

  it('has aria-live="polite" for screen reader announcements', () => {
    render(<TurnIndicator currentTurn="X" />);
    const indicator = screen.getByText("Player X's turn");
    expect(indicator).toHaveAttribute('aria-live', 'polite');
  });

  it('defaults cpuThinking to false', () => {
    render(<TurnIndicator currentTurn="O" />);
    expect(screen.getByText("Player O's turn")).toBeInTheDocument();
    expect(screen.queryByText('CPU is thinking...')).not.toBeInTheDocument();
  });
});

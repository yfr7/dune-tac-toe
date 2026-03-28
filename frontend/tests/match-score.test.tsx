import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MatchScore } from '../src/components/match-score';

describe('MatchScore component (T025)', () => {
  const defaultProps = {
    score: { playerWins: 0, cpuWins: 0 },
    characterName: 'Baron Harkonnen',
  };

  it('renders House Atreides vs character name with scores', () => {
    render(<MatchScore {...defaultProps} />);
    expect(screen.getByText(/House Atreides/)).toBeInTheDocument();
    expect(screen.getByText(/Baron Harkonnen/)).toBeInTheDocument();
  });

  it('displays correct score values', () => {
    render(<MatchScore {...defaultProps} score={{ playerWins: 3, cpuWins: 1 }} />);
    expect(screen.getByText(/3/)).toBeInTheDocument();
    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  it('has accessible aria-label with score', () => {
    render(<MatchScore {...defaultProps} score={{ playerWins: 2, cpuWins: 1 }} />);
    expect(screen.getByLabelText('Score: House Atreides 2, Baron Harkonnen 1')).toBeInTheDocument();
  });

  it('uses --font-hud font family', () => {
    render(<MatchScore {...defaultProps} />);
    const el = screen.getByLabelText(/Score:/);
    expect(el.className).toContain('font-[var(--font-hud)]');
  });

  it('uses 0.75rem font size', () => {
    render(<MatchScore {...defaultProps} />);
    const el = screen.getByLabelText(/Score:/);
    expect(el.className).toContain('text-[0.75rem]');
  });

  it('uses --dust text color', () => {
    render(<MatchScore {...defaultProps} />);
    const el = screen.getByLabelText(/Score:/);
    expect(el.className).toContain('text-dust');
  });

  it('renders with different character name', () => {
    render(<MatchScore score={{ playerWins: 0, cpuWins: 2 }} characterName="Stilgar" />);
    expect(screen.getByText(/Stilgar/)).toBeInTheDocument();
    expect(screen.getByLabelText('Score: House Atreides 0, Stilgar 2')).toBeInTheDocument();
  });
});

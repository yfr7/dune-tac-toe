import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OpponentIndicator } from '../src/components/opponent-indicator';

describe('OpponentIndicator (T024)', () => {
  const defaultProps = {
    characterId: 'baron_harkonnen' as const,
    characterName: 'Baron Harkonnen',
    difficulty: 'hard' as const,
    isCpuTurn: false,
  };

  it('renders faction icon, character name, and difficulty badge', () => {
    const { container } = render(<OpponentIndicator {...defaultProps} />);
    expect(screen.getByText('Baron Harkonnen')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    // Faction icon SVG should be present
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('displays "vs {Character Name}" text', () => {
    render(<OpponentIndicator {...defaultProps} />);
    expect(screen.getByText(/vs/)).toBeInTheDocument();
    expect(screen.getByText('Baron Harkonnen')).toBeInTheDocument();
  });

  it('has accessible aria-label with opponent name and difficulty', () => {
    render(<OpponentIndicator {...defaultProps} />);
    expect(screen.getByLabelText('Opponent: Baron Harkonnen, Hard')).toBeInTheDocument();
  });

  it('uses --font-hud font family', () => {
    render(<OpponentIndicator {...defaultProps} />);
    const indicator = screen.getByLabelText(/Opponent:/);
    expect(indicator.className).toContain('font-[var(--font-hud)]');
  });

  it('uses 0.75rem font size', () => {
    render(<OpponentIndicator {...defaultProps} />);
    const indicator = screen.getByLabelText(/Opponent:/);
    expect(indicator.className).toContain('text-[0.75rem]');
  });

  it('colors character name with faction accent color', () => {
    render(<OpponentIndicator {...defaultProps} />);
    const name = screen.getByText('Baron Harkonnen');
    expect(name.style.color).toBe('var(--deep-blue)');
  });

  it('colors icon with faction accent color', () => {
    const { container } = render(<OpponentIndicator {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg?.parentElement?.style.color || svg?.closest('[style]')?.getAttribute('style')).toContain('var(--deep-blue)');
  });

  it('applies pulse animation when isCpuTurn is true', () => {
    render(<OpponentIndicator {...defaultProps} isCpuTurn />);
    const indicator = screen.getByLabelText(/Opponent:/);
    expect(indicator.style.animation).toBe('var(--animate-opponent-pulse)');
  });

  it('does not apply pulse animation when isCpuTurn is false', () => {
    render(<OpponentIndicator {...defaultProps} isCpuTurn={false} />);
    const indicator = screen.getByLabelText(/Opponent:/);
    expect(indicator.style.animation).toBe('');
  });

  it('renders correctly for Reverend Mother', () => {
    render(
      <OpponentIndicator
        characterId="reverend_mother"
        characterName="Reverend Mother"
        difficulty="medium"
        isCpuTurn={false}
      />,
    );
    expect(screen.getByText('Reverend Mother')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    const name = screen.getByText('Reverend Mother');
    expect(name.style.color).toBe('var(--gold)');
  });

  it('renders correctly for Stilgar', () => {
    render(
      <OpponentIndicator
        characterId="stilgar"
        characterName="Stilgar"
        difficulty="easy"
        isCpuTurn={false}
      />,
    );
    expect(screen.getByText('Stilgar')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    const name = screen.getByText('Stilgar');
    expect(name.style.color).toBe('var(--spice-orange)');
  });

  it('difficulty badge has faction accent border and color', () => {
    render(<OpponentIndicator {...defaultProps} />);
    const badge = screen.getByText('Hard');
    expect(badge.style.borderColor).toBe('var(--deep-blue)');
    expect(badge.style.color).toBe('var(--deep-blue)');
  });

  it('difficulty badge uses uppercase small text', () => {
    render(<OpponentIndicator {...defaultProps} />);
    const badge = screen.getByText('Hard');
    expect(badge.className).toContain('uppercase');
    expect(badge.className).toContain('text-[0.625rem]');
  });
});

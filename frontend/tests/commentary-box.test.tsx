import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CommentaryBox } from '../src/components/commentary-box';

describe('CommentaryBox', () => {
  const defaultProps = {
    characterName: 'Baron Harkonnen',
    commentary: 'You dare claim Arrakeen? How delightfully naive.',
    characterId: 'baron_harkonnen' as const,
  };

  it('renders character name label', () => {
    render(<CommentaryBox {...defaultProps} />);
    expect(screen.getByText('Baron Harkonnen')).toBeInTheDocument();
  });

  it('renders commentary text in quotes', () => {
    render(<CommentaryBox {...defaultProps} />);
    // The text includes smart quotes around it
    expect(
      screen.getByText(
        /You dare claim Arrakeen\? How delightfully naive\./,
      ),
    ).toBeInTheDocument();
  });

  it('returns null when commentary is null', () => {
    const { container } = render(
      <CommentaryBox {...defaultProps} commentary={null} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('has aria-live="polite" for screen reader announcements', () => {
    render(<CommentaryBox {...defaultProps} />);
    const box = screen.getByText('Baron Harkonnen').closest('[aria-live]');
    expect(box).toHaveAttribute('aria-live', 'polite');
  });

  it('applies fade-in animation class', () => {
    render(<CommentaryBox {...defaultProps} />);
    const box = screen.getByText('Baron Harkonnen').closest('div');
    expect(box?.className).toContain('animate-commentary-fade-in');
  });

  it('renders different character names', () => {
    render(
      <CommentaryBox
        characterName="Stilgar"
        commentary="The desert tests all who walk upon it."
        characterId="stilgar"
      />,
    );
    expect(screen.getByText('Stilgar')).toBeInTheDocument();
  });
});

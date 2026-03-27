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

  describe('opponent-themed styling (T019)', () => {
    it('applies Baron Harkonnen theme: deep-blue bg, dust border, bone label', () => {
      render(<CommentaryBox {...defaultProps} />);
      const container = screen.getByText('Baron Harkonnen').closest('[data-character]');
      expect(container).toHaveAttribute('data-character', 'baron_harkonnen');
      expect(container?.className).toContain('bg-deep-blue/40');
      expect(container?.className).toContain('border-dust');
      const label = screen.getByText('Baron Harkonnen');
      expect(label.className).toContain('text-bone');
    });

    it('applies Reverend Mother theme: sand-medium bg, gold border, gold label', () => {
      render(
        <CommentaryBox
          characterName="Reverend Mother"
          commentary="As it was foreseen."
          characterId="reverend_mother"
        />,
      );
      const container = screen.getByText('Reverend Mother').closest('[data-character]');
      expect(container).toHaveAttribute('data-character', 'reverend_mother');
      expect(container?.className).toContain('bg-sand-medium');
      expect(container?.className).toContain('border-gold');
      const label = screen.getByText('Reverend Mother');
      expect(label.className).toContain('text-gold');
    });

    it('applies Stilgar theme: sand-medium bg, spice-orange border, spice-orange label', () => {
      render(
        <CommentaryBox
          characterName="Stilgar"
          commentary="The desert tests all."
          characterId="stilgar"
        />,
      );
      const container = screen.getByText('Stilgar').closest('[data-character]');
      expect(container).toHaveAttribute('data-character', 'stilgar');
      expect(container?.className).toContain('bg-sand-medium');
      expect(container?.className).toContain('border-spice-orange');
      const label = screen.getByText('Stilgar');
      expect(label.className).toContain('text-spice-orange');
    });
  });
});

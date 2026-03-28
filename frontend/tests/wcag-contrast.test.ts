import { describe, expect, it } from 'vitest';

// WCAG AA contrast ratio utilities
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const linearize = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(color1: string, color2: string): number {
  const l1 = relativeLuminance(...hexToRgb(color1));
  const l2 = relativeLuminance(...hexToRgb(color2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Dune theme color tokens (must match index.css)
const COLORS = {
  'sand-dark': '#1a1409',
  'sand-medium': '#2d2417',
  'sand-light': '#4a3c2a',
  gold: '#c4973b',
  'gold-bright': '#e8b94a',
  'spice-orange': '#d4722a',
  dust: '#978a78',
  bone: '#e8dcc8',
  'deep-blue': '#5882a8',
  'blood-red': '#a83838',
  'atreides-blue': '#4a7c8a',
  'difficulty-easy': '#65993f',
  'dust-bright': '#a89b88',
};

describe('WCAG AA Contrast Audit (T030)', () => {
  // Normal text (< 18pt / < 14pt bold) requires 4.5:1
  // Large text (>= 18pt / >= 14pt bold) and UI components require 3:1

  it('dust-bright on sand-medium >= 4.5:1 (cell location names)', () => {
    expect(contrastRatio(COLORS['dust-bright'], COLORS['sand-medium'])).toBeGreaterThanOrEqual(4.5);
  });

  it('dust on sand-medium >= 4.5:1 (HUD muted text)', () => {
    expect(contrastRatio(COLORS.dust, COLORS['sand-medium'])).toBeGreaterThanOrEqual(4.5);
  });

  it('dust on sand-dark >= 4.5:1 (footer, game screen text)', () => {
    expect(contrastRatio(COLORS.dust, COLORS['sand-dark'])).toBeGreaterThanOrEqual(4.5);
  });

  it('bone on sand-dark >= 4.5:1 (body text)', () => {
    expect(contrastRatio(COLORS.bone, COLORS['sand-dark'])).toBeGreaterThanOrEqual(4.5);
  });

  it('bone on sand-medium >= 4.5:1 (card text)', () => {
    expect(contrastRatio(COLORS.bone, COLORS['sand-medium'])).toBeGreaterThanOrEqual(4.5);
  });

  it('gold on sand-dark >= 4.5:1 (primary accent)', () => {
    expect(contrastRatio(COLORS.gold, COLORS['sand-dark'])).toBeGreaterThanOrEqual(4.5);
  });

  it('gold on sand-medium >= 4.5:1 (accent on cards)', () => {
    expect(contrastRatio(COLORS.gold, COLORS['sand-medium'])).toBeGreaterThanOrEqual(4.5);
  });

  it('sand-dark on difficulty-easy >= 4.5:1 (easy badge text)', () => {
    expect(contrastRatio(COLORS['sand-dark'], COLORS['difficulty-easy'])).toBeGreaterThanOrEqual(4.5);
  });

  it('bone on blood-red >= 4.5:1 (hard badge text)', () => {
    expect(contrastRatio(COLORS.bone, COLORS['blood-red'])).toBeGreaterThanOrEqual(4.5);
  });

  it('deep-blue on sand-dark >= 4.5:1 (Baron accent text)', () => {
    expect(contrastRatio(COLORS['deep-blue'], COLORS['sand-dark'])).toBeGreaterThanOrEqual(4.5);
  });

  // Large text / icon checks (3:1 threshold)
  it('atreides-blue on sand-medium >= 3:1 (X piece icon)', () => {
    expect(contrastRatio(COLORS['atreides-blue'], COLORS['sand-medium'])).toBeGreaterThanOrEqual(3.0);
  });

  it('gold on sand-medium >= 3:1 (O piece icon)', () => {
    expect(contrastRatio(COLORS.gold, COLORS['sand-medium'])).toBeGreaterThanOrEqual(3.0);
  });

  it('spice-orange on sand-medium >= 3:1 (Stilgar accent)', () => {
    expect(contrastRatio(COLORS['spice-orange'], COLORS['sand-medium'])).toBeGreaterThanOrEqual(3.0);
  });

  it('dust-bright on sand-dark >= 4.5:1 (location names)', () => {
    expect(contrastRatio(COLORS['dust-bright'], COLORS['sand-dark'])).toBeGreaterThanOrEqual(4.5);
  });
});

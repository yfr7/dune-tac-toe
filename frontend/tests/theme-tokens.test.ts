import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Contract test: verifies that index.css defines all required
 * Dune theme CSS custom properties from theme.md.
 */
const cssContent = readFileSync(
  resolve(__dirname, '../src/index.css'),
  'utf-8',
);

describe('Dune theme CSS custom properties', () => {
  const colorTokens = [
    '--sand-dark',
    '--sand-medium',
    '--sand-light',
    '--gold',
    '--gold-bright',
    '--spice-orange',
    '--dust',
    '--bone',
    '--deep-blue',
    '--blood-red',
    '--success-spice',
  ];

  const typographyTokens = ['--font-display', '--font-body'];

  const spacingTokens = [
    '--space-1',
    '--space-2',
    '--space-3',
    '--space-4',
    '--space-6',
    '--space-8',
    '--space-12',
    '--space-16',
  ];

  const animationTokens = [
    '--duration-fast',
    '--duration-base',
    '--duration-slow',
    '--duration-pulse',
  ];

  const elevationTokens = [
    '--z-base',
    '--z-surface',
    '--z-overlay',
    '--z-modal',
    '--z-toast',
  ];

  it.each(colorTokens)('defines color token %s', (token) => {
    expect(cssContent).toContain(`${token}:`);
  });

  it.each(typographyTokens)('defines typography token %s', (token) => {
    expect(cssContent).toContain(`${token}:`);
  });

  it.each(spacingTokens)('defines spacing token %s', (token) => {
    expect(cssContent).toContain(`${token}:`);
  });

  it.each(animationTokens)('defines animation token %s', (token) => {
    expect(cssContent).toContain(`${token}:`);
  });

  it.each(elevationTokens)('defines elevation token %s', (token) => {
    expect(cssContent).toContain(`${token}:`);
  });

  it('defines the scrim overlay value', () => {
    expect(cssContent).toContain('--scrim:');
  });

  it('includes reduced motion media query', () => {
    expect(cssContent).toContain('prefers-reduced-motion: reduce');
  });

  it('maps shadcn semantic tokens to Dune palette', () => {
    const semanticTokens = [
      '--background: var(--sand-dark)',
      '--foreground: var(--bone)',
      '--primary: var(--gold)',
      '--destructive: var(--blood-red)',
    ];
    for (const mapping of semanticTokens) {
      expect(cssContent).toContain(mapping);
    }
  });

  it('sets color values matching the spec', () => {
    expect(cssContent).toContain('--sand-dark: #1a1409');
    expect(cssContent).toContain('--gold: #c4973b');
    expect(cssContent).toContain('--bone: #e8dcc8');
    expect(cssContent).toContain('--blood-red: #c44040');
  });

  it('sets spacing values using 4/8px grid', () => {
    expect(cssContent).toContain('--space-1: 4px');
    expect(cssContent).toContain('--space-2: 8px');
    expect(cssContent).toContain('--space-4: 16px');
    expect(cssContent).toContain('--space-8: 32px');
  });

  it('sets animation durations matching the spec', () => {
    expect(cssContent).toContain('--duration-fast: 150ms');
    expect(cssContent).toContain('--duration-base: 200ms');
    expect(cssContent).toContain('--duration-slow: 300ms');
    expect(cssContent).toContain('--duration-pulse: 1000ms');
  });
});

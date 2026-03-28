import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('T015: Favicon', () => {
  const faviconPath = resolve(__dirname, '../src/assets/favicon.svg');
  const faviconContent = readFileSync(faviconPath, 'utf-8');

  it('favicon.svg file exists and is valid SVG', () => {
    expect(faviconContent).toContain('<svg');
    expect(faviconContent).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(faviconContent).toContain('</svg>');
  });

  it('uses #1a1409 background color', () => {
    expect(faviconContent).toContain('fill="#1a1409"');
  });

  it('uses #c4973b icon color (gold)', () => {
    expect(faviconContent).toContain('fill="#c4973b"');
  });

  it('contains the HawkEmblem path data', () => {
    // Check for a distinctive portion of the HawkEmblem path
    expect(faviconContent).toContain('m43.66 18.375');
  });

  it('index.html references the favicon at correct path', () => {
    const indexPath = resolve(__dirname, '../index.html');
    const indexContent = readFileSync(indexPath, 'utf-8');
    expect(indexContent).toContain(
      '<link rel="icon" type="image/svg+xml" href="/src/assets/favicon.svg" />',
    );
  });

  it('index.html does not reference old Vite favicon', () => {
    const indexPath = resolve(__dirname, '../index.html');
    const indexContent = readFileSync(indexPath, 'utf-8');
    expect(indexContent).not.toContain('href="/favicon.svg"');
  });
});

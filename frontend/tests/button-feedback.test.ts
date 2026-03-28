import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const indexCss = readFileSync(resolve(__dirname, '../src/index.css'), 'utf-8');

describe('Global button :active feedback (T018)', () => {
  it('defines button transition for transform', () => {
    expect(indexCss).toContain('button {');
    expect(indexCss).toMatch(/button\s*\{[^}]*transition:\s*transform\s+80ms\s+ease-out/);
  });

  it('defines button:active with scale(0.97)', () => {
    expect(indexCss).toContain('button:active {');
    expect(indexCss).toMatch(/button:active\s*\{[^}]*transform:\s*scale\(0\.97\)/);
  });
});

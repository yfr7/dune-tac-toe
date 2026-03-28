import '@testing-library/jest-dom/vitest';

// Provide a default matchMedia mock for jsdom (used by cinematic-interstitial etc.)
// Defaults to prefers-reduced-motion: true so animations are skipped in tests.
// Individual tests can override via vi.stubGlobal('matchMedia', ...) if needed.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

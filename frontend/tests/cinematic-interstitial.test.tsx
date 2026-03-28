import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CinematicInterstitial } from '../src/components/cinematic-interstitial';

describe('CinematicInterstitial (T027)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Default: motion is allowed
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders character name with faction accent color', () => {
    render(
      <CinematicInterstitial characterId="baron_harkonnen" onComplete={vi.fn()} />,
    );
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Baron Harkonnen');
    expect(heading.style.color).toBe('var(--deep-blue)');
  });

  it('renders interstitial quote when available', () => {
    render(
      <CinematicInterstitial characterId="baron_harkonnen" onComplete={vi.fn()} />,
    );
    expect(
      screen.getByText(/The Baron does not play games/),
    ).toBeInTheDocument();
  });

  it('renders interstitial quote for each character', () => {
    const { unmount } = render(
      <CinematicInterstitial characterId="reverend_mother" onComplete={vi.fn()} />,
    );
    expect(screen.getByText(/The future is already written/)).toBeInTheDocument();
    unmount();

    render(
      <CinematicInterstitial characterId="stilgar" onComplete={vi.fn()} />,
    );
    expect(screen.getByText(/The desert tests all who enter/)).toBeInTheDocument();
  });

  it('has role="status" with descriptive aria-label', () => {
    render(
      <CinematicInterstitial characterId="baron_harkonnen" onComplete={vi.fn()} />,
    );
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-label', 'Facing Baron Harkonnen');
  });

  it('starts with opacity 0 (enter phase)', () => {
    render(
      <CinematicInterstitial characterId="baron_harkonnen" onComplete={vi.fn()} />,
    );
    const heading = screen.getByRole('heading', { level: 2 });
    const contentDiv = heading.parentElement!;
    expect(contentDiv.style.opacity).toBe('0');
  });

  it('transitions to opacity 1 during hold phase', () => {
    render(
      <CinematicInterstitial characterId="baron_harkonnen" onComplete={vi.fn()} />,
    );
    // After 200ms enter phase
    act(() => {
      vi.advanceTimersByTime(200);
    });
    const heading = screen.getByRole('heading', { level: 2 });
    const contentDiv = heading.parentElement!;
    expect(contentDiv.style.opacity).toBe('1');
  });

  it('transitions back to opacity 0 during exit phase', () => {
    render(
      <CinematicInterstitial characterId="baron_harkonnen" onComplete={vi.fn()} />,
    );
    // After enter (200ms) + hold (1000ms) = 1200ms
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    const heading = screen.getByRole('heading', { level: 2 });
    const contentDiv = heading.parentElement!;
    expect(contentDiv.style.opacity).toBe('0');
  });

  it('calls onComplete after full animation (200 + 1000 + 200 = 1400ms)', () => {
    const onComplete = vi.fn();
    render(
      <CinematicInterstitial characterId="baron_harkonnen" onComplete={onComplete} />,
    );
    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1399);
    });
    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('skips animation and calls onComplete immediately when prefers-reduced-motion', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));

    const onComplete = vi.fn();
    render(
      <CinematicInterstitial characterId="baron_harkonnen" onComplete={onComplete} />,
    );
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('renders as fixed fullscreen overlay with z-50', () => {
    render(
      <CinematicInterstitial characterId="stilgar" onComplete={vi.fn()} />,
    );
    const container = screen.getByRole('status');
    expect(container.className).toContain('fixed');
    expect(container.className).toContain('inset-0');
    expect(container.className).toContain('z-50');
  });

  it('cleans up timers on unmount', () => {
    const onComplete = vi.fn();
    const { unmount } = render(
      <CinematicInterstitial characterId="baron_harkonnen" onComplete={onComplete} />,
    );
    unmount();

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onComplete).not.toHaveBeenCalled();
  });
});

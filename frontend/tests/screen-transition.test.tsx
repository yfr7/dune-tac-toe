import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScreenTransition } from '../src/components/screen-transition';

function getWrapper(container: HTMLElement) {
  return container.firstElementChild as HTMLElement;
}

/** Advance timers past the 200ms transition duration */
function advanceTransition() {
  act(() => {
    vi.advanceTimersByTime(200);
  });
}

describe('ScreenTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders children', () => {
    render(
      <ScreenTransition screenKey="title">
        <p>Hello</p>
      </ScreenTransition>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies enter animation class on initial render', () => {
    const { container } = render(
      <ScreenTransition screenKey="title">
        <p>Title</p>
      </ScreenTransition>,
    );
    const wrapper = getWrapper(container);
    expect(wrapper.className).toContain('animate-screen-enter');
    expect(wrapper).toHaveAttribute('data-transition-phase', 'enter');
  });

  it('transitions to idle after enter animation duration', () => {
    const { container } = render(
      <ScreenTransition screenKey="title">
        <p>Title</p>
      </ScreenTransition>,
    );
    const wrapper = getWrapper(container);
    advanceTransition();
    expect(wrapper.className).not.toContain('animate-screen-enter');
    expect(wrapper).toHaveAttribute('data-transition-phase', 'idle');
  });

  it('applies exit animation when screenKey changes', () => {
    const { container, rerender } = render(
      <ScreenTransition screenKey="title">
        <p>Title</p>
      </ScreenTransition>,
    );
    const wrapper = getWrapper(container);
    advanceTransition();

    rerender(
      <ScreenTransition screenKey="game">
        <p>Game</p>
      </ScreenTransition>,
    );
    expect(wrapper.className).toContain('animate-screen-exit');
    expect(wrapper).toHaveAttribute('data-transition-phase', 'exit');
  });

  it('keeps old content visible during exit phase', () => {
    const { container, rerender } = render(
      <ScreenTransition screenKey="title">
        <p>Title</p>
      </ScreenTransition>,
    );
    advanceTransition();

    rerender(
      <ScreenTransition screenKey="game">
        <p>Game</p>
      </ScreenTransition>,
    );
    // Old content still displayed during exit
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.queryByText('Game')).not.toBeInTheDocument();
  });

  it('swaps to new content and enters after exit animation duration', () => {
    const { container, rerender } = render(
      <ScreenTransition screenKey="title">
        <p>Title</p>
      </ScreenTransition>,
    );
    const wrapper = getWrapper(container);
    advanceTransition();

    rerender(
      <ScreenTransition screenKey="game">
        <p>Game</p>
      </ScreenTransition>,
    );
    // Finish exit
    advanceTransition();
    // Now in enter phase with new content
    expect(screen.getByText('Game')).toBeInTheDocument();
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
    expect(wrapper.className).toContain('animate-screen-enter');
    expect(wrapper).toHaveAttribute('data-transition-phase', 'enter');
  });

  it('completes full transition cycle: enter → idle → exit → enter → idle', () => {
    const { container, rerender } = render(
      <ScreenTransition screenKey="title">
        <p>Title</p>
      </ScreenTransition>,
    );
    const wrapper = getWrapper(container);

    // 1. Initial enter
    expect(wrapper).toHaveAttribute('data-transition-phase', 'enter');
    advanceTransition();

    // 2. Idle
    expect(wrapper).toHaveAttribute('data-transition-phase', 'idle');

    // 3. Screen change → exit
    rerender(
      <ScreenTransition screenKey="game">
        <p>Game</p>
      </ScreenTransition>,
    );
    expect(wrapper).toHaveAttribute('data-transition-phase', 'exit');
    advanceTransition();

    // 4. Enter with new content
    expect(wrapper).toHaveAttribute('data-transition-phase', 'enter');
    expect(screen.getByText('Game')).toBeInTheDocument();
    advanceTransition();

    // 5. Idle
    expect(wrapper).toHaveAttribute('data-transition-phase', 'idle');
  });

  it('updates children in place when screenKey stays the same', () => {
    const { container, rerender } = render(
      <ScreenTransition screenKey="game">
        <p>Turn X</p>
      </ScreenTransition>,
    );
    const wrapper = getWrapper(container);
    advanceTransition();

    rerender(
      <ScreenTransition screenKey="game">
        <p>Turn O</p>
      </ScreenTransition>,
    );
    // No exit — direct content swap
    expect(screen.getByText('Turn O')).toBeInTheDocument();
    expect(wrapper).toHaveAttribute('data-transition-phase', 'idle');
  });

  it('exposes data-transition-phase attribute for testing and styling', () => {
    const { container } = render(
      <ScreenTransition screenKey="title">
        <p>Title</p>
      </ScreenTransition>,
    );
    const wrapper = getWrapper(container);
    expect(wrapper.dataset.transitionPhase).toBeDefined();
  });

  it('cleans up timer on unmount', () => {
    const { unmount } = render(
      <ScreenTransition screenKey="title">
        <p>Title</p>
      </ScreenTransition>,
    );
    // Should not throw when advancing timers after unmount
    unmount();
    expect(() => advanceTransition()).not.toThrow();
  });
});

import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorToast } from '../src/components/error-toast';

describe('ErrorToast', () => {
  it('renders error message', () => {
    const props = { message: 'Backend error: 500', onRetry: vi.fn(), onDismiss: vi.fn() };
    render(<ErrorToast {...props} />);
    expect(screen.getByText('Backend error: 500')).toBeInTheDocument();
  });

  it('has role="alert" for screen reader announcements', () => {
    const props = { message: 'Error', onRetry: vi.fn(), onDismiss: vi.fn() };
    render(<ErrorToast {...props} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders Retry button that calls onRetry', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<ErrorToast message="Error" onRetry={onRetry} onDismiss={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders dismiss button that calls onDismiss', async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(<ErrorToast message="Error" onRetry={vi.fn()} onDismiss={onDismiss} />);

    await user.click(screen.getByRole('button', { name: 'Dismiss error' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  describe('auto-dismiss timer', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('auto-dismisses after 5 seconds', () => {
      const onDismiss = vi.fn();
      render(<ErrorToast message="Error" onRetry={vi.fn()} onDismiss={onDismiss} />);
      expect(onDismiss).not.toHaveBeenCalled();

      act(() => { vi.advanceTimersByTime(5000); });
      expect(onDismiss).toHaveBeenCalledOnce();
    });

    it('does not auto-dismiss before 5 seconds', () => {
      const onDismiss = vi.fn();
      render(<ErrorToast message="Error" onRetry={vi.fn()} onDismiss={onDismiss} />);

      act(() => { vi.advanceTimersByTime(4999); });
      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('clears timer on unmount', () => {
      const onDismiss = vi.fn();
      const { unmount } = render(
        <ErrorToast message="Error" onRetry={vi.fn()} onDismiss={onDismiss} />,
      );
      unmount();

      act(() => { vi.advanceTimersByTime(5000); });
      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  it('has blood-red background and bone text styling', () => {
    const props = { message: 'Error', onRetry: vi.fn(), onDismiss: vi.fn() };
    render(<ErrorToast {...props} />);
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('bg-blood-red');
    expect(alert.className).toContain('text-bone');
  });

  it('is positioned at bottom-center', () => {
    const props = { message: 'Error', onRetry: vi.fn(), onDismiss: vi.fn() };
    render(<ErrorToast {...props} />);
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('fixed');
    expect(alert.className).toContain('bottom-');
    expect(alert.className).toContain('left-1/2');
    expect(alert.className).toContain('-translate-x-1/2');
  });
});

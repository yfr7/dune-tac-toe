import { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

export interface ErrorToastProps {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export function ErrorToast({ message, onRetry, onDismiss }: ErrorToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [onDismiss]);

  return (
    <div
      role="alert"
      className={cn(
        'fixed bottom-[var(--space-6)] left-1/2 -translate-x-1/2 z-[var(--z-toast)]',
        'flex items-center gap-[var(--space-3)]',
        'bg-blood-red text-bone px-[var(--space-4)] py-[var(--space-3)] rounded-[8px]',
        'shadow-lg animate-commentary-fade-in',
        'max-w-[480px] w-[calc(100%-var(--space-8))]',
      )}
    >
      <p className="flex-1 font-sans text-[0.875rem] leading-[1.4]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className={cn(
          'font-sans font-medium text-[0.75rem] uppercase tracking-[0.05em]',
          'px-[var(--space-3)] py-[var(--space-1)] rounded-[4px]',
          'bg-bone/20 text-bone hover:bg-bone/30 transition-colors duration-[var(--duration-fast)]',
        )}
      >
        Retry
      </button>
      <button
        type="button"
        aria-label="Dismiss error"
        onClick={onDismiss}
        className={cn(
          'text-bone/70 hover:text-bone transition-colors duration-[var(--duration-fast)]',
          'text-[1.25rem] leading-none p-[var(--space-1)]',
        )}
      >
        &times;
      </button>
    </div>
  );
}

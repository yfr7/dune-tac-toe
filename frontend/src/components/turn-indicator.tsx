import { useEffect, useState } from 'react';
import type { Piece } from '../types';

export interface TurnIndicatorProps {
  currentTurn: Piece;
  cpuThinking?: boolean;
  characterName?: string;
}

const DELAY_THRESHOLD_MS = 5000;

export function TurnIndicator({
  currentTurn,
  cpuThinking = false,
  characterName,
}: TurnIndicatorProps) {
  const [showDelayMessage, setShowDelayMessage] = useState(false);

  useEffect(() => {
    if (!cpuThinking) {
      setShowDelayMessage(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowDelayMessage(true);
    }, DELAY_THRESHOLD_MS);

    return () => clearTimeout(timer);
  }, [cpuThinking]);

  const thinkingLabel = characterName
    ? `${characterName} is thinking`
    : 'CPU is thinking';

  const text = cpuThinking ? thinkingLabel : `Player ${currentTurn}'s turn`;

  return (
    <div
      aria-live="polite"
      className="text-center font-sans font-medium text-[0.875rem] leading-[1.4] tracking-[0.03em] text-bone pb-[var(--space-4)]"
    >
      <span>
        {text}
        {cpuThinking && (
          <span
            className="inline-block w-[1.5em] text-left"
            style={{ animation: 'var(--animate-thinking-dots)' }}
            aria-hidden="true"
          >
            ...
          </span>
        )}
      </span>
      {cpuThinking && showDelayMessage && (
        <div className="text-dust text-[0.75rem] mt-[var(--space-2)] animate-commentary-fade-in">
          The spice is taking longer than usual...
        </div>
      )}
    </div>
  );
}

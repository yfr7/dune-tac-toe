import type { Piece } from '../types';

export interface TurnIndicatorProps {
  currentTurn: Piece;
  cpuThinking?: boolean;
}

export function TurnIndicator({
  currentTurn,
  cpuThinking = false,
}: TurnIndicatorProps) {
  const text = cpuThinking
    ? 'CPU is thinking...'
    : `Player ${currentTurn}'s turn`;

  return (
    <div
      aria-live="polite"
      className="text-center font-sans font-medium text-[0.875rem] leading-[1.4] tracking-[0.03em] text-bone pb-[var(--space-4)]"
    >
      {text}
    </div>
  );
}

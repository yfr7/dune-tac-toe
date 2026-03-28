import { Confetti } from '@neoconfetti/react';
import { getCpuFaction, PLAYER_FACTION } from '../data/faction-config';
import type { GameOutcome } from '../data/quotes';
import { getCpuGameQuote, getHvhGameQuote } from '../data/quotes';
import type { CharacterId, GameStatus, Piece } from '../types';

const DUNE_CONFETTI_COLORS = ['#c4973b', '#e8b94a', '#d4722a'];

export interface GameOverOverlayProps {
  gameStatus: GameStatus;
  winner: Piece | null;
  opponent: CharacterId | null;
  isHvCpu: boolean;
  onPlayAgain: () => void;
  onRematch: () => void;
}

function getWinnerText(
  winner: Piece | null,
  opponent: CharacterId | null,
  isHvCpu: boolean,
): string {
  if (winner === null) return PLAYER_FACTION.drawTitle;
  if (isHvCpu) {
    if (winner === 'X') return PLAYER_FACTION.victoryTitle;
    if (opponent) return getCpuFaction(opponent).victoryTitle;
    return 'Defeat';
  }
  return `Player ${winner} Wins!`;
}

function getQuote(winner: Piece | null, opponent: CharacterId | null, isHvCpu: boolean): string {
  if (isHvCpu && opponent) {
    let outcome: GameOutcome;
    if (winner === 'X') outcome = 'human_wins';
    else if (winner === 'O') outcome = 'cpu_wins';
    else outcome = 'draw';
    return getCpuGameQuote(opponent, outcome);
  }
  return getHvhGameQuote(winner);
}

export function GameOverOverlay({
  gameStatus,
  winner,
  opponent,
  isHvCpu,
  onPlayAgain,
  onRematch,
}: GameOverOverlayProps) {
  if (gameStatus !== 'won' && gameStatus !== 'draw') return null;

  const winnerText = getWinnerText(winner, opponent, isHvCpu);
  const quote = getQuote(winner, opponent, isHvCpu);
  const isDraw = gameStatus === 'draw';
  const isWin = gameStatus === 'won';

  // Confetti fires on player wins only (HvH: any win, HvCPU: X wins)
  const isPlayerWin = isWin && (!isHvCpu || winner === 'X');
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const showConfetti = isPlayerWin && !prefersReducedMotion;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[var(--z-modal)] animate-fade-in"
      style={{
        backgroundColor: 'rgba(26, 20, 9, 0.60)',
        backdropFilter: isDraw ? 'grayscale(0.5)' : undefined,
        WebkitBackdropFilter: isDraw ? 'grayscale(0.5)' : undefined,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Game over"
    >
      {showConfetti && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <Confetti
            particleCount={100}
            colors={DUNE_CONFETTI_COLORS}
            force={0.6}
            duration={3500}
            destroyAfterDone
          />
        </div>
      )}

      <div className="bg-sand-medium rounded-[8px] p-[var(--space-8)] max-w-[400px] w-[90%] text-center animate-scale-in">
        <h2
          className={`font-heading font-bold text-[2rem] leading-[1.1] text-gold-bright ${isWin ? 'animate-victory-pulse' : ''}`}
          aria-live="assertive"
        >
          {winnerText}
        </h2>

        <p className="font-display italic text-[1.125rem] leading-[1.6] text-bone mt-[var(--space-6)] max-w-[40ch] mx-auto">
          &ldquo;{quote}&rdquo;
        </p>

        <div className="flex justify-center gap-[var(--space-4)] mt-[var(--space-8)]">
          <button
            type="button"
            onClick={onRematch}
            className="min-h-[48px] min-w-[140px] px-[var(--space-4)] py-[var(--space-3)] bg-gold text-sand-dark font-sans font-semibold text-base tracking-[0.02em] rounded-[4px] cursor-pointer transition-all duration-[var(--duration-fast)] ease-out hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-2"
          >
            Rematch
          </button>
          <button
            type="button"
            onClick={onPlayAgain}
            className="min-h-[48px] min-w-[140px] px-[var(--space-4)] py-[var(--space-3)] bg-transparent text-gold font-sans font-semibold text-base tracking-[0.02em] border border-gold rounded-[4px] cursor-pointer transition-all duration-[var(--duration-fast)] ease-out hover:text-gold-bright hover:border-gold-bright focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-2"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

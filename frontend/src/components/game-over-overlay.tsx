import type { CharacterId, GameStatus, Piece } from "../types";
import { getCpuGameQuote, getHvhGameQuote } from "../data/quotes";
import type { GameOutcome } from "../data/quotes";

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
  isHvCpu: boolean,
): string {
  if (winner === null) return "A Draw in the Desert";
  if (isHvCpu) {
    return winner === "X" ? "You Have Conquered!" : "The CPU Prevails!";
  }
  return `Player ${winner} Wins!`;
}

function getQuote(
  winner: Piece | null,
  opponent: CharacterId | null,
  isHvCpu: boolean,
): string {
  if (isHvCpu && opponent) {
    let outcome: GameOutcome;
    if (winner === "X") outcome = "human_wins";
    else if (winner === "O") outcome = "cpu_wins";
    else outcome = "draw";
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
  if (gameStatus !== "won" && gameStatus !== "draw") return null;

  const winnerText = getWinnerText(winner, isHvCpu);
  const quote = getQuote(winner, opponent, isHvCpu);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[var(--z-modal)] animate-fade-in"
      style={{ backgroundColor: "var(--scrim)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Game over"
    >
      <div className="bg-sand-medium rounded-[8px] p-[var(--space-8)] max-w-[400px] w-[90%] text-center animate-scale-in">
        <h2
          className="font-display font-bold text-[2rem] leading-[1.1] text-gold-bright"
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
            onClick={onPlayAgain}
            className="min-h-[48px] min-w-[140px] px-[var(--space-4)] py-[var(--space-3)] bg-gold text-sand-dark font-sans font-semibold text-base tracking-[0.02em] rounded-[4px] cursor-pointer transition-all duration-[var(--duration-fast)] ease-out hover:bg-gold-bright focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-2"
          >
            Play Again
          </button>
          <button
            type="button"
            onClick={onRematch}
            className="min-h-[48px] min-w-[140px] px-[var(--space-4)] py-[var(--space-3)] bg-transparent text-gold font-sans font-semibold text-base tracking-[0.02em] border border-gold rounded-[4px] cursor-pointer transition-all duration-[var(--duration-fast)] ease-out hover:text-gold-bright hover:border-gold-bright focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-2"
          >
            Rematch
          </button>
        </div>
      </div>
    </div>
  );
}

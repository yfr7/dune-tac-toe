import type { GameMode } from "../types";

export interface TitleScreenProps {
  onSelectMode: (mode: GameMode) => void;
}

const buttonClass =
  "min-w-[200px] min-h-[48px] px-[var(--space-4)] py-[var(--space-3)] bg-sand-medium text-bone font-sans font-semibold text-base tracking-[0.02em] border border-sand-light rounded-[4px] cursor-pointer transition-all duration-[var(--duration-fast)] ease-out hover:border-gold hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-2 active:scale-[0.97]";

export function TitleScreen({ onSelectMode }: TitleScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-[var(--space-4)]">
      {/* Title area with spice glow */}
      <div className="relative flex flex-col items-center">
        {/* Spice glow radial gradient behind title */}
        <div
          className="absolute inset-0 -inset-x-16 -inset-y-8 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,114,42,0.15) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <h1
          className="relative font-title font-bold text-[3rem] leading-[1.1] tracking-[-0.02em] text-center bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #e8b94a 0%, #c4973b 50%, #a67c28 100%)",
          }}
        >
          Dune Tac Toe
        </h1>
        <p className="relative font-display italic text-center mt-[var(--space-2)] text-[color:var(--bone)] opacity-70">
          The Spice Must Flow... But First, Tic-Tac-Toe
        </p>
      </div>

      {/* Gold decorative separator */}
      <div
        className="w-full max-w-[200px] h-px mt-[var(--space-8)]"
        style={{ backgroundColor: "rgba(196,151,59,0.4)" }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-[var(--space-4)] mt-[var(--space-8)] w-full max-w-[280px]">
        <button
          type="button"
          onClick={() => onSelectMode("human-vs-human")}
          className={buttonClass}
        >
          Human vs Human
        </button>
        <button
          type="button"
          onClick={() => onSelectMode("human-vs-cpu")}
          className={buttonClass}
        >
          Human vs CPU
        </button>
      </div>
    </div>
  );
}

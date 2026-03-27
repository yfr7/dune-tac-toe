import type { GameMode } from "../types";

export interface TitleScreenProps {
  onSelectMode: (mode: GameMode) => void;
}

export function TitleScreen({ onSelectMode }: TitleScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-[var(--space-4)]">
      <h1 className="font-display font-bold text-[3rem] leading-[1.1] tracking-[-0.02em] text-gold text-center">
        Dune Tac Toe
      </h1>
      <p className="font-display italic text-dust text-center mt-[var(--space-2)]">
        The Spice Must Flow... But First, Tic-Tac-Toe
      </p>

      <div className="flex flex-col gap-[var(--space-4)] mt-[var(--space-12)] w-full max-w-[280px]">
        <button
          type="button"
          onClick={() => onSelectMode("human-vs-human")}
          className="min-w-[200px] min-h-[48px] px-[var(--space-4)] py-[var(--space-3)] bg-sand-medium text-bone font-sans font-semibold text-base tracking-[0.02em] border border-sand-light rounded-[4px] cursor-pointer transition-all duration-[var(--duration-fast)] ease-out hover:border-gold hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-2"
        >
          Human vs Human
        </button>
        <button
          type="button"
          onClick={() => onSelectMode("human-vs-cpu")}
          className="min-w-[200px] min-h-[48px] px-[var(--space-4)] py-[var(--space-3)] bg-sand-medium text-bone font-sans font-semibold text-base tracking-[0.02em] border border-sand-light rounded-[4px] cursor-pointer transition-all duration-[var(--duration-fast)] ease-out hover:border-gold hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-2"
        >
          Human vs CPU
        </button>
      </div>
    </div>
  );
}

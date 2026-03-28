import { cn } from "../lib/utils";
import type { CharacterId, Difficulty } from "../types";
import { CHARACTERS } from "../data/characters";

export interface OpponentSelectProps {
  onSelectOpponent: (characterId: CharacterId) => void;
}

const BADGE_STYLES: Record<Difficulty, string> = {
  hard: "bg-blood-red text-bone",
  medium: "bg-gold text-sand-dark",
  easy: "bg-spice-orange text-sand-dark",
};

function SpiceIcons({ count }: { count: number }) {
  return (
    <span className="flex gap-[var(--space-1)]" aria-label={`Difficulty ${count} of 3`}>
      {Array.from({ length: 3 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "text-sm",
            i < count ? "text-spice-orange" : "text-sand-light",
          )}
          aria-hidden="true"
        >
          &#9670;
        </span>
      ))}
    </span>
  );
}

export function OpponentSelect({ onSelectOpponent }: OpponentSelectProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-[var(--space-4)]">
      <h2 className="font-heading font-semibold text-[1.5rem] leading-[1.3] tracking-[-0.01em] text-bone mb-[var(--space-8)]">
        Choose Your Opponent
      </h2>

      <div className="flex flex-wrap justify-center gap-[var(--space-6)]">
        {CHARACTERS.map((character) => (
          <button
            key={character.id}
            type="button"
            onClick={() => onSelectOpponent(character.id)}
            className={cn(
              "min-w-[180px] max-w-[220px] flex-1",
              "flex flex-col items-center text-center",
              "p-[var(--space-6)] bg-sand-medium rounded-[8px]",
              "border border-transparent cursor-pointer",
              "transition-all duration-[var(--duration-fast)] ease-out",
              "hover:border-gold hover:-translate-y-[2px]",
              "focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-2",
            )}
          >
            <h3 className="font-heading font-semibold text-[1.25rem] text-bone">
              {character.name}
            </h3>

            <span
              className={cn(
                "mt-[var(--space-2)] px-[var(--space-2)] py-[var(--space-1)]",
                "font-sans font-medium text-[0.75rem] tracking-[0.05em] uppercase rounded-[4px]",
                BADGE_STYLES[character.difficulty],
              )}
            >
              {character.difficulty}
            </span>

            <p className="mt-[var(--space-3)] text-[0.875rem] leading-[1.5] text-dust">
              {character.description}
            </p>

            <div className="mt-[var(--space-3)]">
              <SpiceIcons count={character.difficultyRank} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

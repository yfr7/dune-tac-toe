import { cn } from "../lib/utils";
import type { CharacterId, Difficulty } from "../types";
import { CHARACTERS } from "../data/characters";
import { CPU_FACTIONS } from "../data/faction-config";
import { SpiderAlt } from "../assets/icons/SpiderAlt";
import { AllSeeingEye } from "../assets/icons/AllSeeingEye";
import { SandSnake } from "../assets/icons/SandSnake";

export interface OpponentSelectProps {
  onSelectOpponent: (characterId: CharacterId) => void;
}

const BADGE_STYLES: Record<Difficulty, string> = {
  hard: "bg-difficulty-hard text-bone",
  medium: "bg-difficulty-medium text-sand-dark",
  easy: "bg-difficulty-easy text-sand-dark",
};

const CARD_ICON: Record<CharacterId, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  baron_harkonnen: SpiderAlt,
  reverend_mother: AllSeeingEye,
  stilgar: SandSnake,
};

function DifficultyDots({ count }: { count: number }) {
  return (
    <span className="flex gap-[var(--space-1)]" aria-label={`Difficulty ${count} of 3`}>
      {Array.from({ length: 3 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "inline-block w-[8px] h-[8px] rounded-full",
            i < count ? "bg-spice-orange" : "bg-sand-light",
          )}
          aria-hidden="true"
        />
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
        {CHARACTERS.map((character) => {
          const faction = CPU_FACTIONS[character.id];
          const Icon = CARD_ICON[character.id];

          return (
            <button
              key={character.id}
              type="button"
              onClick={() => onSelectOpponent(character.id)}
              className={cn(
                "min-w-[180px] max-w-[220px] flex-1",
                "flex flex-col items-center text-center",
                "p-[var(--space-6)] bg-sand-medium rounded-[8px]",
                "cursor-pointer",
                "transition-all duration-[var(--duration-fast)] ease-out",
                "hover:-translate-y-[4px]",
                "focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-2",
                "active:scale-[0.97]",
              )}
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: faction.accentColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 4px 16px ${faction.accentColor}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Icon
                className="w-[2rem] h-[2rem] mb-[var(--space-3)]"
                style={{ color: faction.accentColor }}
              />

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
                <DifficultyDots count={character.difficultyRank} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { AllSeeingEye } from '../assets/icons/AllSeeingEye';
import { SandSnake } from '../assets/icons/SandSnake';
import { SpiderAlt } from '../assets/icons/SpiderAlt';
import { CPU_FACTIONS } from '../data/faction-config';
import { cn } from '../lib/utils';
import type { CharacterId, Difficulty } from '../types';

export interface OpponentIndicatorProps {
  characterId: CharacterId;
  characterName: string;
  difficulty: Difficulty;
  isCpuTurn: boolean;
}

const CARD_ICON: Record<CharacterId, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  baron_harkonnen: SpiderAlt,
  reverend_mother: AllSeeingEye,
  stilgar: SandSnake,
};

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export function OpponentIndicator({
  characterId,
  characterName,
  difficulty,
  isCpuTurn,
}: OpponentIndicatorProps) {
  const faction = CPU_FACTIONS[characterId];
  const Icon = CARD_ICON[characterId];

  return (
    <div
      className={cn(
        'flex items-center gap-[var(--space-2)] font-[var(--font-hud)] text-[0.75rem] leading-[1.2] text-dust',
        isCpuTurn && 'animate-[var(--animate-opponent-pulse)]',
      )}
      style={isCpuTurn ? { animation: 'var(--animate-opponent-pulse)' } : undefined}
      aria-label={`Opponent: ${characterName}, ${DIFFICULTY_LABEL[difficulty]}`}
    >
      <Icon className="w-[1.25rem] h-[1.25rem]" style={{ color: faction.accentColor }} />
      <span>
        vs <span style={{ color: faction.accentColor }}>{characterName}</span>
      </span>
      <span
        className={cn(
          'inline-flex items-center px-[var(--space-2)] py-[2px] rounded-full text-[0.625rem] uppercase tracking-[0.08em] font-medium',
          'border',
        )}
        style={{ borderColor: faction.accentColor, color: faction.accentColor }}
      >
        {DIFFICULTY_LABEL[difficulty]}
      </span>
    </div>
  );
}

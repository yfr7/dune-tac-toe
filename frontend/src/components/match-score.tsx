import type { MatchScore as MatchScoreType } from '../types';

export interface MatchScoreProps {
  score: MatchScoreType;
  characterName: string;
}

export function MatchScore({ score, characterName }: MatchScoreProps) {
  return (
    <div
      className="font-[var(--font-hud)] text-[0.75rem] leading-[1.2] text-dust text-center"
      aria-label={`Score: House Atreides ${score.playerWins}, ${characterName} ${score.cpuWins}`}
    >
      House Atreides {score.playerWins} &mdash; {score.cpuWins} {characterName}
    </div>
  );
}

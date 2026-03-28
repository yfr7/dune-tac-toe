import { useEffect, useState } from 'react';
import { CPU_FACTIONS, PLAYER_FACTION } from '../data/faction-config';
import type { CharacterId, GameMode, Piece } from '../types';

export interface TurnIndicatorProps {
  currentTurn: Piece;
  cpuThinking?: boolean;
  characterName?: string;
  gameMode?: GameMode;
  characterId?: CharacterId;
}

const DELAY_THRESHOLD_MS = 5000;

export function TurnIndicator({
  currentTurn,
  cpuThinking = false,
  characterName,
  gameMode = 'human-vs-human',
  characterId,
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

  const isHvCpu = gameMode === 'human-vs-cpu';
  const cpuFaction = characterId ? CPU_FACTIONS[characterId] : null;

  const thinkingLabel = characterName ? `${characterName} is thinking` : 'CPU is thinking';

  let text: string;
  let accentColor: string | undefined;

  if (cpuThinking) {
    text = thinkingLabel;
    accentColor = cpuFaction?.accentColor;
  } else if (isHvCpu && cpuFaction) {
    if (currentTurn === 'X') {
      text = PLAYER_FACTION.turnText;
      accentColor = PLAYER_FACTION.accentColor;
    } else {
      text = cpuFaction.turnText;
      accentColor = cpuFaction.accentColor;
    }
  } else {
    text = currentTurn === 'X' ? "Player 1's turn" : "Player 2's turn";
  }

  return (
    <div
      aria-live="polite"
      className="text-center font-[var(--font-hud)] font-medium text-[0.875rem] leading-[1.4] tracking-[0.03em] text-bone pb-[var(--space-4)]"
    >
      <span style={accentColor ? { color: accentColor } : undefined}>
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

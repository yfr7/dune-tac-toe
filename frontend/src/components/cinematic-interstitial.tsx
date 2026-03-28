import { useEffect, useState } from 'react';
import { getCharacter } from '../data/characters';
import { CPU_FACTIONS } from '../data/faction-config';
import type { CharacterId } from '../types';

export interface CinematicInterstitialProps {
  characterId: CharacterId;
  onComplete: () => void;
}

const ENTER_MS = 200;
const HOLD_MS = 1000;
const EXIT_MS = 200;
const TOTAL_MS = ENTER_MS + HOLD_MS + EXIT_MS;

export function CinematicInterstitial({ characterId, onComplete }: CinematicInterstitialProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  const character = getCharacter(characterId);
  const faction = CPU_FACTIONS[characterId];

  // Check prefers-reduced-motion and skip if enabled
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      onComplete();
      return;
    }

    const enterTimer = setTimeout(() => setPhase('hold'), ENTER_MS);
    const exitTimer = setTimeout(() => setPhase('exit'), ENTER_MS + HOLD_MS);
    const completeTimer = setTimeout(onComplete, TOTAL_MS);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const opacity = phase === 'hold' ? 1 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80"
      role="status"
      aria-label={`Facing ${character?.name ?? 'opponent'}`}
    >
      <div
        style={{
          opacity,
          transition: `opacity ${phase === 'enter' ? ENTER_MS : EXIT_MS}ms ease-in-out`,
        }}
        className="flex flex-col items-center gap-[var(--space-4)] text-center px-[var(--space-8)]"
      >
        <h2
          className="font-title font-bold text-[2rem] leading-[1.2] tracking-[-0.01em]"
          style={{ color: faction.accentColor }}
        >
          {character?.name}
        </h2>
        {faction.interstitialQuote && (
          <p className="font-sans italic text-[1rem] leading-[1.5] text-dust max-w-[28rem]">
            &ldquo;{faction.interstitialQuote}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}

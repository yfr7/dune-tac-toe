import type { CharacterId } from '../types';

export interface CommentaryBoxProps {
  characterName: string;
  commentary: string | null;
  characterId: CharacterId;
}

export function CommentaryBox({
  characterName,
  commentary,
  characterId,
}: CommentaryBoxProps) {
  if (!commentary) return null;

  return (
    <div
      aria-live="polite"
      className="max-w-[480px] w-full mx-auto mt-[var(--space-6)] px-[var(--space-4)] py-[var(--space-4)] bg-sand-medium border border-sand-light rounded-[8px] animate-commentary-fade-in"
    >
      <p className="font-sans font-medium text-[0.75rem] leading-[1.2] tracking-[0.05em] uppercase text-dust mb-[var(--space-2)]">
        {characterName}
      </p>
      <p className="font-display italic text-[1.125rem] leading-[1.6] text-bone max-w-[40ch]">
        &ldquo;{commentary}&rdquo;
      </p>
    </div>
  );
}

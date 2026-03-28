import { cn } from '../lib/utils';
import type { CharacterId } from '../types';

export interface CommentaryBoxProps {
  characterName: string;
  commentary: string | null;
  characterId: CharacterId;
}

const THEMED_STYLES: Record<
  CharacterId,
  { container: string; label: string }
> = {
  baron_harkonnen: {
    container: 'bg-deep-blue/40 border-dust',
    label: 'text-bone',
  },
  reverend_mother: {
    container: 'bg-sand-medium border-gold',
    label: 'text-gold',
  },
  stilgar: {
    container: 'bg-sand-medium border-spice-orange',
    label: 'text-spice-orange',
  },
};

export function CommentaryBox({
  characterName,
  commentary,
  characterId,
}: CommentaryBoxProps) {
  if (!commentary) return null;

  const theme = THEMED_STYLES[characterId];

  return (
    <div
      aria-live="polite"
      data-character={characterId}
      className={cn(
        'max-w-[480px] w-full mx-auto mt-[var(--space-6)] px-[var(--space-4)] py-[var(--space-4)] border rounded-[8px] animate-slide-up-fade',
        theme.container,
      )}
    >
      <p
        className={cn(
          'font-sans font-medium text-[0.75rem] leading-[1.2] tracking-[0.05em] uppercase mb-[var(--space-2)]',
          theme.label,
        )}
      >
        {characterName}
      </p>
      <p className="font-display italic text-[1.125rem] leading-[1.6] text-bone max-w-[40ch]">
        &ldquo;{commentary}&rdquo;
      </p>
    </div>
  );
}

import { cn } from '../lib/utils';
import type { CellValue } from '../types';

export interface BoardCellProps {
  locationName: string;
  cellValue: CellValue;
  isWinningCell: boolean;
  disabled: boolean;
  onClick: () => void;
}

function ariaLabel(locationName: string, cellValue: CellValue): string {
  if (cellValue === null) return `${locationName} - empty`;
  return `${locationName} - ${cellValue}`;
}

export function BoardCell({
  locationName,
  cellValue,
  isWinningCell,
  disabled,
  onClick,
}: BoardCellProps) {
  const isEmpty = cellValue === null;

  return (
    <button
      type="button"
      aria-label={ariaLabel(locationName, cellValue)}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        // Base cell styles
        'relative flex flex-col items-center justify-center',
        'min-h-[120px] min-w-[120px] w-full aspect-square',
        'bg-sand-medium border border-sand-light rounded-[4px]',
        'cursor-pointer transition-all duration-[var(--duration-fast)] ease-out',
        'outline-none',
        // Focus state
        'focus-visible:outline-2 focus-visible:outline-gold-bright focus-visible:outline-offset-2',
        // Hover state (only when empty and enabled)
        isEmpty &&
          !disabled &&
          'hover:shadow-[inset_0_0_12px_var(--gold-bright)] hover:[&_.location-name]:text-bone',
        // Focus text color shift
        isEmpty && 'focus-visible:[&_.location-name]:text-bone',
        // Disabled state
        disabled && 'opacity-60 cursor-wait pointer-events-none',
        // Winning cell pulse
        isWinningCell && 'animate-winning-pulse',
      )}
    >
      {/* Location name label */}
      <span
        className={cn(
          'location-name',
          'font-sans font-medium text-[0.75rem] leading-[1.2] tracking-[0.05em] uppercase',
          'transition-all duration-[var(--duration-fast)] ease-out select-none',
          isEmpty ? 'text-dust' : 'text-dust/50',
        )}
      >
        {locationName}
      </span>

      {/* Piece marker */}
      {cellValue !== null && (
        <span
          className={cn(
            'text-[2.5rem] font-bold leading-none mt-1 select-none',
            'animate-piece-place',
            cellValue === 'X' ? 'text-bone' : 'text-gold',
          )}
          aria-hidden="true"
        >
          {cellValue}
        </span>
      )}
    </button>
  );
}

import { useCallback, useRef, useState } from 'react';
import { PlainDagger } from '../assets/icons/PlainDagger';
import { SeaSerpent } from '../assets/icons/SeaSerpent';
import { cn } from '../lib/utils';
import type { CellValue } from '../types';

export interface BoardCellProps {
  locationName: string;
  cellValue: CellValue;
  isWinningCell: boolean;
  disabled: boolean;
  onClick: () => void;
}

/** Plain Dagger SVG cursor encoded as data URI (32x32, gold color) */
const DAGGER_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 512 512'%3E%3Cpath fill='%23c4973b' d='M43.53 15.75c-15.73 0-28.31 12.583-28.31 28.313 0 14.086 10.092 25.644 23.5 27.906L42.687 68 68.81 41.906l2.626-2.625C69.188 25.86 57.63 15.75 43.53 15.75zm33.72 44.125-17 17c15.885 39.37 43.45 66.684 78.75 87.406a512.629 512.629 0 0 1 25.438-24.936c-22.488-35.103-51.535-62.294-87.188-79.47zM322.594 79.03l-51.25 4.314c-79.356 48.134-143.878 108.1-186.72 186.53l-4.31 51.47 44.155-18.656-2.94-34.094-.25-3.063 1.626-2.624c35.94-58.47 79.93-109.41 141.5-141.25l2.406-1.25 2.688.25 34.125 2.906 18.97-44.53zm-62.438 66.376c-10.008 5.886-19.5 12.338-28.562 19.313 46.688 47.93 87.208 108.588 114.72 166.5l11.248 23.717-23.718-11.28c-57.995-27.554-117.918-67.57-165.688-113.907a497.06 497.06 0 0 0-20.625 29.28c101.918 94.91 227.05 177.304 347.845 234.69-57.063-120.125-140.038-246.18-235.22-348.314zm-43.03 31.22c-13.37 11.703-25.72 24.58-37.282 38.436 39.36 38.452 88.085 72.83 136.687 98.844-26.054-48.633-60.754-97.847-99.405-137.28z'/%3E%3C/svg%3E") 16 16, crosshair`;

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
  const [flashing, setFlashing] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (!isEmpty) {
      // Invalid move — flash red
      setFlashing(true);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlashing(false), 200);
      return;
    }
    onClick();
  }, [disabled, isEmpty, onClick]);

  return (
    <button
      type="button"
      aria-label={ariaLabel(locationName, cellValue)}
      disabled={disabled}
      onClick={handleClick}
      style={isEmpty && !disabled ? { cursor: DAGGER_CURSOR } : undefined}
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
          'hover:scale-[1.02] hover:shadow-[inset_0_0_12px_var(--gold-bright)] hover:[&_.location-name]:text-bone',
        // Focus text color shift
        isEmpty && 'focus-visible:[&_.location-name]:text-bone',
        // Disabled state
        disabled && 'opacity-60 cursor-wait pointer-events-none',
        // Invalid move flash
        flashing && 'bg-blood-red/20',
        // Winning cell pulse
        isWinningCell && 'animate-winning-pulse',
      )}
    >
      {/* Location name label */}
      <span
        className={cn(
          'location-name',
          'font-sans font-medium text-[0.75rem] leading-[1.2] tracking-[0.08em] uppercase',
          'transition-all duration-[var(--duration-fast)] ease-out select-none',
          isEmpty ? 'text-dust-bright' : 'text-dust/50',
        )}
      >
        {locationName}
      </span>

      {/* Piece marker */}
      {cellValue !== null && (
        <span
          className={cn(
            'relative leading-none mt-1 select-none',
            'animate-piece-place',
            cellValue === 'X' ? 'text-atreides-blue' : 'text-gold',
          )}
          aria-hidden="true"
        >
          {cellValue === 'X' ? (
            <PlainDagger className="w-[2rem] h-[2rem]" />
          ) : (
            <SeaSerpent className="w-[2rem] h-[2rem]" />
          )}
          {/* Spice glow burst on placement */}
          <span
            className="absolute inset-0 flex items-center justify-center text-[2rem] leading-none pointer-events-none animate-glow-burst"
            style={{ color: 'transparent' }}
            aria-hidden="true"
          >
            {'\u25CF'}
          </span>
          {/* Radial ripple on placement */}
          <span
            className="absolute inset-0 rounded-full border-2 animate-ripple-expand pointer-events-none"
            style={{
              borderColor: cellValue === 'X' ? 'var(--atreides-blue)' : 'var(--gold)',
            }}
          />
        </span>
      )}
    </button>
  );
}

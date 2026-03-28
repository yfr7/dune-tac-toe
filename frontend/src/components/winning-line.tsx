export interface WinningLineProps {
  /** Array of [row, col] pairs for the three winning cells */
  winningLine: [number, number][];
}

/**
 * Map a cell [row, col] to percentage coordinates within the grid content area.
 * Each cell center sits at (col + 0.5) / 3 * 100 percent of the grid width/height.
 */
function cellCenter(row: number, col: number): { x: number; y: number } {
  return {
    x: ((col + 0.5) / 3) * 100,
    y: ((row + 0.5) / 3) * 100,
  };
}

export function WinningLine({ winningLine }: WinningLineProps) {
  if (winningLine.length < 2) return null;

  const start = cellCenter(winningLine[0][0], winningLine[0][1]);
  const end = cellCenter(
    winningLine[winningLine.length - 1][0],
    winningLine[winningLine.length - 1][1],
  );

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-[var(--space-4)] pointer-events-none"
      style={{ zIndex: 'var(--z-surface)' }}
    >
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        pathLength={1}
        stroke="var(--gold-bright)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={1}
        strokeDashoffset={1}
        filter="drop-shadow(0 0 8px rgba(232,185,74,0.5))"
        className="animate-draw-line"
      />
    </svg>
  );
}

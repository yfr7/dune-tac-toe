import { BOARD_LOCATIONS } from '../data/locations';
import type { Board, CellValue } from '../types';
import { BoardCell } from './board-cell';

export interface GameBoardProps {
  board: Board;
  disabled: boolean;
  cpuThinking?: boolean;
  winningLine: [number, number][] | null;
  onCellClick: (row: number, col: number) => void;
}

function isWinningCell(row: number, col: number, winningLine: [number, number][] | null): boolean {
  if (!winningLine) return false;
  return winningLine.some(([r, c]) => r === row && c === col);
}

export function GameBoard({
  board,
  disabled,
  cpuThinking = false,
  winningLine,
  onCellClick,
}: GameBoardProps) {
  const thinkingStyles = cpuThinking ? 'opacity-60 cursor-wait' : '';

  return (
    <div
      role="group"
      aria-label="Game board - 3 by 3 grid"
      style={{
        boxShadow:
          'inset 0 2px 4px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(196,151,59,0.05), inset 0 0 4px rgba(231,155,7,0.15)',
      }}
      className={`grid grid-cols-3 gap-[2px] max-w-[480px] w-full mx-auto bg-sand-light rounded-[4px] p-[var(--space-4)] transition-opacity duration-[var(--duration-fast)] ${thinkingStyles}`}
    >
      {board.map((row: CellValue[], rowIndex: number) =>
        row.map((cellValue: CellValue, colIndex: number) => (
          <BoardCell
            key={`${rowIndex}-${colIndex}`}
            locationName={BOARD_LOCATIONS[rowIndex][colIndex]}
            cellValue={cellValue}
            isWinningCell={isWinningCell(rowIndex, colIndex, winningLine)}
            disabled={disabled}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        )),
      )}
    </div>
  );
}

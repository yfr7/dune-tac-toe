import type { Board, CellValue } from "../types";
import { BOARD_LOCATIONS } from "../data/locations";
import { BoardCell } from "./board-cell";

export interface GameBoardProps {
  board: Board;
  disabled: boolean;
  winningLine: [number, number][] | null;
  onCellClick: (row: number, col: number) => void;
}

function isWinningCell(
  row: number,
  col: number,
  winningLine: [number, number][] | null,
): boolean {
  if (!winningLine) return false;
  return winningLine.some(([r, c]) => r === row && c === col);
}

export function GameBoard({
  board,
  disabled,
  winningLine,
  onCellClick,
}: GameBoardProps) {
  return (
    <div
      role="group"
      aria-label="Game board - 3 by 3 grid"
      className="grid grid-cols-3 gap-[2px] max-w-[480px] w-full mx-auto bg-sand-light rounded-[4px] p-[var(--space-4)]"
    >
      {board.map((row: CellValue[], rowIndex: number) =>
        row.map((cellValue: CellValue, colIndex: number) => (
          <BoardCell
            key={`${rowIndex}-${colIndex}`}
            locationName={BOARD_LOCATIONS[rowIndex][colIndex]}
            cellValue={cellValue}
            isWinningCell={isWinningCell(rowIndex, colIndex, winningLine)}
            disabled={disabled || cellValue !== null}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        )),
      )}
    </div>
  );
}

import type { Board } from '../types';

export interface FirstMovePromptProps {
  board: Board;
}

function isBoardEmpty(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell === null));
}

export function FirstMovePrompt({ board }: FirstMovePromptProps) {
  const visible = isBoardEmpty(board);

  return (
    <p
      className="font-display italic text-[1rem] leading-[1.5] text-dust text-center transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden={!visible}
    >
      Claim your first territory
    </p>
  );
}

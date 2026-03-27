// Shared types for the Dune Tac Toe game

export type Piece = 'X' | 'O';

export type CellValue = Piece | null;

export type Board = [
  [CellValue, CellValue, CellValue],
  [CellValue, CellValue, CellValue],
  [CellValue, CellValue, CellValue],
];

export type GameMode = 'human-vs-human' | 'human-vs-cpu';

export type CharacterId = 'baron_harkonnen' | 'reverend_mother' | 'stilgar';

export type Difficulty = 'hard' | 'medium' | 'easy';

export type GameStatus = 'idle' | 'playing' | 'won' | 'draw';

export interface Character {
  id: CharacterId;
  name: string;
  difficulty: Difficulty;
  difficultyRank: 1 | 2 | 3;
  description: string;
}

export interface CpuMoveRequest {
  board: Board;
  character: CharacterId;
  player_piece: Piece;
  cpu_piece: Piece;
}

export interface CpuMoveResponse {
  move: { row: number; col: number };
  commentary: string;
}

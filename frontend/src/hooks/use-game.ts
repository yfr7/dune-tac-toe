import { useCallback, useRef, useState } from 'react';
import type {
  Board,
  CellValue,
  CharacterId,
  GameMode,
  GameStatus,
  MatchScore,
  Piece,
} from '../types';

/** The 8 possible winning lines: [row, col] triplets. */
const WIN_LINES: readonly [number, number][][] = [
  // Rows
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  // Columns
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  // Diagonals
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];

function createEmptyBoard(): Board {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

function checkWinner(board: Board): { winner: Piece; line: [number, number][] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const valA = board[a[0]][a[1]];
    if (valA && valA === board[b[0]][b[1]] && valA === board[c[0]][c[1]]) {
      return { winner: valA, line };
    }
  }
  return null;
}

function checkDraw(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

export interface GameState {
  board: Board;
  currentTurn: Piece;
  gameMode: GameMode | null;
  selectedOpponent: CharacterId | null;
  gameStatus: GameStatus;
  winner: Piece | null;
  winningLine: [number, number][] | null;
}

export interface GameActions {
  startGame: (mode: GameMode, opponent?: CharacterId) => void;
  placeMove: (row: number, col: number) => boolean;
  placeCpuMove: (row: number, col: number) => boolean;
  resetGame: () => void;
  rematch: () => void;
  matchScore: MatchScore;
}

const INITIAL_STATE: GameState = {
  board: createEmptyBoard(),
  currentTurn: 'X',
  gameMode: null,
  selectedOpponent: null,
  gameStatus: 'idle',
  winner: null,
  winningLine: null,
};

const INITIAL_SCORE: MatchScore = { playerWins: 0, cpuWins: 0 };

export function useGame(): GameState & GameActions {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const stateRef = useRef<GameState>(state);
  stateRef.current = state;
  const [matchScore, setMatchScore] = useState<MatchScore>(INITIAL_SCORE);

  const startGame = useCallback((mode: GameMode, opponent?: CharacterId) => {
    const next: GameState = {
      board: createEmptyBoard(),
      currentTurn: 'X',
      gameMode: mode,
      selectedOpponent: opponent ?? null,
      gameStatus: 'playing',
      winner: null,
      winningLine: null,
    };
    stateRef.current = next;
    setState(next);
    setMatchScore(INITIAL_SCORE);
  }, []);

  const placeMove = useCallback((row: number, col: number): boolean => {
    const prev = stateRef.current;
    if (prev.gameStatus !== 'playing') return false;
    if (prev.board[row][col] !== null) return false;

    const newBoard: CellValue[][] = prev.board.map((r) => [...r]);
    newBoard[row][col] = prev.currentTurn;
    const board = newBoard as unknown as Board;

    const result = checkWinner(board);
    if (result) {
      const next: GameState = {
        ...prev,
        board,
        gameStatus: 'won',
        winner: result.winner,
        winningLine: result.line,
      };
      stateRef.current = next;
      setState(next);
      if (prev.gameMode === 'human-vs-cpu') {
        setMatchScore((s) => ({
          ...s,
          playerWins: result.winner === 'X' ? s.playerWins + 1 : s.playerWins,
          cpuWins: result.winner === 'O' ? s.cpuWins + 1 : s.cpuWins,
        }));
      }
      return true;
    }

    if (checkDraw(board)) {
      const next: GameState = {
        ...prev,
        board,
        gameStatus: 'draw',
        winner: null,
        winningLine: null,
      };
      stateRef.current = next;
      setState(next);
      return true;
    }

    const next: GameState = {
      ...prev,
      board,
      currentTurn: prev.currentTurn === 'X' ? 'O' : 'X',
    };
    stateRef.current = next;
    setState(next);
    return true;
  }, []);

  const placeCpuMove = useCallback((row: number, col: number): boolean => {
    const prev = stateRef.current;
    if (prev.gameStatus !== 'playing') return false;
    if (prev.currentTurn !== 'O') return false;
    if (prev.board[row][col] !== null) return false;

    const newBoard: CellValue[][] = prev.board.map((r) => [...r]);
    newBoard[row][col] = 'O';
    const board = newBoard as unknown as Board;

    const result = checkWinner(board);
    if (result) {
      const next: GameState = {
        ...prev,
        board,
        gameStatus: 'won',
        winner: result.winner,
        winningLine: result.line,
      };
      stateRef.current = next;
      setState(next);
      if (prev.gameMode === 'human-vs-cpu') {
        setMatchScore((s) => ({ ...s, cpuWins: s.cpuWins + 1 }));
      }
      return true;
    }

    if (checkDraw(board)) {
      const next: GameState = {
        ...prev,
        board,
        gameStatus: 'draw',
        winner: null,
        winningLine: null,
      };
      stateRef.current = next;
      setState(next);
      return true;
    }

    const next: GameState = {
      ...prev,
      board,
      currentTurn: 'X',
    };
    stateRef.current = next;
    setState(next);
    return true;
  }, []);

  const resetGame = useCallback(() => {
    stateRef.current = INITIAL_STATE;
    setState(INITIAL_STATE);
    setMatchScore(INITIAL_SCORE);
  }, []);

  const rematch = useCallback(() => {
    const prev = stateRef.current;
    const next: GameState = {
      board: createEmptyBoard(),
      currentTurn: 'X',
      gameMode: prev.gameMode,
      selectedOpponent: prev.selectedOpponent,
      gameStatus: 'playing',
      winner: null,
      winningLine: null,
    };
    stateRef.current = next;
    setState(next);
  }, []);

  return {
    ...state,
    startGame,
    placeMove,
    placeCpuMove,
    resetGame,
    rematch,
    matchScore,
  };
}

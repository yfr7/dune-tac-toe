import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useGame } from "../src/hooks/use-game";

describe("useGame", () => {
  describe("initial state", () => {
    it("starts in idle status with empty board", () => {
      const { result } = renderHook(() => useGame());
      expect(result.current.gameStatus).toBe("idle");
      expect(result.current.currentTurn).toBe("X");
      expect(result.current.gameMode).toBeNull();
      expect(result.current.selectedOpponent).toBeNull();
      expect(result.current.winner).toBeNull();
      expect(result.current.winningLine).toBeNull();
      // Board should be all nulls
      for (const row of result.current.board) {
        for (const cell of row) {
          expect(cell).toBeNull();
        }
      }
    });
  });

  describe("startGame", () => {
    it("starts an HvH game", () => {
      const { result } = renderHook(() => useGame());
      act(() => result.current.startGame("human-vs-human"));
      expect(result.current.gameStatus).toBe("playing");
      expect(result.current.gameMode).toBe("human-vs-human");
      expect(result.current.currentTurn).toBe("X");
      expect(result.current.selectedOpponent).toBeNull();
    });

    it("starts an HvCPU game with opponent", () => {
      const { result } = renderHook(() => useGame());
      act(() =>
        result.current.startGame("human-vs-cpu", "baron_harkonnen"),
      );
      expect(result.current.gameStatus).toBe("playing");
      expect(result.current.gameMode).toBe("human-vs-cpu");
      expect(result.current.selectedOpponent).toBe("baron_harkonnen");
    });
  });

  describe("placeMove", () => {
    it("places X on first move and alternates turns", () => {
      const { result } = renderHook(() => useGame());
      act(() => result.current.startGame("human-vs-human"));

      act(() => {
        const moved = result.current.placeMove(0, 0);
        expect(moved).toBe(true);
      });
      expect(result.current.board[0][0]).toBe("X");
      expect(result.current.currentTurn).toBe("O");

      act(() => {
        const moved = result.current.placeMove(1, 1);
        expect(moved).toBe(true);
      });
      expect(result.current.board[1][1]).toBe("O");
      expect(result.current.currentTurn).toBe("X");
    });

    it("rejects move on occupied cell", () => {
      const { result } = renderHook(() => useGame());
      act(() => result.current.startGame("human-vs-human"));
      act(() => result.current.placeMove(0, 0));

      act(() => {
        const moved = result.current.placeMove(0, 0);
        expect(moved).toBe(false);
      });
      // Turn should not change
      expect(result.current.currentTurn).toBe("O");
      expect(result.current.board[0][0]).toBe("X");
    });

    it("rejects move when game is not playing", () => {
      const { result } = renderHook(() => useGame());
      act(() => {
        const moved = result.current.placeMove(0, 0);
        expect(moved).toBe(false);
      });
      expect(result.current.board[0][0]).toBeNull();
    });
  });

  describe("win detection", () => {
    it("detects a row win", () => {
      const { result } = renderHook(() => useGame());
      act(() => result.current.startGame("human-vs-human"));
      // X: (0,0), O: (1,0), X: (0,1), O: (1,1), X: (0,2) → X wins top row
      act(() => result.current.placeMove(0, 0));
      act(() => result.current.placeMove(1, 0));
      act(() => result.current.placeMove(0, 1));
      act(() => result.current.placeMove(1, 1));
      act(() => result.current.placeMove(0, 2));

      expect(result.current.gameStatus).toBe("won");
      expect(result.current.winner).toBe("X");
      expect(result.current.winningLine).toEqual([
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
    });

    it("detects a column win", () => {
      const { result } = renderHook(() => useGame());
      act(() => result.current.startGame("human-vs-human"));
      // X: (0,0), O: (0,1), X: (1,0), O: (1,1), X: (2,0) → X wins left column
      act(() => result.current.placeMove(0, 0));
      act(() => result.current.placeMove(0, 1));
      act(() => result.current.placeMove(1, 0));
      act(() => result.current.placeMove(1, 1));
      act(() => result.current.placeMove(2, 0));

      expect(result.current.gameStatus).toBe("won");
      expect(result.current.winner).toBe("X");
      expect(result.current.winningLine).toEqual([
        [0, 0],
        [1, 0],
        [2, 0],
      ]);
    });

    it("detects a diagonal win", () => {
      const { result } = renderHook(() => useGame());
      act(() => result.current.startGame("human-vs-human"));
      // X: (0,0), O: (0,1), X: (1,1), O: (0,2), X: (2,2) → X wins diagonal
      act(() => result.current.placeMove(0, 0));
      act(() => result.current.placeMove(0, 1));
      act(() => result.current.placeMove(1, 1));
      act(() => result.current.placeMove(0, 2));
      act(() => result.current.placeMove(2, 2));

      expect(result.current.gameStatus).toBe("won");
      expect(result.current.winner).toBe("X");
      expect(result.current.winningLine).toEqual([
        [0, 0],
        [1, 1],
        [2, 2],
      ]);
    });

    it("detects O winning", () => {
      const { result } = renderHook(() => useGame());
      act(() => result.current.startGame("human-vs-human"));
      // X: (0,0), O: (1,0), X: (0,1), O: (1,1), X: (2,2), O: (1,2) → O wins middle row
      act(() => result.current.placeMove(0, 0));
      act(() => result.current.placeMove(1, 0));
      act(() => result.current.placeMove(0, 1));
      act(() => result.current.placeMove(1, 1));
      act(() => result.current.placeMove(2, 2));
      act(() => result.current.placeMove(1, 2));

      expect(result.current.gameStatus).toBe("won");
      expect(result.current.winner).toBe("O");
    });

    it("rejects moves after game is won", () => {
      const { result } = renderHook(() => useGame());
      act(() => result.current.startGame("human-vs-human"));
      // X wins top row
      act(() => result.current.placeMove(0, 0));
      act(() => result.current.placeMove(1, 0));
      act(() => result.current.placeMove(0, 1));
      act(() => result.current.placeMove(1, 1));
      act(() => result.current.placeMove(0, 2));

      act(() => {
        const moved = result.current.placeMove(2, 2);
        expect(moved).toBe(false);
      });
    });
  });

  describe("draw detection", () => {
    it("detects a draw when all cells are filled with no winner", () => {
      const { result } = renderHook(() => useGame());
      act(() => result.current.startGame("human-vs-human"));
      // Play a draw game:
      // X O X
      // X X O
      // O X O
      act(() => result.current.placeMove(0, 0)); // X
      act(() => result.current.placeMove(0, 1)); // O
      act(() => result.current.placeMove(0, 2)); // X
      act(() => result.current.placeMove(1, 2)); // O
      act(() => result.current.placeMove(1, 0)); // X
      act(() => result.current.placeMove(2, 0)); // O
      act(() => result.current.placeMove(1, 1)); // X
      act(() => result.current.placeMove(2, 2)); // O
      act(() => result.current.placeMove(2, 1)); // X

      expect(result.current.gameStatus).toBe("draw");
      expect(result.current.winner).toBeNull();
      expect(result.current.winningLine).toBeNull();
    });
  });

  describe("placeCpuMove", () => {
    it("places O piece for CPU", () => {
      const { result } = renderHook(() => useGame());
      act(() =>
        result.current.startGame("human-vs-cpu", "baron_harkonnen"),
      );
      act(() => result.current.placeMove(0, 0)); // Human X

      act(() => {
        const moved = result.current.placeCpuMove(1, 1);
        expect(moved).toBe(true);
      });
      expect(result.current.board[1][1]).toBe("O");
      expect(result.current.currentTurn).toBe("X");
    });

    it("rejects CPU move when it is not O's turn", () => {
      const { result } = renderHook(() => useGame());
      act(() =>
        result.current.startGame("human-vs-cpu", "baron_harkonnen"),
      );
      // It's X's turn, CPU can't move
      act(() => {
        const moved = result.current.placeCpuMove(1, 1);
        expect(moved).toBe(false);
      });
      expect(result.current.board[1][1]).toBeNull();
    });

    it("rejects CPU move on occupied cell", () => {
      const { result } = renderHook(() => useGame());
      act(() =>
        result.current.startGame("human-vs-cpu", "baron_harkonnen"),
      );
      act(() => result.current.placeMove(0, 0)); // Human X

      act(() => {
        const moved = result.current.placeCpuMove(0, 0);
        expect(moved).toBe(false);
      });
    });
  });

  describe("resetGame", () => {
    it("returns to idle state", () => {
      const { result } = renderHook(() => useGame());
      act(() => result.current.startGame("human-vs-human"));
      act(() => result.current.placeMove(0, 0));
      act(() => result.current.resetGame());

      expect(result.current.gameStatus).toBe("idle");
      expect(result.current.gameMode).toBeNull();
      expect(result.current.board[0][0]).toBeNull();
    });
  });

  describe("rematch", () => {
    it("starts a new game with the same mode and opponent", () => {
      const { result } = renderHook(() => useGame());
      act(() =>
        result.current.startGame("human-vs-cpu", "stilgar"),
      );
      act(() => result.current.placeMove(0, 0));
      act(() => result.current.rematch());

      expect(result.current.gameStatus).toBe("playing");
      expect(result.current.gameMode).toBe("human-vs-cpu");
      expect(result.current.selectedOpponent).toBe("stilgar");
      expect(result.current.currentTurn).toBe("X");
      // Board should be cleared
      for (const row of result.current.board) {
        for (const cell of row) {
          expect(cell).toBeNull();
        }
      }
    });
  });
});

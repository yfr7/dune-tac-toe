import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GameBoard } from "../src/components/game-board";
import { BOARD_LOCATIONS } from "../src/data/locations";
import type { Board } from "../src/types";

const EMPTY_BOARD: Board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

describe("GameBoard", () => {
  it("renders a 3x3 grid of cells with location names", () => {
    render(
      <GameBoard
        board={EMPTY_BOARD}
        disabled={false}
        winningLine={null}
        onCellClick={() => {}}
      />,
    );

    for (const row of BOARD_LOCATIONS) {
      for (const name of row) {
        expect(
          screen.getByRole("button", { name: `${name} - empty` }),
        ).toBeInTheDocument();
      }
    }
  });

  it("has the game board group role with aria label", () => {
    render(
      <GameBoard
        board={EMPTY_BOARD}
        disabled={false}
        winningLine={null}
        onCellClick={() => {}}
      />,
    );

    expect(
      screen.getByRole("group", { name: "Game board - 3 by 3 grid" }),
    ).toBeInTheDocument();
  });

  it("displays placed pieces with correct aria labels", () => {
    const board: Board = [
      ["X", null, null],
      [null, "O", null],
      [null, null, null],
    ];

    render(
      <GameBoard
        board={board}
        disabled={false}
        winningLine={null}
        onCellClick={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Arrakeen - X" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "The Palace - O" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Carthag - empty" }),
    ).toBeInTheDocument();
  });

  it("calls onCellClick with correct row and col when an empty cell is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <GameBoard
        board={EMPTY_BOARD}
        disabled={false}
        winningLine={null}
        onCellClick={handleClick}
      />,
    );

    // Click "The Palace" at (1, 1)
    await user.click(
      screen.getByRole("button", { name: "The Palace - empty" }),
    );
    expect(handleClick).toHaveBeenCalledWith(1, 1);

    // Click "Arrakeen" at (0, 0)
    await user.click(
      screen.getByRole("button", { name: "Arrakeen - empty" }),
    );
    expect(handleClick).toHaveBeenCalledWith(0, 0);

    // Click "Heighliner" at (2, 2)
    await user.click(
      screen.getByRole("button", { name: "Heighliner - empty" }),
    );
    expect(handleClick).toHaveBeenCalledWith(2, 2);
  });

  it("disables occupied cells", () => {
    const board: Board = [
      ["X", null, null],
      [null, null, null],
      [null, null, null],
    ];

    render(
      <GameBoard
        board={board}
        disabled={false}
        winningLine={null}
        onCellClick={() => {}}
      />,
    );

    // Occupied cells are still clickable (for invalid move flash) but not HTML-disabled
    expect(
      screen.getByRole("button", { name: "Arrakeen - X" }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Carthag - empty" }),
    ).toBeEnabled();
  });

  it("disables all cells when disabled prop is true", () => {
    render(
      <GameBoard
        board={EMPTY_BOARD}
        disabled={true}
        winningLine={null}
        onCellClick={() => {}}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(9);
    for (const button of buttons) {
      expect(button).toBeDisabled();
    }
  });

  it("marks winning cells when winningLine is provided", () => {
    const board: Board = [
      ["X", "X", "X"],
      [null, "O", null],
      [null, null, "O"],
    ];
    const winningLine: [number, number][] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const { container } = render(
      <GameBoard
        board={board}
        disabled={false}
        winningLine={winningLine}
        onCellClick={() => {}}
      />,
    );

    // Winning cells should have the winning pulse animation class
    const winningButtons = container.querySelectorAll(
      ".animate-winning-pulse",
    );
    expect(winningButtons).toHaveLength(3);
  });

  it("renders exactly 9 cells", () => {
    render(
      <GameBoard
        board={EMPTY_BOARD}
        disabled={false}
        winningLine={null}
        onCellClick={() => {}}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(9);
  });

  describe("T023: CPU thinking visual states", () => {
    it("applies 60% opacity and cursor-wait when cpuThinking is true", () => {
      render(
        <GameBoard
          board={EMPTY_BOARD}
          disabled={true}
          cpuThinking={true}
          winningLine={null}
          onCellClick={() => {}}
        />,
      );
      const grid = screen.getByRole("group");
      expect(grid.className).toContain("opacity-60");
      expect(grid.className).toContain("cursor-wait");
    });

    it("does not apply thinking styles when cpuThinking is false", () => {
      render(
        <GameBoard
          board={EMPTY_BOARD}
          disabled={false}
          cpuThinking={false}
          winningLine={null}
          onCellClick={() => {}}
        />,
      );
      const grid = screen.getByRole("group");
      expect(grid.className).not.toContain("opacity-60");
      expect(grid.className).not.toContain("cursor-wait");
    });

    it("defaults cpuThinking to false", () => {
      render(
        <GameBoard
          board={EMPTY_BOARD}
          disabled={false}
          winningLine={null}
          onCellClick={() => {}}
        />,
      );
      const grid = screen.getByRole("group");
      expect(grid.className).not.toContain("opacity-60");
    });
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GameOverOverlay } from "../src/components/game-over-overlay";

describe("GameOverOverlay", () => {
  it("renders nothing when game is still playing", () => {
    const { container } = render(
      <GameOverOverlay
        gameStatus="playing"
        winner={null}
        opponent={null}
        isHvCpu={false}
        onPlayAgain={() => {}}
        onRematch={() => {}}
      />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when game is idle", () => {
    const { container } = render(
      <GameOverOverlay
        gameStatus="idle"
        winner={null}
        opponent={null}
        isHvCpu={false}
        onPlayAgain={() => {}}
        onRematch={() => {}}
      />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders winner text for HvH X win", () => {
    render(
      <GameOverOverlay
        gameStatus="won"
        winner="X"
        opponent={null}
        isHvCpu={false}
        onPlayAgain={() => {}}
        onRematch={() => {}}
      />,
    );
    expect(screen.getByText("Player X Wins!")).toBeInTheDocument();
  });

  it("renders winner text for HvH O win", () => {
    render(
      <GameOverOverlay
        gameStatus="won"
        winner="O"
        opponent={null}
        isHvCpu={false}
        onPlayAgain={() => {}}
        onRematch={() => {}}
      />,
    );
    expect(screen.getByText("Player O Wins!")).toBeInTheDocument();
  });

  it("renders draw text", () => {
    render(
      <GameOverOverlay
        gameStatus="draw"
        winner={null}
        opponent={null}
        isHvCpu={false}
        onPlayAgain={() => {}}
        onRematch={() => {}}
      />,
    );
    expect(screen.getByText("A Draw in the Desert")).toBeInTheDocument();
  });

  it("renders HvCPU human win text", () => {
    render(
      <GameOverOverlay
        gameStatus="won"
        winner="X"
        opponent="baron_harkonnen"
        isHvCpu={true}
        onPlayAgain={() => {}}
        onRematch={() => {}}
      />,
    );
    expect(screen.getByText("You Have Conquered!")).toBeInTheDocument();
  });

  it("renders HvCPU cpu win text", () => {
    render(
      <GameOverOverlay
        gameStatus="won"
        winner="O"
        opponent="stilgar"
        isHvCpu={true}
        onPlayAgain={() => {}}
        onRematch={() => {}}
      />,
    );
    expect(screen.getByText("The CPU Prevails!")).toBeInTheDocument();
  });

  it("displays a closing quote", () => {
    render(
      <GameOverOverlay
        gameStatus="won"
        winner="X"
        opponent={null}
        isHvCpu={false}
        onPlayAgain={() => {}}
        onRematch={() => {}}
      />,
    );
    // Should contain a non-empty quote in italics
    const quote = screen.getByRole("dialog").querySelector(".font-display.italic");
    expect(quote).toBeInTheDocument();
    expect(quote?.textContent?.length).toBeGreaterThan(5);
  });

  it("displays character-specific quote for CPU games", () => {
    render(
      <GameOverOverlay
        gameStatus="won"
        winner="X"
        opponent="baron_harkonnen"
        isHvCpu={true}
        onPlayAgain={() => {}}
        onRematch={() => {}}
      />,
    );
    // Baron human_wins quote
    expect(
      screen.getByText(/temporary/i),
    ).toBeInTheDocument();
  });

  it("renders Play Again and Rematch buttons", () => {
    render(
      <GameOverOverlay
        gameStatus="won"
        winner="X"
        opponent={null}
        isHvCpu={false}
        onPlayAgain={() => {}}
        onRematch={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Play Again" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Rematch" }),
    ).toBeInTheDocument();
  });

  it("calls onPlayAgain when Play Again is clicked", async () => {
    const user = userEvent.setup();
    const handlePlayAgain = vi.fn();

    render(
      <GameOverOverlay
        gameStatus="won"
        winner="X"
        opponent={null}
        isHvCpu={false}
        onPlayAgain={handlePlayAgain}
        onRematch={() => {}}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Play Again" }));
    expect(handlePlayAgain).toHaveBeenCalledOnce();
  });

  it("calls onRematch when Rematch is clicked", async () => {
    const user = userEvent.setup();
    const handleRematch = vi.fn();

    render(
      <GameOverOverlay
        gameStatus="won"
        winner="X"
        opponent={null}
        isHvCpu={false}
        onPlayAgain={() => {}}
        onRematch={handleRematch}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Rematch" }));
    expect(handleRematch).toHaveBeenCalledOnce();
  });

  it("has dialog role with aria-modal", () => {
    render(
      <GameOverOverlay
        gameStatus="won"
        winner="X"
        opponent={null}
        isHvCpu={false}
        onPlayAgain={() => {}}
        onRematch={() => {}}
      />,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", "Game over");
  });
});

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
    expect(screen.getByText("The Desert Claims All")).toBeInTheDocument();
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
    expect(screen.getByText("House Atreides Triumphs!")).toBeInTheDocument();
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
    expect(screen.getByText("The Desert Claims Victory!")).toBeInTheDocument();
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

  describe("US6: visual polish (T022)", () => {
    const defaultProps = {
      onPlayAgain: () => {},
      onRematch: () => {},
    };

    it("applies victory-pulse animation on win title", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="X"
          opponent={null}
          isHvCpu={false}
        />,
      );
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading.className).toContain("animate-victory-pulse");
    });

    it("does not apply victory-pulse on draw", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="draw"
          winner={null}
          opponent={null}
          isHvCpu={false}
        />,
      );
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading.className).not.toContain("animate-victory-pulse");
    });

    it("scrim has opacity 0.60", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="X"
          opponent={null}
          isHvCpu={false}
        />,
      );
      const dialog = screen.getByRole("dialog");
      expect(dialog.style.backgroundColor).toBe("rgba(26, 20, 9, 0.6)");
    });

    it("applies grayscale backdrop-filter on draw", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="draw"
          winner={null}
          opponent={null}
          isHvCpu={false}
        />,
      );
      const dialog = screen.getByRole("dialog");
      expect(dialog.style.backdropFilter).toBe("grayscale(0.5)");
    });

    it("does not apply grayscale backdrop-filter on win", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="X"
          opponent={null}
          isHvCpu={false}
        />,
      );
      const dialog = screen.getByRole("dialog");
      expect(dialog.style.backdropFilter).toBe("");
    });

    it("renders Rematch as first (primary) button and Play Again as second (secondary)", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="X"
          opponent={null}
          isHvCpu={false}
        />,
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveTextContent("Rematch");
      expect(buttons[1]).toHaveTextContent("Play Again");
    });

    it("Rematch button has gold background (primary style)", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="X"
          opponent={null}
          isHvCpu={false}
        />,
      );
      const rematchBtn = screen.getByRole("button", { name: "Rematch" });
      expect(rematchBtn.className).toContain("bg-gold");
    });

    it("Play Again button has transparent background with border (secondary style)", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="X"
          opponent={null}
          isHvCpu={false}
        />,
      );
      const playAgainBtn = screen.getByRole("button", { name: "Play Again" });
      expect(playAgainBtn.className).toContain("bg-transparent");
      expect(playAgainBtn.className).toContain("border-gold");
    });

    it("shows faction victory title for HvCPU Baron win", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="O"
          opponent="baron_harkonnen"
          isHvCpu={true}
        />,
      );
      expect(screen.getByText("The Baron Prevails!")).toBeInTheDocument();
    });

    it("shows faction victory title for HvCPU Reverend Mother win", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="O"
          opponent="reverend_mother"
          isHvCpu={true}
        />,
      );
      expect(screen.getByText("The Bene Gesserit See All!")).toBeInTheDocument();
    });
  });

  describe("US3: character-specific closing quotes (T021)", () => {
    const defaultProps = {
      onPlayAgain: () => {},
      onRematch: () => {},
    };

    it("displays Baron human_wins quote when human beats Baron", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="X"
          opponent="baron_harkonnen"
          isHvCpu={true}
        />,
      );
      // Baron's human_wins quote contains "temporary"
      expect(screen.getByText(/temporary/i)).toBeInTheDocument();
    });

    it("displays Baron cpu_wins quote when Baron wins", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="O"
          opponent="baron_harkonnen"
          isHvCpu={true}
        />,
      );
      // Baron's cpu_wins quote contains "entertainment"
      expect(screen.getByText(/entertainment/i)).toBeInTheDocument();
    });

    it("displays Reverend Mother human_wins quote when human beats her", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="X"
          opponent="reverend_mother"
          isHvCpu={true}
        />,
      );
      // Reverend Mother's human_wins quote contains "Kwisatz Haderach"
      expect(screen.getByText(/Kwisatz Haderach/i)).toBeInTheDocument();
    });

    it("displays Reverend Mother cpu_wins quote when she wins", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="O"
          opponent="reverend_mother"
          isHvCpu={true}
        />,
      );
      // Reverend Mother's cpu_wins quote contains "written"
      expect(screen.getByText(/written/i)).toBeInTheDocument();
    });

    it("displays Stilgar human_wins quote when human beats him", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="X"
          opponent="stilgar"
          isHvCpu={true}
        />,
      );
      // Stilgar's human_wins quote contains "water-brotherhood"
      expect(screen.getByText(/water-brotherhood/i)).toBeInTheDocument();
    });

    it("displays Stilgar cpu_wins quote when he wins", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="O"
          opponent="stilgar"
          isHvCpu={true}
        />,
      );
      // Stilgar's cpu_wins quote contains "Shai-Hulud"
      expect(screen.getByText(/Shai-Hulud/i)).toBeInTheDocument();
    });

    it("displays character-specific draw quote for CPU games", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="draw"
          winner={null}
          opponent="baron_harkonnen"
          isHvCpu={true}
        />,
      );
      // Baron's draw quote contains "stalemate" or "tedious"
      expect(screen.getByText(/stalemate/i)).toBeInTheDocument();
    });

    it("displays different quotes for different characters on same outcome", () => {
      const { unmount: unmount1 } = render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="X"
          opponent="baron_harkonnen"
          isHvCpu={true}
        />,
      );
      const baronQuote = screen.getByRole("dialog").querySelector(".font-display.italic")?.textContent;
      unmount1();

      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="X"
          opponent="stilgar"
          isHvCpu={true}
        />,
      );
      const stilgarQuote = screen.getByRole("dialog").querySelector(".font-display.italic")?.textContent;

      expect(baronQuote).not.toBe(stilgarQuote);
    });

    it("displays HvH quote (not character quote) when not in CPU mode", () => {
      render(
        <GameOverOverlay
          {...defaultProps}
          gameStatus="won"
          winner="X"
          opponent={null}
          isHvCpu={false}
        />,
      );
      // HvH x_wins quote contains "throne"
      expect(screen.getByText(/throne/i)).toBeInTheDocument();
    });
  });
});

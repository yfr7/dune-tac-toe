import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../src/App";

describe("App - Opponent Selection Flow (T017)", () => {
  it("shows title screen initially", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Dune Tac Toe" }),
    ).toBeInTheDocument();
  });

  it("navigates to opponent selection when 'Human vs CPU' is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Human vs CPU" }),
    );

    expect(
      screen.getByRole("heading", { name: "Choose Your Opponent" }),
    ).toBeInTheDocument();
    // Title screen should be gone
    expect(
      screen.queryByRole("heading", { name: "Dune Tac Toe" }),
    ).not.toBeInTheDocument();
  });

  it("starts game with selected opponent when a card is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Go to opponent select
    await user.click(
      screen.getByRole("button", { name: "Human vs CPU" }),
    );

    // Select Baron Harkonnen
    await user.click(
      screen.getByRole("heading", { name: "Baron Harkonnen" }).closest("button")!,
    );

    // Should now see the game board
    expect(
      screen.getByRole("group", { name: "Game board - 3 by 3 grid" }),
    ).toBeInTheDocument();
    // Opponent select should be gone
    expect(
      screen.queryByRole("heading", { name: "Choose Your Opponent" }),
    ).not.toBeInTheDocument();
    // Turn indicator should show X's turn
    expect(screen.getByText("Player X's turn")).toBeInTheDocument();
  });

  it("HvH mode still works - bypasses opponent selection", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Human vs Human" }),
    );

    // Should go directly to game, no opponent select
    expect(
      screen.getByRole("group", { name: "Game board - 3 by 3 grid" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Choose Your Opponent" }),
    ).not.toBeInTheDocument();
  });
});

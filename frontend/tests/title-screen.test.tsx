import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TitleScreen } from "../src/components/title-screen";

describe("TitleScreen", () => {
  it("renders the game title", () => {
    render(<TitleScreen onSelectMode={() => {}} />);
    expect(
      screen.getByRole("heading", { name: "Dune Tac Toe" }),
    ).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<TitleScreen onSelectMode={() => {}} />);
    expect(
      screen.getByText("The Spice Must Flow... But First, Tic-Tac-Toe"),
    ).toBeInTheDocument();
  });

  it("renders two mode buttons", () => {
    render(<TitleScreen onSelectMode={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Human vs Human" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Human vs CPU" }),
    ).toBeInTheDocument();
  });

  it("calls onSelectMode with 'human-vs-human' when HvH button is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<TitleScreen onSelectMode={handleSelect} />);
    await user.click(
      screen.getByRole("button", { name: "Human vs Human" }),
    );

    expect(handleSelect).toHaveBeenCalledOnce();
    expect(handleSelect).toHaveBeenCalledWith("human-vs-human");
  });

  it("calls onSelectMode with 'human-vs-cpu' when HvCPU button is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<TitleScreen onSelectMode={handleSelect} />);
    await user.click(
      screen.getByRole("button", { name: "Human vs CPU" }),
    );

    expect(handleSelect).toHaveBeenCalledOnce();
    expect(handleSelect).toHaveBeenCalledWith("human-vs-cpu");
  });
});

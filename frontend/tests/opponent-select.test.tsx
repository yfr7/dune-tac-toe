import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OpponentSelect } from "../src/components/opponent-select";
import { CHARACTERS } from "../src/data/characters";

describe("OpponentSelect", () => {
  it("renders a heading", () => {
    render(<OpponentSelect onSelectOpponent={() => {}} />);
    expect(
      screen.getByRole("heading", { name: "Choose Your Opponent" }),
    ).toBeInTheDocument();
  });

  it("renders three opponent cards as buttons", () => {
    render(<OpponentSelect onSelectOpponent={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("displays each character name", () => {
    render(<OpponentSelect onSelectOpponent={() => {}} />);
    for (const character of CHARACTERS) {
      expect(
        screen.getByRole("heading", { name: character.name }),
      ).toBeInTheDocument();
    }
  });

  it("displays difficulty badges for each character", () => {
    render(<OpponentSelect onSelectOpponent={() => {}} />);
    expect(screen.getByText("hard")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
    expect(screen.getByText("easy")).toBeInTheDocument();
  });

  it("displays personality descriptions", () => {
    render(<OpponentSelect onSelectOpponent={() => {}} />);
    for (const character of CHARACTERS) {
      expect(screen.getByText(character.description)).toBeInTheDocument();
    }
  });

  it("displays spice difficulty icons for each character", () => {
    render(<OpponentSelect onSelectOpponent={() => {}} />);
    // Each card has a "Difficulty X of 3" label
    expect(screen.getByLabelText("Difficulty 3 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Difficulty 2 of 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Difficulty 1 of 3")).toBeInTheDocument();
  });

  it("calls onSelectOpponent with baron_harkonnen when Baron card is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<OpponentSelect onSelectOpponent={handleSelect} />);
    await user.click(
      screen.getByRole("heading", { name: "Baron Harkonnen" }).closest("button")!,
    );

    expect(handleSelect).toHaveBeenCalledOnce();
    expect(handleSelect).toHaveBeenCalledWith("baron_harkonnen");
  });

  it("calls onSelectOpponent with reverend_mother when Reverend Mother card is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<OpponentSelect onSelectOpponent={handleSelect} />);
    await user.click(
      screen.getByRole("heading", { name: "Reverend Mother" }).closest("button")!,
    );

    expect(handleSelect).toHaveBeenCalledOnce();
    expect(handleSelect).toHaveBeenCalledWith("reverend_mother");
  });

  it("calls onSelectOpponent with stilgar when Stilgar card is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<OpponentSelect onSelectOpponent={handleSelect} />);
    await user.click(
      screen.getByRole("heading", { name: "Stilgar" }).closest("button")!,
    );

    expect(handleSelect).toHaveBeenCalledOnce();
    expect(handleSelect).toHaveBeenCalledWith("stilgar");
  });

  it("renders a faction icon (SVG) above each character name", () => {
    const { container } = render(<OpponentSelect onSelectOpponent={() => {}} />);
    const svgs = container.querySelectorAll("button svg[aria-hidden='true']");
    expect(svgs).toHaveLength(3);
  });

  it("renders difficulty dots instead of diamond symbols", () => {
    const { container } = render(<OpponentSelect onSelectOpponent={() => {}} />);
    const dots = container.querySelectorAll("span.rounded-full");
    // 3 cards × 3 dots = 9 total
    expect(dots).toHaveLength(9);
  });

  it("applies faction border color to each card", () => {
    const { container } = render(<OpponentSelect onSelectOpponent={() => {}} />);
    const buttons = container.querySelectorAll("button");
    for (const button of buttons) {
      expect(button.style.borderColor).toBeTruthy();
    }
  });
});

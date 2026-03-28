import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AttributionFooter } from "../src/components/attribution-footer";

describe("AttributionFooter", () => {
  it("renders the CC BY 3.0 attribution text", () => {
    render(<AttributionFooter />);
    expect(
      screen.getByText(/Game icons by/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/CC BY 3\.0/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Lorc, Delapouite, and Carl Olsen/),
    ).toBeInTheDocument();
  });

  it("renders a link to game-icons.net", () => {
    render(<AttributionFooter />);
    const link = screen.getByRole("link", { name: "game-icons.net" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://game-icons.net");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders as a footer element", () => {
    render(<AttributionFooter />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});

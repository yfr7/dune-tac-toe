import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AllSeeingEye } from "../AllSeeingEye";
import { HawkEmblem } from "../HawkEmblem";
import { PlainDagger } from "../PlainDagger";
import { SandSnake } from "../SandSnake";
import { SeaSerpent } from "../SeaSerpent";
import { SpiderAlt } from "../SpiderAlt";

const icons = [
  { name: "PlainDagger", Component: PlainDagger },
  { name: "SeaSerpent", Component: SeaSerpent },
  { name: "SpiderAlt", Component: SpiderAlt },
  { name: "AllSeeingEye", Component: AllSeeingEye },
  { name: "SandSnake", Component: SandSnake },
  { name: "HawkEmblem", Component: HawkEmblem },
];

describe("SVG Icon Components", () => {
  for (const { name, Component } of icons) {
    describe(name, () => {
      it("renders an SVG element", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });

      it("has aria-hidden='true' for accessibility", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("aria-hidden", "true");
      });

      it("uses currentColor for fill", () => {
        const { container } = render(<Component />);
        const path = container.querySelector("path");
        expect(path).toHaveAttribute("fill", "currentColor");
      });

      it("has a 512x512 viewBox", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("viewBox", "0 0 512 512");
      });

      it("passes through additional SVG props", () => {
        const { container } = render(
          <Component className="test-class" data-testid="icon" />,
        );
        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("test-class");
        expect(svg).toHaveAttribute("data-testid", "icon");
      });
    });
  }
});

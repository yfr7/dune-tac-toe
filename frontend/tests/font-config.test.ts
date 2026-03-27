import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("Font configuration", () => {
  const html = readFileSync(resolve(__dirname, "../index.html"), "utf-8");
  const css = readFileSync(resolve(__dirname, "../src/index.css"), "utf-8");

  it("includes Cormorant Garamond Google Fonts link with display=swap", () => {
    expect(html).toContain("fonts.googleapis.com");
    expect(html).toContain("Cormorant+Garamond");
    expect(html).toContain("display=swap");
  });

  it("includes font preconnect hints for Google Fonts", () => {
    expect(html).toContain('rel="preconnect"');
    expect(html).toContain("fonts.googleapis.com");
    expect(html).toContain("fonts.gstatic.com");
  });

  it("includes all required Cormorant Garamond weights (regular 400/600/700, italic 400/600)", () => {
    // Regular weights
    expect(html).toContain("0,400");
    expect(html).toContain("0,600");
    expect(html).toContain("0,700");
    // Italic weights
    expect(html).toContain("1,400");
    expect(html).toContain("1,600");
  });

  it("defines --font-display CSS custom property with Cormorant Garamond", () => {
    expect(css).toMatch(/--font-display:.*Cormorant Garamond/);
  });

  it("defines --font-body CSS custom property with Inter", () => {
    expect(css).toMatch(/--font-body:.*Inter/);
  });

  it("maps --font-display to Tailwind theme", () => {
    expect(css).toContain("--font-display: var(--font-display)");
  });
});

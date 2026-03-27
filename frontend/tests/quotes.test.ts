import { describe, expect, it } from "vitest";
import {
  FALLBACK_COMMENTARY,
  getCpuGameQuote,
  getHvhGameQuote,
} from "../src/data/quotes";
import type { CharacterId } from "../src/types";

const ALL_CHARACTERS: CharacterId[] = [
  "baron_harkonnen",
  "reverend_mother",
  "stilgar",
];
const ALL_OUTCOMES = ["human_wins", "cpu_wins", "draw"] as const;

describe("Game over quotes", () => {
  describe("getCpuGameQuote", () => {
    it.each(ALL_CHARACTERS)(
      "returns a non-empty string for all outcomes with %s",
      (characterId) => {
        for (const outcome of ALL_OUTCOMES) {
          const quote = getCpuGameQuote(characterId, outcome);
          expect(quote).toBeTruthy();
          expect(typeof quote).toBe("string");
          expect(quote.length).toBeGreaterThan(10);
        }
      },
    );

    it("returns distinct quotes for each character on the same outcome", () => {
      for (const outcome of ALL_OUTCOMES) {
        const quotes = ALL_CHARACTERS.map((c) =>
          getCpuGameQuote(c, outcome),
        );
        const unique = new Set(quotes);
        expect(unique.size).toBe(ALL_CHARACTERS.length);
      }
    });

    it("returns distinct quotes for different outcomes of the same character", () => {
      for (const characterId of ALL_CHARACTERS) {
        const quotes = ALL_OUTCOMES.map((o) =>
          getCpuGameQuote(characterId, o),
        );
        const unique = new Set(quotes);
        expect(unique.size).toBe(ALL_OUTCOMES.length);
      }
    });
  });

  describe("getHvhGameQuote", () => {
    it("returns a quote for X wins", () => {
      const quote = getHvhGameQuote("X");
      expect(quote).toBeTruthy();
      expect(typeof quote).toBe("string");
    });

    it("returns a quote for O wins", () => {
      const quote = getHvhGameQuote("O");
      expect(quote).toBeTruthy();
      expect(typeof quote).toBe("string");
    });

    it("returns a quote for draw (null winner)", () => {
      const quote = getHvhGameQuote(null);
      expect(quote).toBeTruthy();
      expect(typeof quote).toBe("string");
    });

    it("returns distinct quotes for X wins vs O wins", () => {
      expect(getHvhGameQuote("X")).not.toBe(getHvhGameQuote("O"));
    });
  });

  describe("FALLBACK_COMMENTARY", () => {
    it("is a non-empty string", () => {
      expect(FALLBACK_COMMENTARY).toBeTruthy();
      expect(typeof FALLBACK_COMMENTARY).toBe("string");
    });
  });
});

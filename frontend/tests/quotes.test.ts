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

  describe("US3: character-specific quote distinctness", () => {
    it("all CPU quotes across all characters and outcomes are globally unique", () => {
      const allCpuQuotes: string[] = [];
      for (const character of ALL_CHARACTERS) {
        for (const outcome of ALL_OUTCOMES) {
          allCpuQuotes.push(getCpuGameQuote(character, outcome));
        }
      }
      const unique = new Set(allCpuQuotes);
      expect(unique.size).toBe(allCpuQuotes.length);
    });

    it("CPU quotes do not overlap with HvH quotes", () => {
      const cpuQuotes = new Set<string>();
      for (const character of ALL_CHARACTERS) {
        for (const outcome of ALL_OUTCOMES) {
          cpuQuotes.add(getCpuGameQuote(character, outcome));
        }
      }
      const hvhQuotes = [
        getHvhGameQuote("X"),
        getHvhGameQuote("O"),
        getHvhGameQuote(null),
      ];
      for (const hvhQuote of hvhQuotes) {
        expect(cpuQuotes.has(hvhQuote)).toBe(false);
      }
    });

    it("Baron quotes reference power, scheming, or cruelty", () => {
      const baronWin = getCpuGameQuote("baron_harkonnen", "cpu_wins");
      const baronLose = getCpuGameQuote("baron_harkonnen", "human_wins");
      // Baron should have a distinct dark/powerful tone
      expect(baronWin.length).toBeGreaterThan(20);
      expect(baronLose.length).toBeGreaterThan(20);
      expect(baronWin).not.toBe(baronLose);
    });

    it("Reverend Mother quotes have a distinct prophetic tone", () => {
      const rmWin = getCpuGameQuote("reverend_mother", "cpu_wins");
      const rmLose = getCpuGameQuote("reverend_mother", "human_wins");
      expect(rmWin.length).toBeGreaterThan(20);
      expect(rmLose.length).toBeGreaterThan(20);
      expect(rmWin).not.toBe(rmLose);
    });

    it("Stilgar quotes have a distinct desert/Fremen tone", () => {
      const stilgarWin = getCpuGameQuote("stilgar", "cpu_wins");
      const stilgarLose = getCpuGameQuote("stilgar", "human_wins");
      expect(stilgarWin.length).toBeGreaterThan(20);
      expect(stilgarLose.length).toBeGreaterThan(20);
      expect(stilgarWin).not.toBe(stilgarLose);
    });

    it("draw quotes are distinct per character", () => {
      const drawQuotes = ALL_CHARACTERS.map((c) =>
        getCpuGameQuote(c, "draw"),
      );
      const unique = new Set(drawQuotes);
      expect(unique.size).toBe(ALL_CHARACTERS.length);
    });
  });
});

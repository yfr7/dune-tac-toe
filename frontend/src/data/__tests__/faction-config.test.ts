import { describe, expect, it } from 'vitest';
import { CPU_FACTIONS, getCpuFaction, PLAYER_FACTION } from '../faction-config';

describe('faction-config', () => {
  it('defines player faction with Atreides identity', () => {
    expect(PLAYER_FACTION.accentColor).toBe('var(--atreides-blue)');
    expect(PLAYER_FACTION.pieceIcon).toBe('PlainDagger');
    expect(PLAYER_FACTION.victoryTitle).toBe('House Atreides Triumphs!');
    expect(PLAYER_FACTION.cardIcon).toBeNull();
    expect(PLAYER_FACTION.interstitialQuote).toBeNull();
  });

  it('defines all three CPU factions', () => {
    expect(Object.keys(CPU_FACTIONS)).toEqual(['baron_harkonnen', 'reverend_mother', 'stilgar']);
  });

  it('gives each CPU faction a unique accent color', () => {
    const colors = Object.values(CPU_FACTIONS).map((f) => f.accentColor);
    expect(new Set(colors).size).toBe(3);
  });

  it('gives each CPU faction a unique card icon', () => {
    const icons = Object.values(CPU_FACTIONS).map((f) => f.cardIcon);
    expect(new Set(icons).size).toBe(3);
    for (const icon of icons) {
      expect(icon).not.toBeNull();
    }
  });

  it('gives all CPU factions the SeaSerpent piece icon', () => {
    for (const faction of Object.values(CPU_FACTIONS)) {
      expect(faction.pieceIcon).toBe('SeaSerpent');
    }
  });

  it('gives each CPU faction a unique victory title', () => {
    const titles = Object.values(CPU_FACTIONS).map((f) => f.victoryTitle);
    expect(new Set(titles).size).toBe(3);
  });

  it('gives each CPU faction an interstitial quote', () => {
    for (const faction of Object.values(CPU_FACTIONS)) {
      expect(faction.interstitialQuote).toBeTruthy();
    }
  });

  it('uses the same draw title for all factions', () => {
    const drawTitles = Object.values(CPU_FACTIONS).map((f) => f.drawTitle);
    expect(new Set(drawTitles).size).toBe(1);
    expect(drawTitles[0]).toBe('The Desert Claims All');
    expect(PLAYER_FACTION.drawTitle).toBe('The Desert Claims All');
  });

  it('getCpuFaction returns the correct faction', () => {
    expect(getCpuFaction('baron_harkonnen').turnText).toBe('Baron Harkonnen schemes...');
    expect(getCpuFaction('reverend_mother').turnText).toBe('The Reverend Mother contemplates...');
    expect(getCpuFaction('stilgar').turnText).toBe('Stilgar reads the sands...');
  });
});

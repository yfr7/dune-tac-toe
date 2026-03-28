import type { CharacterId } from '../types';

/**
 * Faction visual configuration for themed game experience.
 * Maps each character/faction to their accent colors, icon names,
 * turn text, victory titles, and interstitial quotes.
 *
 * Icon components are referenced by name (string) to avoid circular
 * imports — consumers resolve the actual component at render time.
 */

export interface FactionConfig {
  accentColor: string;
  pieceIcon: 'PlainDagger' | 'SeaSerpent';
  cardIcon: 'SpiderAlt' | 'AllSeeingEye' | 'SandSnake' | null;
  turnText: string;
  victoryTitle: string;
  interstitialQuote: string | null;
  drawTitle: string;
}

/** Player (House Atreides) faction config — not tied to a CharacterId. */
export const PLAYER_FACTION: FactionConfig = {
  accentColor: 'var(--atreides-blue)',
  pieceIcon: 'PlainDagger',
  cardIcon: null,
  turnText: 'House Atreides moves',
  victoryTitle: 'House Atreides Triumphs!',
  interstitialQuote: null,
  drawTitle: 'The Desert Claims All',
};

/** CPU opponent faction configs keyed by character ID. */
export const CPU_FACTIONS: Record<CharacterId, FactionConfig> = {
  baron_harkonnen: {
    accentColor: 'var(--deep-blue)',
    pieceIcon: 'SeaSerpent',
    cardIcon: 'SpiderAlt',
    turnText: 'Baron Harkonnen schemes...',
    victoryTitle: 'The Baron Prevails!',
    interstitialQuote: 'The Baron does not play games. He plays you.',
    drawTitle: 'The Desert Claims All',
  },
  reverend_mother: {
    accentColor: 'var(--gold)',
    pieceIcon: 'SeaSerpent',
    cardIcon: 'AllSeeingEye',
    turnText: 'The Reverend Mother contemplates...',
    victoryTitle: 'The Bene Gesserit See All!',
    interstitialQuote: 'The future is already written.',
    drawTitle: 'The Desert Claims All',
  },
  stilgar: {
    accentColor: 'var(--spice-orange)',
    pieceIcon: 'SeaSerpent',
    cardIcon: 'SandSnake',
    turnText: 'Stilgar reads the sands...',
    victoryTitle: 'The Desert Claims Victory!',
    interstitialQuote: 'The desert tests all who enter.',
    drawTitle: 'The Desert Claims All',
  },
};

/** Look up a CPU faction config by character ID. */
export function getCpuFaction(id: CharacterId): FactionConfig {
  return CPU_FACTIONS[id];
}

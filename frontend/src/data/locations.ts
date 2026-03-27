/**
 * Board location names mapped to grid positions.
 * Each cell on the 3x3 board represents a named Dune location.
 * See game-design.md for location lore and significance.
 */

export const BOARD_LOCATIONS: readonly [
  readonly [string, string, string],
  readonly [string, string, string],
  readonly [string, string, string],
] = [
  ['Arrakeen', 'Carthag', 'Giedi Prime'],
  ['Sietch Tabr', 'The Palace', 'Salusa Secundus'],
  ['Jacurutu', 'Tuono Basin', 'Heighliner'],
] as const;

/** Flat list of all location names in row-major order. */
export const ALL_LOCATIONS = BOARD_LOCATIONS.flat();

/** Get the location name for a given row and column. */
export function getLocationName(row: number, col: number): string {
  return BOARD_LOCATIONS[row][col];
}

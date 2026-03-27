import { describe, it, expect } from 'vitest';
import {
  BOARD_LOCATIONS,
  ALL_LOCATIONS,
  getLocationName,
} from '../src/data/locations';

describe('Board locations', () => {
  it('defines a 3x3 grid of location names', () => {
    expect(BOARD_LOCATIONS).toHaveLength(3);
    for (const row of BOARD_LOCATIONS) {
      expect(row).toHaveLength(3);
    }
  });

  it('has all 9 unique location names', () => {
    const unique = new Set(ALL_LOCATIONS);
    expect(unique.size).toBe(9);
  });

  it('places The Palace at center (1,1)', () => {
    expect(BOARD_LOCATIONS[1][1]).toBe('The Palace');
  });

  it('matches the spec grid layout', () => {
    expect(BOARD_LOCATIONS[0][0]).toBe('Arrakeen');
    expect(BOARD_LOCATIONS[0][1]).toBe('Carthag');
    expect(BOARD_LOCATIONS[0][2]).toBe('Giedi Prime');
    expect(BOARD_LOCATIONS[1][0]).toBe('Sietch Tabr');
    expect(BOARD_LOCATIONS[1][2]).toBe('Salusa Secundus');
    expect(BOARD_LOCATIONS[2][0]).toBe('Jacurutu');
    expect(BOARD_LOCATIONS[2][1]).toBe('Tuono Basin');
    expect(BOARD_LOCATIONS[2][2]).toBe('Heighliner');
  });

  it('ALL_LOCATIONS contains all 9 names in row-major order', () => {
    expect(ALL_LOCATIONS).toEqual([
      'Arrakeen',
      'Carthag',
      'Giedi Prime',
      'Sietch Tabr',
      'The Palace',
      'Salusa Secundus',
      'Jacurutu',
      'Tuono Basin',
      'Heighliner',
    ]);
  });

  it('getLocationName returns correct name for each position', () => {
    expect(getLocationName(0, 0)).toBe('Arrakeen');
    expect(getLocationName(1, 1)).toBe('The Palace');
    expect(getLocationName(2, 2)).toBe('Heighliner');
  });
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import { getPrice } from '../src/assets/data/getPrice.js';

describe('getPrice', () => {
  afterEach(() => vi.useRealTimers());

  const cases = [
    [0, 45],  // January
    [1, 42],  // February
    [2, 39],  // March
    [3, 36],  // April
    [4, 33],  // May
    [5, 30],  // June
    [6, 27],  // July
    [7, 24],  // August
    [8, 21],  // September
    [9, 18],  // October
    [10, 15], // November
    [11, 12], // December
  ];

  it.each(cases)('month index %i returns $%i', (monthIndex, expected) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, monthIndex, 15));
    expect(getPrice()).toBe(expected);
  });

  it('returns a number', () => {
    expect(typeof getPrice()).toBe('number');
  });

  it('returns a value in the valid range (12–45)', () => {
    const price = getPrice();
    expect(price).toBeGreaterThanOrEqual(12);
    expect(price).toBeLessThanOrEqual(45);
  });
});

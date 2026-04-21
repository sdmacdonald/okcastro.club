import { describe, it, expect, vi, afterEach } from 'vitest';
import { getMonth, getDateTime } from '../src/assets/data/getDate.js';

describe('getMonth', () => {
  afterEach(() => vi.useRealTimers());

  it('returns an object with value and month', () => {
    const result = getMonth();
    expect(result).toHaveProperty('value');
    expect(result).toHaveProperty('month');
  });

  it('value is 1-based (January = 1)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 0, 15)); // January
    expect(getMonth().value).toBe(1);
  });

  it('value is 12 in December', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 11, 15)); // December
    expect(getMonth().value).toBe(12);
  });

  it('month is a full month name string', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 3, 15)); // April
    expect(getMonth().month).toBe('April');
  });

  it('value is a number between 1 and 12', () => {
    const { value } = getMonth();
    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(12);
  });
});

describe('getDateTime', () => {
  it('returns a formatted string', () => {
    const result = getDateTime('2025-04-20T14:30:00');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the month name', () => {
    const result = getDateTime('2025-04-20T14:30:00');
    expect(result).toMatch(/April/);
  });
});

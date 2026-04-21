import { describe, it, expect } from 'vitest';
import { tables, text, monthOptions } from '../src/assets/data/observingTargets.js';

describe('monthOptions', () => {
  it('has 12 entries', () => {
    expect(monthOptions).toHaveLength(12);
  });

  it('starts with January (value 1)', () => {
    expect(monthOptions[0]).toEqual({ month: 'January', value: 1 });
  });

  it('ends with December (value 12)', () => {
    expect(monthOptions[11]).toEqual({ month: 'December', value: 12 });
  });

  it('values are sequential 1–12', () => {
    monthOptions.forEach((m, i) => expect(m.value).toBe(i + 1));
  });
});

describe('text (intro paragraphs)', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(text)).toBe(true);
    expect(text.length).toBeGreaterThan(0);
  });

  it('every item is a string or an html link object', () => {
    text.forEach((item) => {
      const valid = typeof item === 'string' || (typeof item === 'object' && typeof item.html === 'string');
      expect(valid).toBe(true);
    });
  });

  it('html link objects contain a valid href', () => {
    const links = text.filter((item) => typeof item === 'object');
    links.forEach((link) => {
      expect(link.html).toMatch(/href="https?:\/\//);
    });
  });
});

describe('tables', () => {
  it('has at least one table', () => {
    expect(tables.length).toBeGreaterThan(0);
  });

  it('every table has required fields', () => {
    tables.forEach((table) => {
      expect(table).toHaveProperty('id');
      expect(table).toHaveProperty('title');
      expect(table).toHaveProperty('description');
      expect(table).toHaveProperty('targets');
      expect(typeof table.id).toBe('string');
      expect(typeof table.title).toBe('string');
      expect(Array.isArray(table.description)).toBe(true);
      expect(Array.isArray(table.targets)).toBe(true);
    });
  });

  it('every target has the fields the table renders', () => {
    tables.forEach((table) => {
      table.targets.forEach((target) => {
        expect(target).toHaveProperty('id');
        expect(target).toHaveProperty('objecttype');
        expect(target).toHaveProperty('ra');
        expect(target).toHaveProperty('dec');
        expect(target).toHaveProperty('magnitude');
        expect(target).toHaveProperty('user_Month');
      });
    });
  });

  it('every target has a user_Month that is a number or empty string', () => {
    // Caldwell objects are southern-hemisphere and have user_Month = ''
    // One Double Star entry has user_Month = 0 (data entry gap in source data)
    tables.forEach((table) => {
      table.targets.forEach((target) => {
        const valid = typeof target.user_Month === 'number' || target.user_Month === '';
        expect(valid).toBe(true);
      });
    });
  });

  it('Messier table has targets for all 12 months', () => {
    const messier = tables.find((t) => t.id === 'messier');
    for (let m = 1; m <= 12; m++) {
      const count = messier.targets.filter((t) => t.user_Month === m).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it('description items are strings or html link objects', () => {
    tables.forEach((table) => {
      table.description.forEach((item) => {
        const valid = typeof item === 'string' || (typeof item === 'object' && typeof item.html === 'string');
        expect(valid).toBe(true);
      });
    });
  });

  it('contains a Messier table', () => {
    expect(tables.some((t) => t.id === 'messier')).toBe(true);
  });
});

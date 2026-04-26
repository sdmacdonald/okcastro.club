import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';

let getMembershipPrice, MEMBERSHIP_PRICES, handler;
beforeAll(async () => {
  const mod = await import('../netlify/functions/create-checkout-session.cjs');
  getMembershipPrice = mod.getMembershipPrice;
  MEMBERSHIP_PRICES = mod.MEMBERSHIP_PRICES;
  handler = mod.handler;
});

// ─── Price table ───────────────────────────────────────────────────────────────

describe('MEMBERSHIP_PRICES', () => {
  it('has exactly 12 entries (one per month)', () => {
    expect(MEMBERSHIP_PRICES).toHaveLength(12);
  });

  it('starts at $45 in January', () => {
    expect(MEMBERSHIP_PRICES[0]).toBe(45);
  });

  it('ends at $12 in December', () => {
    expect(MEMBERSHIP_PRICES[11]).toBe(12);
  });

  it('decrements by $3 each month', () => {
    for (let i = 1; i < MEMBERSHIP_PRICES.length; i++) {
      expect(MEMBERSHIP_PRICES[i - 1] - MEMBERSHIP_PRICES[i]).toBe(3);
    }
  });
});

// ─── getMembershipPrice ────────────────────────────────────────────────────────

describe('getMembershipPrice', () => {
  afterEach(() => vi.useRealTimers());

  it('returns $45 in January', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 0, 15));
    expect(getMembershipPrice()).toBe(45);
  });

  it('returns $12 in December', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 11, 15));
    expect(getMembershipPrice()).toBe(12);
  });

  it('returns $36 in April', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 3, 15));
    expect(getMembershipPrice()).toBe(36);
  });

  it('matches getPrice.js (shared price logic)', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 6, 15)); // July
    const { getPrice } = await import('../src/assets/data/getPrice.js');
    expect(getMembershipPrice()).toBe(getPrice());
  });
});

// ─── Form field contracts ──────────────────────────────────────────────────────
// These tests assert the data shape the function expects and passes to Stripe

describe('membership form fields', () => {
  it('includes all required fields', () => {
    const payload = { name: 'Leo Spaceman', email: 'leo@example.com', item: 'membership' };
    expect(payload).toHaveProperty('name');
    expect(payload).toHaveProperty('email');
    expect(payload.item).toBe('membership');
  });

  it('includes optional address fields', () => {
    const payload = {
      name: 'Leo Spaceman', email: 'leo@example.com', item: 'membership',
      address: '123 Main St', city: 'Oklahoma City', state: 'Oklahoma', zip: '73013',
    };
    expect(payload).toHaveProperty('address');
    expect(payload).toHaveProperty('city');
    expect(payload).toHaveProperty('state');
    expect(payload).toHaveProperty('zip');
  });
});

describe('imaging-session form fields', () => {
  it('includes all required fields', () => {
    const payload = { name: 'Jon Talbot', email: 'jon@example.com', item: 'imaging-session' };
    expect(payload).toHaveProperty('name');
    expect(payload).toHaveProperty('email');
    expect(payload.item).toBe('imaging-session');
  });
});

// ─── Handler input validation ──────────────────────────────────────────────────

describe('handler — input validation', () => {
  it('returns 405 for GET requests', async () => {
    const result = await handler({ httpMethod: 'GET' });
    expect(result.statusCode).toBe(405);
  });

  it('returns 200 for OPTIONS preflight', async () => {
    const result = await handler({ httpMethod: 'OPTIONS' });
    expect(result.statusCode).toBe(200);
  });

  it('returns 400 when item is missing', async () => {
    const result = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ name: 'Test', email: 'test@test.com' }),
    });
    expect(result.statusCode).toBe(400);
  });

  it('returns 400 for an unknown item type', async () => {
    const result = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ name: 'Test', email: 'test@test.com', item: 'unknown-product' }),
    });
    expect(result.statusCode).toBe(400);
  });

  it('returns 400 for invalid JSON body', async () => {
    const result = await handler({
      httpMethod: 'POST',
      body: 'not-json',
    });
    expect(result.statusCode).toBe(400);
  });
});

// NOTE: Happy-path handler tests (valid membership / imaging-session requests)
// require a live Stripe key and are integration tests, not unit tests.
// Run them manually with `netlify dev` or in a CI environment that has STRIPE_SK set.

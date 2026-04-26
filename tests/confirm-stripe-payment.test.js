import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

let handler, formatDollars, getRawBody, _clients;
let constructEvent, send;

beforeAll(async () => {
  const mod = await import('../netlify/functions/confirm-stripe-payment.cjs');
  handler = mod.handler;
  formatDollars = mod.formatDollars;
  getRawBody = mod.getRawBody;
  _clients = mod._clients;
});

beforeEach(() => {
  constructEvent = vi.fn();
  send = vi.fn();
  _clients.stripe = { webhooks: { constructEvent } };
  _clients.sgMail = { send, setApiKey: vi.fn() };
  vi.stubEnv('SENDGRID_FROM', 'from@example.com');
  vi.stubEnv('SENDGRID_BCC', 'bcc@example.com');
  vi.stubEnv('SENDGRID_FROM_OTSP', '');
  vi.stubEnv('SENDGRID_ERROR_RECIPIENT', '');
  vi.stubEnv('SENDGRID_MEMBERSHIP_TEMPLATE_ID', 'd-membership-test');
  vi.stubEnv('SENDGRID_IMAGING_TEMPLATE_ID', 'd-imaging-test');
});

function makeEvent({ httpMethod = 'POST', body = '{}', headers = { 'stripe-signature': 'sig' } } = {}) {
  return { httpMethod, body, headers };
}

function makeSucceededEvent(metadata) {
  return {
    type: 'payment_intent.succeeded',
    data: { object: { metadata } },
  };
}

describe('handler — request shape', () => {
  it('returns 405 for non-POST methods', async () => {
    const result = await handler(makeEvent({ httpMethod: 'GET' }));
    expect(result.statusCode).toBe(405);
    expect(send).not.toHaveBeenCalled();
  });
});

describe('handler — signature verification', () => {
  it('returns 400 when signature verification throws', async () => {
    constructEvent.mockImplementation(() => { throw new Error('Invalid signature'); });
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(400);
    expect(result.body).toContain('Invalid signature');
    expect(send).not.toHaveBeenCalled();
  });

  it('does not notifyError on signature failure when SENDGRID_ERROR_RECIPIENT is unset', async () => {
    constructEvent.mockImplementation(() => { throw new Error('Bad sig'); });
    await handler(makeEvent());
    expect(send).not.toHaveBeenCalled();
  });

  it('notifyError sends an alert email on signature failure when SENDGRID_ERROR_RECIPIENT is set', async () => {
    vi.stubEnv('SENDGRID_ERROR_RECIPIENT', 'admin@example.com');
    constructEvent.mockImplementation(() => { throw new Error('Bad sig'); });
    send.mockResolvedValue();
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(400);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toMatchObject({
      to: 'admin@example.com',
      subject: '[OTSP] Webhook error',
    });
  });
});

describe('handler — event type filter', () => {
  it('ignores non-payment_intent.succeeded events with 200', async () => {
    constructEvent.mockReturnValue({ type: 'charge.succeeded' });
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it('ignores payment_intent.created with 200', async () => {
    constructEvent.mockReturnValue({ type: 'payment_intent.created' });
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });
});

describe('handler — metadata gating on payment_intent.succeeded', () => {
  it('skips send when metadata.email is missing', async () => {
    constructEvent.mockReturnValue(makeSucceededEvent({
      name: 'Leo', amount: '4500', item: 'membership',
    }));
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(200);
    expect(result.body).toContain('no email');
    expect(send).not.toHaveBeenCalled();
  });

  it('skips send when metadata.amount is missing', async () => {
    constructEvent.mockReturnValue(makeSucceededEvent({
      name: 'Leo', email: 'leo@example.com', item: 'membership',
    }));
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(200);
    expect(result.body).toContain('no amount');
    expect(send).not.toHaveBeenCalled();
  });

  it('skips send when metadata.amount is non-numeric', async () => {
    constructEvent.mockReturnValue(makeSucceededEvent({
      name: 'Leo', email: 'leo@example.com', amount: 'not-a-number', item: 'membership',
    }));
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(200);
    expect(result.body).toContain('no amount');
    expect(send).not.toHaveBeenCalled();
  });
});

describe('handler — template selection by item', () => {
  it('uses MEMBERSHIP template ID for item=membership', async () => {
    constructEvent.mockReturnValue(makeSucceededEvent({
      name: 'Leo', email: 'leo@example.com', amount: '3600', item: 'membership',
    }));
    send.mockResolvedValue();
    await handler(makeEvent());
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toMatchObject({
      to: 'leo@example.com',
      from: 'from@example.com',
      bcc: 'bcc@example.com',
      templateId: 'd-membership-test',
      dynamicTemplateData: { name: 'Leo', email: 'leo@example.com', item: 'membership', amount: '3600', dollars: '36.00' },
    });
  });

  it('uses IMAGING template ID for item=imaging-session', async () => {
    constructEvent.mockReturnValue(makeSucceededEvent({
      name: 'Jon', email: 'jon@example.com', amount: '10000', item: 'imaging-session',
    }));
    send.mockResolvedValue();
    await handler(makeEvent());
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toMatchObject({
      templateId: 'd-imaging-test',
      dynamicTemplateData: { item: 'imaging-session', dollars: '100.00' },
    });
  });

  it('imaging-session uses SENDGRID_FROM_OTSP when set', async () => {
    vi.stubEnv('SENDGRID_FROM_OTSP', 'okie-tex@example.com');
    constructEvent.mockReturnValue(makeSucceededEvent({
      name: 'Jon', email: 'jon@example.com', amount: '10000', item: 'imaging-session',
    }));
    send.mockResolvedValue();
    await handler(makeEvent());
    expect(send.mock.calls[0][0].from).toBe('okie-tex@example.com');
  });

  it('imaging-session falls back to SENDGRID_FROM when SENDGRID_FROM_OTSP is empty', async () => {
    constructEvent.mockReturnValue(makeSucceededEvent({
      name: 'Jon', email: 'jon@example.com', amount: '10000', item: 'imaging-session',
    }));
    send.mockResolvedValue();
    await handler(makeEvent());
    expect(send.mock.calls[0][0].from).toBe('from@example.com');
  });

  it('defaults to membership template for unknown items', async () => {
    constructEvent.mockReturnValue(makeSucceededEvent({
      name: 'Leo', email: 'leo@example.com', amount: '3600', item: 'unknown-item',
    }));
    send.mockResolvedValue();
    await handler(makeEvent());
    expect(send.mock.calls[0][0].templateId).toBe('d-membership-test');
  });
});

describe('handler — SendGrid failure', () => {
  it('still returns 200 when SendGrid throws (acks the webhook)', async () => {
    constructEvent.mockReturnValue(makeSucceededEvent({
      name: 'Leo', email: 'leo@example.com', amount: '3600', item: 'membership',
    }));
    send.mockRejectedValue(Object.assign(new Error('Bad Request'), {
      response: { body: { errors: [{ message: 'Template not found' }] } },
    }));
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(200);
  });

  it('notifyError sends an alert email on SendGrid failure when SENDGRID_ERROR_RECIPIENT is set', async () => {
    vi.stubEnv('SENDGRID_ERROR_RECIPIENT', 'admin@example.com');
    constructEvent.mockReturnValue(makeSucceededEvent({
      name: 'Leo', email: 'leo@example.com', amount: '3600', item: 'membership',
    }));
    send.mockRejectedValueOnce(new Error('first send fails'));
    send.mockResolvedValueOnce();
    await handler(makeEvent());
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[1][0]).toMatchObject({
      to: 'admin@example.com',
      subject: '[OTSP] Webhook error',
    });
  });
});

describe('formatDollars', () => {
  it('converts cents to a fixed-2 dollar string', () => {
    expect(formatDollars(3600)).toBe('36.00');
    expect(formatDollars(10000)).toBe('100.00');
    expect(formatDollars('4500')).toBe('45.00');
  });

  it('returns null for zero, negative, or non-numeric values', () => {
    expect(formatDollars(0)).toBeNull();
    expect(formatDollars(-100)).toBeNull();
    expect(formatDollars('abc')).toBeNull();
    expect(formatDollars(undefined)).toBeNull();
    expect(formatDollars(null)).toBeNull();
  });
});

describe('getRawBody', () => {
  it('returns the body verbatim when not base64-encoded', () => {
    expect(getRawBody({ body: 'plain text' })).toBe('plain text');
  });

  it('decodes base64 body when isBase64Encoded is true', () => {
    const encoded = Buffer.from('original payload', 'utf8').toString('base64');
    expect(getRawBody({ body: encoded, isBase64Encoded: true })).toBe('original payload');
  });

  it('returns null/undefined body unchanged', () => {
    expect(getRawBody({ body: null })).toBeNull();
    expect(getRawBody({ body: undefined })).toBeUndefined();
  });
});

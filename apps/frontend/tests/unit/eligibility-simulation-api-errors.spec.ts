import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from '../../src/routes/api/eligibility-simulations/+server';
import { PUT } from '../../src/routes/api/eligibility-simulations/[id]/+server';

vi.mock('$env/static/private', () => ({
  API_URL: 'http://backend.test',
  API_KEY: 'test-key',
}));

afterEach(() => vi.unstubAllGlobals());

describe.each([
  { method: 'POST', handler: POST, successStatus: 201 },
  { method: 'PUT', handler: PUT, successStatus: 200 },
])('$method eligibility simulation', ({ method, handler, successStatus }) => {
  const invoke = () =>
    handler({
      request: new Request('http://frontend.test/api/eligibility-simulations', {
        method,
        body: JSON.stringify({ householdSize: 2 }),
        headers: { 'content-type': 'application/json' },
      }),
      params: { id: 'simulation-1' },
    } as Parameters<typeof handler>[0]);

  it.each([
    { status: 404, message: 'Not Found', expected: 'Not Found' },
    {
      status: 400,
      message: ['Invalid email', 'Invalid household size'],
      expected: 'Invalid email, Invalid household size',
    },
    { status: 500, message: undefined, expected: 'Unexpected API error' },
    { status: 500, message: null, expected: 'Unexpected API error' },
    {
      status: 500,
      message: { detail: 'failure' },
      expected: 'Unexpected API error',
    },
  ])(
    'preserves status $status and handles message $message',
    async ({ status, message, expected }) => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(Response.json({ message }, { status })),
      );

      await expect(invoke()).rejects.toMatchObject({
        status,
        body: { message: expected },
      });
    },
  );

  it('returns successful API responses', async () => {
    const data = { id: 'simulation-1' };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json(data, { status: successStatus })),
    );

    expect(await (await invoke()).json()).toEqual(data);
  });
});

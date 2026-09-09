import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

const contextWithKey = (apiKey?: string, method = 'GET') =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ headers: { 'x-api-key': apiKey }, method }),
    }),
  }) as ExecutionContext;

describe('ApiKeyGuard', () => {
  const originalApiKey = process.env.API_KEY;

  beforeEach(() => {
    process.env.API_KEY = 'shared-secret';
  });

  afterAll(() => {
    process.env.API_KEY = originalApiKey;
  });

  const rateLimitService = { consume: jest.fn() };

  beforeEach(() => {
    rateLimitService.consume.mockReset();
  });

  it('accepts the configured API key', async () => {
    await expect(
      new ApiKeyGuard(rateLimitService as any).canActivate(
        contextWithKey('shared-secret'),
      ),
    ).resolves.toBe(true);
  });

  it('rejects keys of a different length without throwing a crypto error', async () => {
    await expect(
      new ApiKeyGuard(rateLimitService as any).canActivate(contextWithKey('x')),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rate limits writes using a fingerprint of the API key', async () => {
    const context = contextWithKey('shared-secret', 'POST');

    await new ApiKeyGuard(rateLimitService as any).canActivate(context);

    expect(rateLimitService.consume).toHaveBeenCalledWith(
      expect.stringMatching(/^api-write:[a-f0-9]{64}$/),
      120,
      60_000,
    );
  });
});

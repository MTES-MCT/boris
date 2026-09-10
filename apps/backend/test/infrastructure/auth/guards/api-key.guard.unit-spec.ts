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

  it('rejects a longer key that starts with the configured API key', async () => {
    await expect(
      new ApiKeyGuard(rateLimitService as any).canActivate(
        contextWithKey('shared-secret-attacker'),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rate limits writes without putting the API key in the quota key', async () => {
    const context = contextWithKey('shared-secret', 'POST');

    await new ApiKeyGuard(rateLimitService as any).canActivate(context);

    expect(rateLimitService.consume).toHaveBeenCalledWith(
      'api-write',
      120,
      60_000,
    );
  });
});

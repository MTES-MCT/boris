import { HttpStatus } from '@nestjs/common';
import { AuthRateLimitService } from 'src/infrastructure/auth/auth-rate-limit.service';

describe('AuthRateLimitService', () => {
  it('uses an atomic database upsert and accepts counts within the limit', async () => {
    const dataSource = { query: jest.fn().mockResolvedValue([{ count: 2 }]) };
    const service = new AuthRateLimitService(dataSource as any);

    await service.consume('login:ip:127.0.0.1', 5, 60_000);

    expect(dataSource.query).toHaveBeenCalledWith(
      expect.stringContaining('ON CONFLICT'),
      [expect.stringMatching(/^[a-f0-9]{64}$/), expect.any(Date)],
    );
  });

  it('rejects a count above the limit', async () => {
    const dataSource = { query: jest.fn().mockResolvedValue([{ count: 6 }]) };
    const service = new AuthRateLimitService(dataSource as any);

    await expect(
      service.consume('login:ip:127.0.0.1', 5, 60_000),
    ).rejects.toMatchObject({ status: HttpStatus.TOO_MANY_REQUESTS });
  });
});

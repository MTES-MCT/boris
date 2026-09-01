import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetPublicEligibilityStatisticsApiController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTestingApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('requires an API key', async () => {
    const { status } = await request(app.getHttpServer()).get(
      '/api/eligibility-simulations/public-statistics',
    );

    expect(status).toBe(401);
  });

  it('rejects malformed geographical filters', async () => {
    const { status } = await request(app.getHttpServer())
      .get(
        '/api/eligibility-simulations/public-statistics?departementCode=Paris',
      )
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });

  it('does not publish statistics for a guessed postal code with fewer than five simulations', async () => {
    const { status } = await request(app.getHttpServer())
      .get(
        '/api/eligibility-simulations/public-statistics?departementCode=75&postalCode=75999',
      )
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(404);
  });
});

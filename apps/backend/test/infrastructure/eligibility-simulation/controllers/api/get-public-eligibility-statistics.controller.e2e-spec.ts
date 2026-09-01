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

  it('returns the complete public statistics payload', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/eligibility-simulations/public-statistics')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toHaveProperty('totals.simulations');
    expect(body).toHaveProperty('totals.eligible');
    expect(body).toHaveProperty('totals.contactable');
    expect(body).toHaveProperty('regions');
    expect(body).toHaveProperty('zones');
    expect(body).toHaveProperty('householdSizes');
    expect(body).toHaveProperty('propertySituations');
    expect(body).toHaveProperty('incomeRanges');
    expect(body).toHaveProperty('employmentStatuses');
    expect(body).toHaveProperty('housingTypes');
    expect(body).toHaveProperty('brsKnowledge');
    expect(body).toHaveProperty('filters.departements');
  });
});

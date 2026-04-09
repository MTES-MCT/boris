import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetEligibilitySimulationsGroupedByEligibilityApiController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTestingApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should throw 401 if no api key is provided', async () => {
    const { status } = await request(app.getHttpServer()).get(
      '/api/eligibility-simulations/eligibility',
    );

    expect(status).toBe(401);
  });

  it('should return eligibility simulations grouped by eligibility', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/eligibility-simulations/eligibility')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toHaveProperty('data');
    expect(body.data).toStrictEqual(
      expect.arrayContaining([
        { eligibility: 'A_AND_ABIS', count: expect.any(String) },
        { eligibility: 'B1', count: expect.any(String) },
        { eligibility: 'B2_AND_C', count: expect.any(String) },
        { eligibility: 'NONE', count: expect.any(String) },
      ]),
    );
  });
});

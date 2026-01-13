import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetLandbotCustomersConversionFunnelController', () => {
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
      '/api/landbot-customers/conversion-funnel',
    );

    expect(status).toBe(401);
  });

  it('should return conversion funnel data', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/landbot-customers/conversion-funnel')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);

    expect(body).toHaveProperty('totalSimulations');
    expect(body).toHaveProperty('totalHouseholdProvided');
    expect(body).toHaveProperty('totalEligble');
    expect(body).toHaveProperty('totalConnectionWish');
    expect(body).toHaveProperty('totalEmailProvided');
    expect(body).toHaveProperty('totalDesiredCityProvided');

    expect(typeof body.totalSimulations).toBe('number');
    expect(typeof body.totalHouseholdProvided).toBe('number');
    expect(typeof body.totalEligble).toBe('number');
    expect(typeof body.totalConnectionWish).toBe('number');
    expect(typeof body.totalEmailProvided).toBe('number');
    expect(typeof body.totalDesiredCityProvided).toBe('number');
  });
});

import { INestApplication } from '@nestjs/common';
import { ConversionFunnelResult } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
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
    expect(body).toHaveProperty('data');

    const data: ConversionFunnelResult = body.data;

    expect(data).toHaveProperty('totalSimulations');
    expect(data).toHaveProperty('totalHouseholdProvided');
    expect(data).toHaveProperty('totalEligble');
    expect(data).toHaveProperty('totalConnectionWish');
    expect(data).toHaveProperty('totalEmailProvided');
    expect(data).toHaveProperty('totalDesiredCityProvided');

    expect(typeof data.totalSimulations).toBe('number');
    expect(typeof data.totalHouseholdProvided).toBe('number');
    expect(typeof data.totalEligble).toBe('number');
    expect(typeof data.totalConnectionWish).toBe('number');
    expect(typeof data.totalEmailProvided).toBe('number');
    expect(typeof data.totalDesiredCityProvided).toBe('number');
  });
});

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetAcquisitionSimulationConversionFunnelController', () => {
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
      '/api/acquisition-simulations/conversion-funnel',
    );

    expect(status).toBe(401);
  });

  it('should return conversion funnel data with correct structure', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/acquisition-simulations/conversion-funnel')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toHaveProperty('totalHouseInformations');
    expect(body).toHaveProperty('totalOwnContribution');
    expect(body).toHaveProperty('totalBuyingFees');
    expect(body).toHaveProperty('totalLoanInformations');
    expect(body).toHaveProperty('totalBrsHousingFees');
    expect(typeof body.totalHouseInformations).toBe('number');
    expect(typeof body.totalOwnContribution).toBe('number');
    expect(typeof body.totalBuyingFees).toBe('number');
    expect(typeof body.totalLoanInformations).toBe('number');
    expect(typeof body.totalBrsHousingFees).toBe('number');
  });
});

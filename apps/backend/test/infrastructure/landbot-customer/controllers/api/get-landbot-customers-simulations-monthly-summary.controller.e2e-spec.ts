import { INestApplication } from '@nestjs/common';
import { GroupSimulationsByYearAndMonthResult } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetLandbotCustomersSimulationsMonthlySummaryApiController', () => {
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
      '/api/landbot-customers/simulations/monthly-summary',
    );

    expect(status).toBe(401);
  });

  it('should return simulations grouped by year and month', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/landbot-customers/simulations/monthly-summary')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toHaveProperty('data');
    expect(body.data).toBeArray();

    body.data.forEach((item: GroupSimulationsByYearAndMonthResult) => {
      expect(item).toHaveProperty('year');
      expect(item).toHaveProperty('month');
      expect(item).toHaveProperty('count');

      expect(Number(item.year)).toBeNumber();
      expect(Number(item.month)).toBeNumber();
      expect(Number(item.count)).toBeNumber();
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { GroupByRegionsResult } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetLandbotCustomersGroupedByRegionsApiController', () => {
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
      '/api/landbot-customers/simulations/by-regions',
    );

    expect(status).toBe(401);
  });

  it('should return simulations grouped by regions', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/landbot-customers/simulations/by-regions')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('total');
    expect(body.data).toBeArray();
    expect(typeof body.total).toBe('number');

    body.data.forEach((item: GroupByRegionsResult) => {
      expect(item).toHaveProperty('regionName');
      expect(item).toHaveProperty('regionCode');
      expect(item).toHaveProperty('count');

      expect(typeof item.regionName).toBe('string');
      expect(typeof item.regionCode).toBe('string');
      expect(typeof item.count).toBe('string');
      expect(Number(item.count)).toBeNumber();
    });
  });
});

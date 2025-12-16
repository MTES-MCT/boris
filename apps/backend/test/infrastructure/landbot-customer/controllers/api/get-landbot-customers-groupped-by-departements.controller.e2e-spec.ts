import { INestApplication } from '@nestjs/common';
import { GroupByDepartementsResult } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetLandbotCustomersGrouppedByDepartementsApiController', () => {
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
      '/api/landbot-customers/simulations/by-departements',
    );

    expect(status).toBe(401);
  });

  it('should return simulations grouped by departements', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/landbot-customers/simulations/by-departements')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toHaveProperty('data');
    expect(body.data).toBeArray();

    body.data.forEach((item: GroupByDepartementsResult) => {
      expect(item).toHaveProperty('departementCode');
      expect(item).toHaveProperty('count');

      expect(typeof item.departementCode).toBe('string');
      expect(typeof item.count).toBe('string');
      expect(Number(item.count)).not.toBeNaN();
    });
  });
});

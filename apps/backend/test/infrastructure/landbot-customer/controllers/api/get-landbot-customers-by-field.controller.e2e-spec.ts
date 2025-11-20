import { INestApplication } from '@nestjs/common';

import {
  LandbotBrsKnowledge,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from 'src/domain/landbot-customer/landbot-customer.interface';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetLandbotCustomersByFieldApiController', () => {
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
      '/api/landbot-customers/eligibility',
    );

    expect(status).toBe(401);
  });

  it('should return landbot customers grouped by eligibility', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/landbot-customers/eligibility')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toHaveProperty('data');

    body.data.forEach(
      (item: { eligibility: LandbotEligibility | null; count: string }) => {
        expect(item).toMatchObject({
          eligibility: expect.any(String),
          count: expect.any(String),
        });
      },
    );
  });

  it('should return landbot customers grouped by brs knowledge', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/landbot-customers/brs-knowledge')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toHaveProperty('data');

    body.data.forEach(
      (item: { brsKnowledge: LandbotBrsKnowledge | null; count: string }) => {
        expect(item).toMatchObject({
          brsKnowledge: expect.any(String),
          count: expect.any(String),
        });
      },
    );
  });

  it('should return landbot customers grouped by real estate situation', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/landbot-customers/real-estate-situation')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toHaveProperty('data');

    body.data.forEach(
      (item: {
        realEstateSituation: LandbotRealEstateSituation | null;
        count: string;
      }) => {
        expect(item).toMatchObject({
          realEstateSituation: expect.any(String),
          count: expect.any(String),
        });
      },
    );
  });
});

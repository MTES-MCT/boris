import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('CreateEligibilitySimulationApiController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTestingApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should throw 401 if no api key is provided', async () => {
    const { status } = await request(app.getHttpServer()).post(
      '/api/eligibility-simulations',
    );

    expect(status).toBe(401);
  });

  it('should create an eligibility simulation', async () => {
    const { status, body } = await request(app.getHttpServer())
      .post('/api/eligibility-simulations')
      .send({
        householdSize: 2,
        hasDisability: false,
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(201);
    expect(body).toMatchObject({
      id: expect.any(String),
      householdSize: 2,
    });
  });

  it('should create an eligibility simulation with optional fields', async () => {
    const { status, body } = await request(app.getHttpServer())
      .post('/api/eligibility-simulations')
      .send({
        householdSize: 2,
        hasDisability: true,
        dependantsAmount: 1,
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(201);
    expect(body).toMatchObject({
      id: expect.any(String),
      householdSize: 2,
      dependantsAmount: 1,
    });
  });

  it('should throw a 400 when householdSize is missing', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/api/eligibility-simulations')
      .send({
        hasDisability: false,
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });

  it('should throw a 400 when householdSize is not a number', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/api/eligibility-simulations')
      .send({
        householdSize: 'not a number',
        hasDisability: false,
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });

  it('should throw a 400 when householdSize is zero', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/api/eligibility-simulations')
      .send({
        householdSize: 0,
        hasDisability: false,
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });

  it('should throw a 400 when householdSize is negative', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/api/eligibility-simulations')
      .send({
        householdSize: -1,
        hasDisability: false,
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });

  it('should throw a 400 when dependantsAmount is negative', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/api/eligibility-simulations')
      .send({
        householdSize: 2,
        hasDisability: false,
        dependantsAmount: -1,
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });
});

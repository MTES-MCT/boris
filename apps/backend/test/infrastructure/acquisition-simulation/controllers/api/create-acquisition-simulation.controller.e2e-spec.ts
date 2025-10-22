import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('CreateAcquisitionSimulationApiController', () => {
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
      '/api/acquisition-simulations',
    );

    expect(status).toBe(401);
  });

  it('should create an acquisition simulation', async () => {
    const { status, body } = await request(app.getHttpServer())
      .post('/api/acquisition-simulations')
      .send({
        housingPrice: 250000,
        brsZone: 'A',
        surface: 75,
        housingType: 'new',
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(201);
    expect(body).toMatchObject({
      id: expect.any(String),
      housingPrice: 250000,
      brsZone: 'A',
      surface: 75,
      housingType: 'new',
    });
  });

  it('should throw a 400 when housingprice is not a number', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/api/acquisition-simulations')
      .send({
        housingPrice: 'not a number',
        brsZone: 'A',
        surface: 75,
        housingType: 'new',
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });

  it('should throw a 400 when brsZone is not a valid brs zone', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/api/acquisition-simulations')
      .send({
        housingPrice: 250000,
        brsZone: 'invalid',
        surface: 75,
        housingType: 'new',
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });

  it('should throw a 400 when surface is not a number', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/api/acquisition-simulations')
      .send({
        housingPrice: 250000,
        brsZone: 'A',
        surface: 'not a number',
        housingType: 'new',
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });

  it('should throw a 400 when housingType is not a valid housing type', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/api/acquisition-simulations')
      .send({
        housingPrice: 250000,
        brsZone: 'A',
        surface: 75,
        housingType: 'invalid',
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });
});

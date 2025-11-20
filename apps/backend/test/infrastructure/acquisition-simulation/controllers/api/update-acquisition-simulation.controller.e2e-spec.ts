import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('UpdateAcquisitionSimulationApiController', () => {
  let app: INestApplication<App>;
  let resourceId: string;

  beforeAll(async () => {
    app = await setupTestingApp();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/api/acquisition-simulations')
      .send({
        housingPrice: 250000,
        brsZone: 'A',
        surface: 75,
        housingType: 'new',
      })
      .set('x-api-key', process.env.API_KEY as string);

    resourceId = body.id;

    await app.close();
  });

  beforeEach(async () => {
    app = await setupTestingApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should throw 401 if no api key is provided', async () => {
    const { status } = await request(app.getHttpServer()).put(
      `/api/acquisition-simulations/${resourceId}`,
    );

    expect(status).toBe(401);
  });

  it('should update an acquisition simulation', async () => {
    const { status, body } = await request(app.getHttpServer())
      .put(`/api/acquisition-simulations/${resourceId}`)
      .send({
        housingPrice: 300000,
        brsZone: 'B1',
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toMatchObject({
      id: resourceId,
      housingPrice: 300000,
      brsZone: 'B1',
      housingType: 'new',
    });
  });

  it('should throw a 400 when a field is not valid', async () => {
    const { status } = await request(app.getHttpServer())
      .put(`/api/acquisition-simulations/${resourceId}`)
      .send({
        brsZone: 'invalid',
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });
});

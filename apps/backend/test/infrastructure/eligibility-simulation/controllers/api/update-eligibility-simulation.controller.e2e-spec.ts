import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('UpdateEligibilitySimulationApiController', () => {
  let app: INestApplication<App>;
  let resourceId: string;

  beforeAll(async () => {
    app = await setupTestingApp();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/api/eligibility-simulations')
      .send({
        householdSize: 2,
        hasDisability: false,
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
      `/api/eligibility-simulations/${resourceId}`,
    );

    expect(status).toBe(401);
  });

  it('should update an eligibility simulation', async () => {
    const { status, body } = await request(app.getHttpServer())
      .put(`/api/eligibility-simulations/${resourceId}`)
      .send({
        propertySituation: 'PROPRIETAIRE',
        taxableIncome: 40000,
        firstName: 'Marie',
        lastName: 'Martin',
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toMatchObject({
      id: resourceId,
      propertySituation: 'PROPRIETAIRE',
      taxableIncome: 40000,
      firstName: 'Marie',
      lastName: 'Martin',
    });
  });

  it('should update only provided fields and keep existing values', async () => {
    const { status, body } = await request(app.getHttpServer())
      .put(`/api/eligibility-simulations/${resourceId}`)
      .send({
        email: 'updated@example.com',
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toMatchObject({
      id: resourceId,
      email: 'updated@example.com',
    });
  });

  it('should throw 404 when eligibility simulation does not exist', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';

    const { status } = await request(app.getHttpServer())
      .put(`/api/eligibility-simulations/${nonExistentId}`)
      .send({
        firstName: 'Jean',
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(404);
  });

  it('should throw 400 when a field is not valid', async () => {
    const { status } = await request(app.getHttpServer())
      .put(`/api/eligibility-simulations/${resourceId}`)
      .send({
        propertySituation: 'INVALID_VALUE',
      })
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });
});

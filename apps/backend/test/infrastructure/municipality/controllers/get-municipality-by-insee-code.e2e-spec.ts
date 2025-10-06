import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetMunicipalityByInseeCodeApiController', () => {
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
      `/api/municipalities/29232`,
    );

    expect(status).toBe(401);
  });

  it('should return a municipality', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get(`/api/municipalities/29232`)
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('inseeCode');
    expect(body).toHaveProperty('zone');
    expect(body).toHaveProperty('departement');

    expect(body).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      inseeCode: expect.any(String),
      zone: expect.any(String),
      departement: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        code: expect.any(String),
      }),
    });
  });
});

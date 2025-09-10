import { INestApplication } from '@nestjs/common';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetBrsDiffusionWebsitesByDepartementApiController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTestingApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should throw 401 if no api key is provided', async () => {
    const { body: brsDiffusionWebsites } = await request(app.getHttpServer())
      .get('/api/brs-diffusion-websites')
      .set('x-api-key', process.env.API_KEY as string);

    const departementId = brsDiffusionWebsites.items.find(
      (item: BrsDiffusionWebsiteView) => item.departement.name === 'Finistère',
    )?.departement.id;

    const { status } = await request(app.getHttpServer()).get(
      `/api/departements/${departementId}/brs-diffusion-websites`,
    );

    expect(status).toBe(401);
  });

  it('should return paginated brs diffusion websites by departement', async () => {
    const { body: brsDiffusionWebsites } = await request(app.getHttpServer())
      .get('/api/brs-diffusion-websites')
      .set('x-api-key', process.env.API_KEY as string);

    const departementId = brsDiffusionWebsites.items.find(
      (item: BrsDiffusionWebsiteView) => item.departement.name === 'Finistère',
    )?.departement.id;

    const { status, body } = await request(app.getHttpServer())
      .get(`/api/departements/${departementId}/brs-diffusion-websites`)
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toHaveProperty('items');
    expect(body).toHaveProperty('totalCount');
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('pageSize');
    expect(body).toHaveProperty('pagesCount');
    expect(body).toHaveProperty('hasPreviousPage');
    expect(body).toHaveProperty('hasNextPage');

    body.items.forEach((item: BrsDiffusionWebsiteView) => {
      expect(item).toMatchObject({
        id: expect.any(String),
        source: expect.any(String),
        distributorName: expect.any(String),
        ofsName: expect.any(String),
        city: expect.any(String),
        zipcode: expect.any(String),
        address: expect.any(String),
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        region: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
        departement: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          code: expect.any(String),
        }),
      });
    });
  });

  it('should throw a 400 when id query params is invalid', async () => {
    const { status } = await request(app.getHttpServer())
      .get('/api/departements/1/brs-diffusion-websites')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });
});

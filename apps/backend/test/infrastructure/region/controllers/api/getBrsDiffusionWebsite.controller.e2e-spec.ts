import { INestApplication } from '@nestjs/common';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetBrsDiffusionWebsitesByRegionApiController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTestingApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return paginated brs diffusion websites by region', async () => {
    const { body: brsDiffusionWebsites } = await request(
      app.getHttpServer(),
    ).get('/api/brs-diffusion-websites');

    const regionId = brsDiffusionWebsites.items.find(
      (item: BrsDiffusionWebsiteView) => item.region.name === 'Bretagne',
    )?.region.id;

    console.log(regionId);

    const { status, body } = await request(app.getHttpServer()).get(
      `/api/regions/${regionId}/brs-diffusion-websites`,
    );

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
    const { status } = await request(app.getHttpServer()).get(
      '/api/regions/1/brs-diffusion-websites',
    );

    expect(status).toBe(400);
  });
});

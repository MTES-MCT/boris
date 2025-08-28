import { INestApplication } from '@nestjs/common';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetBrsDiffusionWebsitesByBoundsApiController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTestingApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return paginated brs diffusion websites in certain bounds', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/api/brs-diffusion-websites-by-bounds?northEastLat=48.94956275956837&northEastLng=2.5299453735351567&southWestLat=48.75528339249263&southWestLng=2.1179580688476567',
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

  it('should throw a 400 when query params are missing', async () => {
    const { status } = await request(app.getHttpServer()).get(
      '/api/brs-diffusion-websites-by-bounds',
    );

    expect(status).toBe(400);
  });
});

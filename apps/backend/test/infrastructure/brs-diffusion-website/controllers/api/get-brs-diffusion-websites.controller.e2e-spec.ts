import { INestApplication } from '@nestjs/common';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetBrsDiffusionWebsitesApiController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTestingApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return paginated brs diffusion websites', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/api/brs-diffusion-websites',
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

  it('should return paginated brs diffusion websites', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/api/brs-diffusion-websites?latitude=48.85341&longitude=2.3488&radius=150',
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
        distance: expect.any(Number),
      });
    });
  });

  it('should retrieve first page of brs diffusion websites', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/api/brs-diffusion-websites?page=1&pageSize=10',
    );

    expect(status).toBe(200);
    expect(body).toHaveProperty('items');
    expect(body).toHaveProperty('totalCount');
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('pageSize');
    expect(body).toHaveProperty('pagesCount');
    expect(body).toHaveProperty('hasPreviousPage');
    expect(body).toHaveProperty('hasNextPage');

    expect(body.items.length).toBe(10);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(10);
    expect(body.hasPreviousPage).toBe(false);
    expect(body.hasNextPage).toBe(true);

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

  it('should throw a 400 when pagination query params are invalid', async () => {
    const { status } = await request(app.getHttpServer()).get(
      '/api/brs-diffusion-websites?page=deux',
    );

    expect(status).toBe(400);
  });
});

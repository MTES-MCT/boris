import { INestApplication } from '@nestjs/common';
import { OfsView } from 'src/application/ofs/views/ofs.view';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';

describe('GetOfssApiController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTestingApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should throw 401 if no api key is provided', async () => {
    const { status } = await request(app.getHttpServer()).get('/api/ofss');

    expect(status).toBe(401);
  });

  it('should return paginated ofss', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/ofss')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(200);
    expect(body).toHaveProperty('items');
    expect(body).toHaveProperty('totalCount');
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('pageSize');
    expect(body).toHaveProperty('pagesCount');
    expect(body).toHaveProperty('hasPreviousPage');
    expect(body).toHaveProperty('hasNextPage');

    body.items.forEach((item: OfsView) => {
      expect(item).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        departements: expect.any(Array),
        producesBrs: expect.toBeOneOf([expect.any(Boolean), null]),
        isPartner: expect.toBeOneOf([expect.any(Boolean), null]),
        regions: expect.any(Array),
        distributors: expect.any(Array),
        websiteUrl: expect.toBeOneOf([expect.any(String), null]),
        phone: expect.toBeOneOf([expect.any(String), null]),
        email: expect.toBeOneOf([expect.any(String), null]),
      });
    });
  });

  it('should retrieve first page of ofss', async () => {
    const { status, body } = await request(app.getHttpServer())
      .get('/api/ofss?page=1&pageSize=10')
      .set('x-api-key', process.env.API_KEY as string);

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

    body.items.forEach((item: OfsView) => {
      expect(item).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        departements: expect.any(Array),
        producesBrs: expect.toBeOneOf([expect.any(Boolean), null]),
        isPartner: expect.toBeOneOf([expect.any(Boolean), null]),
        regions: expect.any(Array),
        distributors: expect.any(Array),
        websiteUrl: expect.toBeOneOf([expect.any(String), null]),
        phone: expect.toBeOneOf([expect.any(String), null]),
        email: expect.toBeOneOf([expect.any(String), null]),
      });
    });
  });

  it('should throw a 400 when pagination query params are invalid', async () => {
    const { status } = await request(app.getHttpServer())
      .get('/api/ofss?page=deux')
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });
});

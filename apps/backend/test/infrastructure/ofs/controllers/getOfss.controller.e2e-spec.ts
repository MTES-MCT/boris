import { INestApplication } from '@nestjs/common';
import { OfsView } from 'src/application/ofs/views/ofs.view';
import { Pagination } from 'src/application/pagination/pagination';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTesingApp } from 'test/config/setup.e2e';
import { ofss } from 'test/mocks/e2e/ofs';

describe('GetOfssController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTesingApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should retrieve all ofss', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/api/ofss',
    );

    expect(status).toBe(200);
    expect(body).toMatchObject(ofss);
  });

  it('should retrieve first page of ofss', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/api/ofss?page=1&pageSize=1',
    );

    const paginatedOfss: Pagination<OfsView> = {
      ...ofss,
      items: expect.any(Array),
      totalCount: 2,
      page: 1,
      pageSize: 1,
      pagesCount: 2,
      hasPreviousPage: false,
      hasNextPage: true,
    };

    expect(status).toBe(200);
    expect(body).toMatchObject(paginatedOfss);
  });

  it('should retrieve last page of ofss', async () => {
    const { status, body } = await request(app.getHttpServer()).get(
      '/api/ofss?page=2&pageSize=1',
    );

    const paginatedOfss: Pagination<OfsView> = {
      ...ofss,
      items: expect.any(Array),
      totalCount: 2,
      page: 2,
      pageSize: 1,
      pagesCount: 2,
      hasPreviousPage: true,
      hasNextPage: false,
    };

    expect(status).toBe(200);
    expect(body).toMatchObject(paginatedOfss);
  });

  it('should throw a 400 when pagination query params are invalid', async () => {
    const { status } = await request(app.getHttpServer()).get(
      '/api/ofss?page=deux',
    );

    expect(status).toBe(400);
  });
});

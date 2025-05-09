import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';

describe('GetOfssController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  beforeEach(async () => {
    await app.close();
  });

  it('should retrieve all ofss', async () => {
    const { status } = await request(app.getHttpServer()).get('/api/ofss');

    expect(status).toBe(200);
    // expect(body).toMatchObject({ message: 'hello' });
  });

  it('should throw a 400 when pagination query params are invalid', async () => {
    const { status } = await request(app.getHttpServer()).get(
      '/api/ofss?page=deux',
    );

    expect(status).toBe(400);
  });
});

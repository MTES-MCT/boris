import { NestFactory } from '@nestjs/core';
import { OfsSeedModule } from './module';
import { OfsSeed } from './seed';

async function run() {
  const app = await NestFactory.create(OfsSeedModule);
  const seed = app.get(OfsSeed);

  await seed.seed();

  await app.close();
}

void run();

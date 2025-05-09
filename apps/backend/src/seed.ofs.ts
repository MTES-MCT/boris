import { NestFactory } from '@nestjs/core';
import { OfsSeedModule } from './infrastructure/persistence/seeds/ofs/module';
import { OfsSeed } from './infrastructure/persistence/seeds/ofs/seed';

async function run() {
  const app = await NestFactory.create(OfsSeedModule);
  const seed = app.get(OfsSeed);

  await seed.seed();

  await app.close();
}

void run();

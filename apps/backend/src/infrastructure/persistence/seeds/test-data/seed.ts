import { NestFactory } from '@nestjs/core';
import { TestDataSeedModule } from './module';
import { TestDataSeed } from './testDataSeed';

async function run() {
  const app = await NestFactory.create(TestDataSeedModule);
  const seed = app.get(TestDataSeed);

  await seed.seed();

  await app.close();
}

void run();

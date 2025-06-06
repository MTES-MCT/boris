import { NestFactory } from '@nestjs/core';
import { UserSeedModule } from './module';
import { UserSeed } from './seed';

async function run() {
  const app = await NestFactory.create(UserSeedModule);
  const seed = app.get(UserSeed);

  await seed.seed();

  await app.close();
}

void run();

import { NestFactory } from '@nestjs/core';
import { RegionsCodeSeedModule } from 'src/infrastructure/persistence/seeds/regions-code/module';
import { RegionsCodeSeed } from './seed';

async function run() {
  const app = await NestFactory.create(RegionsCodeSeedModule);
  const seed = app.get(RegionsCodeSeed);

  await seed.seed();

  await app.close();
}

void run();

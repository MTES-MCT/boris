import { NestFactory } from '@nestjs/core';
import { RegionsDepartementsSeedModule } from './module';
import { RegionsDepartementsSeed } from './seed';

async function run() {
  const app = await NestFactory.create(RegionsDepartementsSeedModule);
  const seed = app.get(RegionsDepartementsSeed);

  seed.seed();

  await app.close();
}

void run();

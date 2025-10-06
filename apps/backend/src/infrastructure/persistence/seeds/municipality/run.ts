import { NestFactory } from '@nestjs/core';
import { MunicipalitySeedModule } from './module';
import { MunicipalitySeed } from './seed';

async function run() {
  const app = await NestFactory.create(MunicipalitySeedModule);
  const seed = app.get(MunicipalitySeed);

  await seed.seed();

  await app.close();
}

void run();

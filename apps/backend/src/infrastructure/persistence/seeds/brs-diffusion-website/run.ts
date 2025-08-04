import { NestFactory } from '@nestjs/core';
import { BrsDiffusionWebsiteSeedModule } from './module';
import { BrsDiffusionWebsiteSeed } from './seed';

async function run() {
  const app = await NestFactory.create(BrsDiffusionWebsiteSeedModule);
  const seed = app.get(BrsDiffusionWebsiteSeed);

  await seed.seed();

  await app.close();
}

void run();

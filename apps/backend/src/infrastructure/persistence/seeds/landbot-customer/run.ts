import { NestFactory } from '@nestjs/core';
import { LandbotCustomerSeedModule } from './module';
import { LandbotCustomerSeed } from './seed';

async function run() {
  const app = await NestFactory.create(LandbotCustomerSeedModule);
  const seed = app.get(LandbotCustomerSeed);

  await seed.seed();

  await app.close();
}

void run();

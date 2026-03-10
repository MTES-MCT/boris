import { NestFactory } from '@nestjs/core';
import { EligibilitySimulationsSeedModule } from './module';
import { EligibilitySimulationsSeed } from './seed';

async function run() {
  const app = await NestFactory.create(EligibilitySimulationsSeedModule);
  const seed = app.get(EligibilitySimulationsSeed);

  await seed.seed();

  await app.close();
}

void run();

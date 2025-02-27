import { NestFactory } from '@nestjs/core';
import { RegionsDepartementsSeedModule } from 'src/infrastructure/persistence/seeds/regions-departements/module';
import { RegionsDepartementsSeed } from 'src/infrastructure/persistence/seeds/regions-departements/seed';

async function run() {
  const app = await NestFactory.create(RegionsDepartementsSeedModule);
  const seed = app.get(RegionsDepartementsSeed);

  await seed.seed();

  await app.close();
}

void run();

import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';
import { EligibilitySimulationEntity } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.entity';
import { LocationEntity } from 'src/infrastructure/location/location.entity';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';

describe('GetPublicEligibilityStatisticsApiController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTestingApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('requires an API key', async () => {
    const { status } = await request(app.getHttpServer()).get(
      '/api/eligibility-simulations/public-statistics',
    );

    expect(status).toBe(401);
  });

  it('returns public statistics when BRS knowledge data is available', async () => {
    const repository = app
      .get(DataSource)
      .getRepository(EligibilitySimulationEntity);
    const locationRepository = app
      .get(DataSource)
      .getRepository(LocationEntity);
    const departement = await app
      .get(DataSource)
      .getRepository(DepartementEntity)
      .findOneByOrFail({ code: '75' });
    const simulations = await repository.save(
      Array.from({ length: 5 }, (_, index) =>
        Object.assign(new EligibilitySimulationEntity(), {
          householdSize: 2,
          hadBrsKnowledge: index % 2 === 0,
          taxableIncome: 25000,
        }),
      ),
    );
    const locations = await locationRepository.save(
      simulations.map((simulation, index) =>
        Object.assign(new LocationEntity(), {
          postalCode: index % 2 === 0 ? '75001' : '75002',
          departement,
          eligibilitySimulation: simulation,
        }),
      ),
    );

    try {
      const { body, status } = await request(app.getHttpServer())
        .get(
          '/api/eligibility-simulations/public-statistics?departementCode=75',
        )
        .set('x-api-key', process.env.API_KEY as string);

      expect(status).toBe(200);
      expect(body.brsKnowledge).toBeArray();
      expect(body.topDepartements).toEqual([
        expect.objectContaining({ code: '75', label: 'Paris' }),
      ]);
      expect(body.topDepartements[0]).not.toHaveProperty('postalCode');
      expect(body.incomeRanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ label: '20k-30k' })]),
      );
    } finally {
      await locationRepository.delete(locations.map(({ id }) => id));
      await repository.delete(simulations.map(({ id }) => id));
    }
  });

  it('rejects malformed geographical filters', async () => {
    const { status } = await request(app.getHttpServer())
      .get(
        '/api/eligibility-simulations/public-statistics?departementCode=Paris',
      )
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(400);
  });

  it('does not publish statistics for a guessed postal code with fewer than five simulations', async () => {
    const { status } = await request(app.getHttpServer())
      .get(
        '/api/eligibility-simulations/public-statistics?departementCode=75&postalCode=75999',
      )
      .set('x-api-key', process.env.API_KEY as string);

    expect(status).toBe(404);
  });
});

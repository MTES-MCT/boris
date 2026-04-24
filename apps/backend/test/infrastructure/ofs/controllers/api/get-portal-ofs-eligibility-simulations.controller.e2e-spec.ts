import { INestApplication } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { setupTestingApp } from 'test/config/setup.e2e';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { EligibilitySimulationEntity } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.entity';
import { LocationEntity } from 'src/infrastructure/location/location.entity';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { SaveUserUseCase } from 'src/application/user/usecases/save.usecase';

describe('PortalOfssController eligibility simulations', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let ofsRepository: Repository<OfsEntity>;
  let eligibilitySimulationRepository: Repository<EligibilitySimulationEntity>;
  let locationRepository: Repository<LocationEntity>;
  let departementRepository: Repository<DepartementEntity>;
  let saveUserUsecase: SaveUserUseCase;

  beforeEach(async () => {
    app = await setupTestingApp();
    await app.init();

    dataSource = app.get(DataSource);
    ofsRepository = dataSource.getRepository(OfsEntity);
    eligibilitySimulationRepository = dataSource.getRepository(
      EligibilitySimulationEntity,
    );
    locationRepository = dataSource.getRepository(LocationEntity);
    departementRepository = dataSource.getRepository(DepartementEntity);
    saveUserUsecase = app.get(SaveUserUseCase);
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns only contact lines scoped to the requested ofs geography', async () => {
    const ofs = await ofsRepository.findOne({
      relations: ['departements', 'regions'],
      where: {},
      order: { createdAt: 'ASC' },
    });

    expect(ofs).toBeTruthy();
    expect(ofs?.departements.length || ofs?.regions.length).toBeGreaterThan(0);

    const matchingDepartement = ofs!.departements[0];
    const otherDepartement = await departementRepository
      .createQueryBuilder('departement')
      .leftJoinAndSelect('departement.region', 'region')
      .where('departement.id != :id', { id: matchingDepartement.id })
      .andWhere('region.id NOT IN (:...regionIds)', {
        regionIds: ofs!.regions.map((region) => region.id).length
          ? ofs!.regions.map((region) => region.id)
          : ['00000000-0000-0000-0000-000000000000'],
      })
      .getOne();

    expect(otherDepartement).toBeTruthy();

    const matchingSimulation = await eligibilitySimulationRepository.save(
      Object.assign(new EligibilitySimulationEntity(), {
        householdSize: 2,
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice@example.test',
        phone: '0102030405',
        contribution: 20000,
        resources: 3000,
        taxableIncome: 42000,
        propertySituation: 'LOCATAIRE_PRIVE',
        housingType: 'T3',
        hasDisability: false,
        hasRefusedConnection: false,
      }),
    );

    await locationRepository.save(
      Object.assign(new LocationEntity(), {
        city: 'Ville cible',
        citycode: '00001',
        label: 'Ville cible',
        postalCode: '75000',
        departement: matchingDepartement,
        eligibilitySimulation: matchingSimulation,
      }),
    );

    const otherSimulation = await eligibilitySimulationRepository.save(
      Object.assign(new EligibilitySimulationEntity(), {
        householdSize: 3,
        firstName: 'Bob',
        lastName: 'Durand',
        email: 'bob@example.test',
        phone: '0607080910',
        contribution: 10000,
        resources: 2500,
        taxableIncome: 35000,
        propertySituation: 'PROPRIETAIRE',
        housingType: 'T2',
        hasDisability: true,
        hasRefusedConnection: false,
      }),
    );

    await locationRepository.save(
      Object.assign(new LocationEntity(), {
        city: 'Ville hors périmètre',
        citycode: '99999',
        label: 'Ville hors périmètre',
        postalCode: '13000',
        departement: otherDepartement!,
        eligibilitySimulation: otherSimulation,
      }),
    );

    const agent = request.agent(app.getHttpServer());
    const adminEmail = `admin-${Date.now()}@example.test`;
    const adminPassword = 'passwordpassword';

    await saveUserUsecase.execute({
      email: adminEmail,
      password: adminPassword,
    });

    const loginResponse = await agent.post('/api/portal/auth/login').send({
      email: adminEmail,
      password: adminPassword,
    });

    expect(loginResponse.status).toBe(204);

    const { status, body } = await agent.get(
      `/api/portal/ofss/${ofs!.id}/eligibility-simulations?page=1&pageSize=20`,
    );

    expect(status).toBe(200);
    expect(body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          simulationId: matchingSimulation.id,
          email: 'alice@example.test',
          city: 'Ville cible',
          departementCode: matchingDepartement.code,
        }),
      ]),
    );
    expect(body.items).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          simulationId: otherSimulation.id,
        }),
      ]),
    );
  });
});

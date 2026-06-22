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
import {
  OfsEligibilitySimulationAction,
  OfsEligibilitySimulationEntity,
  OfsEligibilitySimulationStatus,
} from 'src/infrastructure/ofs/ofs-eligibility-simulation.entity';

describe('PortalOfssController eligibility simulations', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let ofsRepository: Repository<OfsEntity>;
  let eligibilitySimulationRepository: Repository<EligibilitySimulationEntity>;
  let locationRepository: Repository<LocationEntity>;
  let departementRepository: Repository<DepartementEntity>;
  let ofsEligibilitySimulationRepository: Repository<OfsEligibilitySimulationEntity>;
  let saveUserUsecase: SaveUserUseCase;

  beforeAll(async () => {
    app = await setupTestingApp();
    await app.init();

    dataSource = app.get(DataSource);
    ofsRepository = dataSource.getRepository(OfsEntity);
    eligibilitySimulationRepository = dataSource.getRepository(
      EligibilitySimulationEntity,
    );
    locationRepository = dataSource.getRepository(LocationEntity);
    departementRepository = dataSource.getRepository(DepartementEntity);
    ofsEligibilitySimulationRepository = dataSource.getRepository(
      OfsEligibilitySimulationEntity,
    );
    saveUserUsecase = app.get(SaveUserUseCase);
  });

  afterAll(async () => {
    await new Promise((resolve) => setImmediate(resolve));
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
    expect(ofs!.regions.length).toBeGreaterThan(0);

    const sameRegionOtherDepartement = await departementRepository
      .createQueryBuilder('departement')
      .leftJoinAndSelect('departement.region', 'region')
      .where('departement.id != :id', { id: matchingDepartement.id })
      .andWhere('region.id = :regionId', { regionId: ofs!.regions[0].id })
      .getOne();

    expect(sameRegionOtherDepartement).toBeTruthy();

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

    const sameRegionOtherDepartementSimulation =
      await eligibilitySimulationRepository.save(
        Object.assign(new EligibilitySimulationEntity(), {
          householdSize: 2,
          firstName: 'Romain',
          lastName: 'Legrand',
          email: 'romain@example.test',
          phone: '0102030406',
          contribution: 18000,
          resources: 2900,
          taxableIncome: 39000,
          propertySituation: 'LOCATAIRE_PRIVE',
          housingType: 'T3',
          hasDisability: false,
          hasRefusedConnection: false,
        }),
      );

    await locationRepository.save(
      Object.assign(new LocationEntity(), {
        city: 'Ville meme region',
        citycode: '00002',
        label: 'Ville meme region',
        postalCode: '56000',
        departement: sameRegionOtherDepartement!,
        eligibilitySimulation: sameRegionOtherDepartementSimulation,
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

    const adminEmail = `admin-${Date.now()}@example.test`;
    const adminPassword = 'passwordpassword';

    await saveUserUsecase.execute({
      email: adminEmail,
      password: adminPassword,
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/portal/auth/login')
      .send({
        email: adminEmail,
        password: adminPassword,
      });

    expect(loginResponse.status).toBe(204);
    const cookies = loginResponse.headers['set-cookie'];

    const { status, body } = await request(app.getHttpServer())
      .get(`/api/portal/ofss/${ofs!.id}/eligibility-simulations?page=1&pageSize=20`)
      .set('Cookie', cookies);

    expect(status).toBe(200);
    expect(body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          simulationId: matchingSimulation.id,
          email: 'alice@example.test',
          city: 'Ville cible',
          departementCode: matchingDepartement.code,
          action: null,
          status: null,
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
    expect(body.items).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          simulationId: sameRegionOtherDepartementSimulation.id,
        }),
      ]),
    );

    await expect(
      request(app.getHttpServer())
        .post('/api/portal/auth/logout')
        .set('Cookie', cookies),
    ).resolves.toMatchObject({ status: 204 });
  });

  it('updates metadata for an accessible simulation', async () => {
    const ofs = await ofsRepository.findOne({
      relations: ['departements', 'regions'],
      where: {},
      order: { createdAt: 'ASC' },
    });

    expect(ofs).toBeTruthy();

    const matchingDepartement = ofs!.departements[0];

    const simulation = await eligibilitySimulationRepository.save(
      Object.assign(new EligibilitySimulationEntity(), {
        householdSize: 2,
        firstName: 'Claire',
        lastName: 'Bernard',
        email: 'claire@example.test',
        phone: '0102030405',
        contribution: 15000,
        resources: 2800,
        taxableIncome: 38000,
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
        eligibilitySimulation: simulation,
      }),
    );

    const adminEmail = `admin-${Date.now()}@example.test`;
    const adminPassword = 'passwordpassword';

    await saveUserUsecase.execute({
      email: adminEmail,
      password: adminPassword,
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/portal/auth/login')
      .send({
        email: adminEmail,
        password: adminPassword,
      });

    expect(loginResponse.status).toBe(204);
    const cookies = loginResponse.headers['set-cookie'];

    const { status, body } = await request(app.getHttpServer())
      .put(`/api/portal/ofss/${ofs!.id}/eligibility-simulations/${simulation.id}/metadata`)
      .set('Cookie', cookies)
      .send({
        action: OfsEligibilitySimulationAction.RECONTACTED,
        status: OfsEligibilitySimulationStatus.EXCHANGE_IN_PROGRESS,
      });

    expect(status).toBe(200);
    expect(body).toEqual({
      simulationId: simulation.id,
      action: OfsEligibilitySimulationAction.RECONTACTED,
      status: OfsEligibilitySimulationStatus.EXCHANGE_IN_PROGRESS,
    });

    await expect(
      ofsEligibilitySimulationRepository.findOneBy({
        ofsId: ofs!.id,
        eligibilitySimulationId: simulation.id,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        ofsId: ofs!.id,
        eligibilitySimulationId: simulation.id,
        action: OfsEligibilitySimulationAction.RECONTACTED,
        status: OfsEligibilitySimulationStatus.EXCHANGE_IN_PROGRESS,
      }),
    );

    await expect(
      request(app.getHttpServer())
        .post('/api/portal/auth/logout')
        .set('Cookie', cookies),
    ).resolves.toMatchObject({ status: 204 });
  });

});

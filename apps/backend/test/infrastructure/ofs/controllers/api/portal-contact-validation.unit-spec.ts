import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'node:http';
import { Request, Response, NextFunction } from 'express';
import * as request from 'supertest';
import { PortalOfssController } from 'src/infrastructure/ofs/controllers/api/portal-ofss.controller';
import { EligibilitySimulationRepository } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.repository';
import { createValidationPipe } from 'src/infrastructure/config/validation-pipe.config';

describe('commercialisateur contact filter HTTP validation', () => {
  let app: INestApplication;
  const ofsId = '11111111-1111-4111-8111-111111111111';
  const repository = { findPortalContactsByDistributorScope: jest.fn() };

  beforeEach(async () => {
    repository.findPortalContactsByDistributorScope.mockResolvedValue([[], 0]);
    const module = await Test.createTestingModule({
      controllers: [PortalOfssController],
      providers: [
        { provide: EligibilitySimulationRepository, useValue: repository },
      ],
    })
      .useMocker(() => ({}))
      .compile();
    app = module.createNestApplication();
    app.use((req: Request, _res: Response, next: NextFunction) => {
      Object.assign(req, {
        isAuthenticated: () => true,
        user: {
          isActive: true,
          roles: ['commercialisateur'],
          distributor: { id: 'seller' },
        },
      });
      next();
    });
    app.useGlobalPipes(createValidationPipe());
    await app.listen(0, '127.0.0.1');
  });

  afterEach(async () => app.close());

  it('accepts the OFS selection and pagination sent by the portal', async () => {
    await request(app.getHttpServer() as Server)
      .get('/api/portal/ofss/commercialisateur/eligibility-simulations')
      .query({ page: '2', pageSize: '20', ofsId })
      .expect(200);
    expect(
      repository.findPortalContactsByDistributorScope,
    ).toHaveBeenCalledWith(
      { page: 2, pageSize: 20 },
      { distributorId: 'seller', ofsId },
    );
  });

  it('continues rejecting undeclared filter fields', async () => {
    await request(app.getHttpServer() as Server)
      .get('/api/portal/ofss/commercialisateur/eligibility-simulations')
      .query({ ofsId, admin: 'true' })
      .expect(400);
    expect(
      repository.findPortalContactsByDistributorScope,
    ).not.toHaveBeenCalled();
  });
});

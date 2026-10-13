import { Server } from 'node:http';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Request, Response, NextFunction } from 'express';
import { PortalProgramsController } from 'src/infrastructure/brs-diffusion-website/controllers/api/portal-programs.controller';
import { BrsDiffusionWebsiteEntity } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { CreateBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/create.usecase';
import { UpdateBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/update.usecase';
import { createValidationPipe } from 'src/infrastructure/config/validation-pipe.config';
import { UserRole } from 'src/domain/user/user-role.enum';

const ofsId = '11111111-1111-4111-8111-111111111111';
const otherOfsId = '22222222-2222-4222-8222-222222222222';
const programId = '33333333-3333-4333-8333-333333333333';
const distributorId = '44444444-4444-4444-8444-444444444444';
const url = `/api/portal/ofss/${ofsId}/programs`;
const payload = {
  programName: 'Les Jardins',
  source: 'https://example.fr/programme',
  address: '10 rue de Paris',
  city: 'Lyon',
};

describe('Portal programs HTTP access and validation', () => {
  let app: INestApplication;
  let roles: UserRole[];
  let attachedOfss: { id: string }[];
  let authenticated: boolean;
  let active: boolean;
  const programs = { find: jest.fn(), findOne: jest.fn(), update: jest.fn() };
  const ofss = { findOne: jest.fn() };
  const create = { execute: jest.fn() };
  const update = { execute: jest.fn() };

  beforeEach(async () => {
    roles = [UserRole.OFS];
    attachedOfss = [{ id: ofsId }, { id: otherOfsId }];
    authenticated = true;
    active = true;
    ofss.findOne.mockImplementation(({ where }) =>
      Promise.resolve({
        id: where.id,
        name: 'Mon OFS',
        distributors: [{ id: distributorId, name: 'Vendeur' }],
      }),
    );
    programs.find.mockResolvedValue([]);
    programs.findOne.mockResolvedValue({ id: programId, ...payload });
    programs.update.mockResolvedValue({ affected: 1 });
    create.execute.mockResolvedValue({ id: programId });
    update.execute.mockResolvedValue({ id: programId });
    const module = await Test.createTestingModule({
      controllers: [PortalProgramsController],
      providers: [
        { provide: getRepositoryToken(OfsEntity), useValue: ofss },
        {
          provide: getRepositoryToken(BrsDiffusionWebsiteEntity),
          useValue: programs,
        },
        { provide: CreateBrsDiffusionWebsiteUsecase, useValue: create },
        { provide: UpdateBrsDiffusionWebsiteUsecase, useValue: update },
      ],
    }).compile();
    app = module.createNestApplication();
    app.use((req: Request, _res: Response, next: NextFunction) => {
      Object.assign(req, {
        isAuthenticated: () => authenticated,
        user: { roles, ofss: attachedOfss, isActive: active },
      });
      next();
    });
    app.useGlobalPipes(createValidationPipe());
    await app.listen(0, '127.0.0.1');
  });

  afterEach(async () => app.close());

  it('creates for the selected OFS with new housing by default and its linked distributor', async () => {
    await request(app.getHttpServer() as Server)
      .post(url)
      .send({ ...payload, distributorId })
      .expect(201);
    expect(create.execute).toHaveBeenCalledWith({
      ...payload,
      housingType: 'new',
      ofsId,
      ofsName: 'Mon OFS',
      distributorId,
      distributorName: 'Vendeur',
      deliveryMonth: undefined,
      inseeCode: undefined,
    });
  });

  it('allows switching to another attached OFS by changing the selected route', async () => {
    await request(app.getHttpServer() as Server)
      .post(`/api/portal/ofss/${otherOfsId}/programs`)
      .send(payload)
      .expect(201);
    expect(create.execute).toHaveBeenCalledWith(
      expect.objectContaining({ ofsId: otherOfsId }),
    );
  });

  it.each([UserRole.DISTRIBUTOR, UserRole.ADMIN])(
    'denies role %s for all operations',
    async (role) => {
      roles = [role];
      await request(app.getHttpServer() as Server)
        .get(url)
        .expect(404);
      await request(app.getHttpServer() as Server)
        .get(`${url}/${programId}`)
        .expect(404);
      await request(app.getHttpServer() as Server)
        .post(url)
        .send(payload)
        .expect(404);
      await request(app.getHttpServer() as Server)
        .put(`${url}/${programId}`)
        .send(payload)
        .expect(404);
      await request(app.getHttpServer() as Server)
        .delete(`${url}/${programId}`)
        .expect(404);
      expect(ofss.findOne).not.toHaveBeenCalled();
      expect(create.execute).not.toHaveBeenCalled();
      expect(update.execute).not.toHaveBeenCalled();
      expect(programs.update).not.toHaveBeenCalled();
    },
  );

  it('denies access to an unattached OFS for all operations', async () => {
    attachedOfss = [{ id: otherOfsId }];
    await request(app.getHttpServer() as Server)
      .get(url)
      .expect(404);
    await request(app.getHttpServer() as Server)
      .get(`${url}/${programId}`)
      .expect(404);
    await request(app.getHttpServer() as Server)
      .post(url)
      .send(payload)
      .expect(404);
    await request(app.getHttpServer() as Server)
      .put(`${url}/${programId}`)
      .send(payload)
      .expect(404);
    await request(app.getHttpServer() as Server)
      .delete(`${url}/${programId}`)
      .expect(404);
    expect(programs.update).not.toHaveBeenCalled();
  });

  it('requires an active authenticated session', async () => {
    authenticated = false;
    await request(app.getHttpServer() as Server)
      .get(url)
      .expect(401);
    authenticated = true;
    active = false;
    await request(app.getHttpServer() as Server)
      .post(url)
      .send(payload)
      .expect(401);
  });

  it.each([
    { ofsId: otherOfsId },
    { isDeleted: true },
    { latitude: 0 },
    { ofsName: 'Autre OFS' },
  ])('rejects changing server-owned fields %j', async (extra) => {
    await request(app.getHttpServer() as Server)
      .post(url)
      .send({ ...payload, ...extra })
      .expect(400);
    await request(app.getHttpServer() as Server)
      .put(`${url}/${programId}`)
      .send({ ...payload, ...extra })
      .expect(400);
    expect(create.execute).not.toHaveBeenCalled();
    expect(update.execute).not.toHaveBeenCalled();
  });

  it.each([
    { programName: '   ' },
    { address: '' },
    { city: '' },
    { source: 'javascript:alert(1)' },
    { housingType: 'invalid' },
    { deliveryMonth: '2027-13' },
  ])('rejects invalid required fields %j', async (invalid) => {
    await request(app.getHttpServer() as Server)
      .post(url)
      .send({ ...payload, ...invalid })
      .expect(400);
    expect(create.execute).not.toHaveBeenCalled();
  });

  it('rejects a distributor not linked to the selected OFS', async () => {
    await request(app.getHttpServer() as Server)
      .post(url)
      .send({ ...payload, distributorId: otherOfsId })
      .expect(400);
    await request(app.getHttpServer() as Server)
      .put(`${url}/${programId}`)
      .send({ ...payload, distributorId: otherOfsId })
      .expect(400);
    expect(create.execute).not.toHaveBeenCalled();
    expect(update.execute).not.toHaveBeenCalled();
  });

  it('edits an existing program and clears optional fields', async () => {
    await request(app.getHttpServer() as Server)
      .put(`${url}/${programId}`)
      .send({
        ...payload,
        housingType: 'old',
        distributorId: '',
        deliveryMonth: '',
      })
      .expect(200);
    expect(programs.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: programId, ofs: { id: ofsId }, isDeleted: false },
      }),
    );
    expect(update.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        id: programId,
        ofsId,
        housingType: 'old',
        distributorId: null,
        deliveryMonth: undefined,
      }),
    );
  });

  it('excludes deleted programs and programs belonging to another OFS from detail, edit and deletion', async () => {
    programs.findOne.mockResolvedValue(null);
    await request(app.getHttpServer() as Server)
      .get(`${url}/${programId}`)
      .expect(404);
    await request(app.getHttpServer() as Server)
      .put(`${url}/${programId}`)
      .send(payload)
      .expect(404);
    await request(app.getHttpServer() as Server)
      .delete(`${url}/${programId}`)
      .expect(404);
    expect(programs.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: programId, ofs: { id: ofsId }, isDeleted: false },
      }),
    );
    expect(update.execute).not.toHaveBeenCalled();
    expect(programs.update).not.toHaveBeenCalled();
  });

  it('soft deletes instead of removing the program', async () => {
    await request(app.getHttpServer() as Server)
      .delete(`${url}/${programId}`)
      .expect(200);
    expect(programs.update).toHaveBeenCalledWith(
      { id: programId, ofs: { id: ofsId }, isDeleted: false },
      { isDeleted: true },
    );
  });

  it('lists only active programs linked to the selected OFS', async () => {
    const response = await request(app.getHttpServer() as Server)
      .get(url)
      .expect(200);
    expect(programs.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { ofs: { id: ofsId }, isDeleted: false },
      }),
    );
    expect(response.body.ofs.distributors).toEqual([
      { id: distributorId, name: 'Vendeur' },
    ]);
  });
});

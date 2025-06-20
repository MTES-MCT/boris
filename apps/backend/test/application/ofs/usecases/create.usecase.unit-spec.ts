import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOfsUsecase } from 'src/application/ofs/usecases/create.usecase';
import { OfsView } from 'src/application/ofs/views/ofs.view';
import {
  finistere,
  mockDepartementRepository,
  paris,
} from 'test/mocks/integration/departement';
import {
  distributor1,
  mockDistributorRepository,
} from 'test/mocks/integration/distributor';
import { mockOfsRepository, ofs1 } from 'test/mocks/integration/ofs';
import { bretagne, mockRegionRepository } from 'test/mocks/integration/region';

describe('CreateOfsUsecase', () => {
  let useCase: CreateOfsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOfsUsecase,
        {
          provide: 'OfsRepositoryInterface',
          useValue: mockOfsRepository,
        },
        {
          provide: 'RegionRepositoryInterface',
          useValue: mockRegionRepository,
        },
        {
          provide: 'DepartementRepositoryInterface',
          useValue: mockDepartementRepository,
        },
        {
          provide: 'DistributorRepositoryInterface',
          useValue: mockDistributorRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateOfsUsecase>(CreateOfsUsecase);
  });

  it('should create a new OFS and return its data', async () => {
    mockRegionRepository.findManyByNames.mockReturnValue([bretagne]);
    mockDepartementRepository.findManyByNames.mockReturnValue([
      finistere,
      paris,
    ]);
    mockDistributorRepository.findManyByIds.mockReturnValue([distributor1]);
    mockOfsRepository.save.mockReturnValue(ofs1);

    const expectedResult = new OfsView(
      ofs1.id,
      ofs1.name,
      ofs1.websiteUrl,
      ofs1.phone,
      ofs1.email,
      ofs1.departements.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
      })),
      ofs1.regions.map((r) => ({ id: r.id, name: r.name })),
      ofs1.distributors.map((d) => ({
        id: d.id,
        name: d.name,
      })),
    );

    const result = await useCase.execute({
      name: ofs1.name,
      phone: ofs1.phone || undefined,
      websiteUrl: ofs1.websiteUrl || undefined,
      email: ofs1.email || undefined,
      departementNames: ofs1.departements.map((d) => d.name),
      regionNames: ofs1.regions.map((r) => r.name),
      distributorIds: ofs1.distributors.map((d) => d.id),
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockRegionRepository.findManyByNames).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.findManyByNames).toHaveBeenCalledWith([
      'Bretagne',
    ]);
    expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledWith([
      'Finistère',
      'Paris',
    ]);
    expect(mockDistributorRepository.findManyByIds).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.findManyByIds).toHaveBeenCalledWith([
      distributor1.id,
    ]);
    expect(mockOfsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.save).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should create OFS with minimal data', async () => {
    const minimalOfs = {
      ...ofs1,
      phone: null,
      websiteUrl: null,
      email: null,
      departements: [],
      regions: [],
      distributors: [],
    };

    mockRegionRepository.findManyByNames.mockReturnValue([]);
    mockDepartementRepository.findManyByNames.mockReturnValue([]);
    mockDistributorRepository.findManyByIds.mockReturnValue([]);
    mockOfsRepository.save.mockReturnValue(minimalOfs);

    const expectedResult = new OfsView(
      minimalOfs.id,
      minimalOfs.name,
      minimalOfs.websiteUrl,
      minimalOfs.phone,
      minimalOfs.email,
      [],
      [],
      [],
    );

    const result = await useCase.execute({
      name: ofs1.name,
      phone: undefined,
      websiteUrl: undefined,
      email: undefined,
      departementNames: [],
      regionNames: [],
      distributorIds: [],
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockRegionRepository.findManyByNames).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.findManyByNames).toHaveBeenCalledWith([]);
    expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledWith([]);
    expect(mockDistributorRepository.findManyByIds).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.findManyByIds).toHaveBeenCalledWith([]);
    expect(mockOfsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.save).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should fail if a region does not exist', async () => {
    mockRegionRepository.findManyByNames.mockReturnValue([]);

    try {
      await useCase.execute({
        name: ofs1.name,
        phone: ofs1.phone || undefined,
        websiteUrl: ofs1.websiteUrl || undefined,
        email: ofs1.email || undefined,
        departementNames: ofs1.departements.map((d) => d.name),
        regionNames: ofs1.regions.map((r) => r.name),
        distributorIds: ofs1.distributors.map((d) => d.id),
      });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(mockRegionRepository.findManyByNames).toHaveBeenCalledTimes(1);
      expect(mockRegionRepository.findManyByNames).toHaveBeenCalledWith([
        'Bretagne',
      ]);
      expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledTimes(
        0,
      );
      expect(mockDistributorRepository.findManyByIds).toHaveBeenCalledTimes(0);
      expect(mockOfsRepository.save).toHaveBeenCalledTimes(0);
    }
  });

  it('should fail if a departement does not exist', async () => {
    mockRegionRepository.findManyByNames.mockReturnValue([bretagne]);
    mockDepartementRepository.findManyByNames.mockReturnValue([]);

    try {
      await useCase.execute({
        name: ofs1.name,
        phone: ofs1.phone || undefined,
        websiteUrl: ofs1.websiteUrl || undefined,
        email: ofs1.email || undefined,
        departementNames: ofs1.departements.map((d) => d.name),
        regionNames: ofs1.regions.map((r) => r.name),
        distributorIds: ofs1.distributors.map((d) => d.id),
      });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(mockRegionRepository.findManyByNames).toHaveBeenCalledTimes(1);
      expect(mockRegionRepository.findManyByNames).toHaveBeenCalledWith([
        'Bretagne',
      ]);
      expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledTimes(
        1,
      );
      expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledWith([
        'Finistère',
        'Paris',
      ]);
      expect(mockDistributorRepository.findManyByIds).toHaveBeenCalledTimes(0);
      expect(mockOfsRepository.save).toHaveBeenCalledTimes(0);
    }
  });

  it('should fail if a distributor does not exist', async () => {
    mockRegionRepository.findManyByNames.mockReturnValue([bretagne]);
    mockDepartementRepository.findManyByNames.mockReturnValue([
      finistere,
      paris,
    ]);
    mockDistributorRepository.findManyByIds.mockReturnValue([]);

    try {
      await useCase.execute({
        name: ofs1.name,
        phone: ofs1.phone || undefined,
        websiteUrl: ofs1.websiteUrl || undefined,
        email: ofs1.email || undefined,
        departementNames: ofs1.departements.map((d) => d.name),
        regionNames: ofs1.regions.map((r) => r.name),
        distributorIds: ofs1.distributors.map((d) => d.id),
      });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(mockRegionRepository.findManyByNames).toHaveBeenCalledTimes(1);
      expect(mockRegionRepository.findManyByNames).toHaveBeenCalledWith([
        'Bretagne',
      ]);
      expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledTimes(
        1,
      );
      expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledWith([
        'Finistère',
        'Paris',
      ]);
      expect(mockDistributorRepository.findManyByIds).toHaveBeenCalledTimes(1);
      expect(mockOfsRepository.save).toHaveBeenCalledTimes(0);
    }
  });

  it('should create OFS with null values for optional fields', async () => {
    const ofsWithNulls = {
      ...ofs1,
      phone: null,
      websiteUrl: null,
      email: null,
    };

    mockRegionRepository.findManyByNames.mockReturnValue([]);
    mockDepartementRepository.findManyByNames.mockReturnValue([]);
    mockDistributorRepository.findManyByIds.mockReturnValue([]);
    mockOfsRepository.save.mockReturnValue(ofsWithNulls);

    const expectedResult = new OfsView(
      ofsWithNulls.id,
      ofsWithNulls.name,
      ofsWithNulls.websiteUrl,
      ofsWithNulls.phone,
      ofsWithNulls.email,
      ofsWithNulls.departements.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
      })),
      ofsWithNulls.regions.map((r) => ({ id: r.id, name: r.name })),
      ofsWithNulls.distributors.map((d) => ({ id: d.id, name: d.name })),
    );

    const result = await useCase.execute({
      name: ofs1.name,
      phone: undefined,
      websiteUrl: undefined,
      email: undefined,
      departementNames: [],
      regionNames: [],
      distributorIds: [],
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockOfsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.save).toHaveBeenCalledWith(expect.any(Object));
  });
});

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateOfsUsecase } from 'src/application/ofs/usecases/update.usecase';
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

describe('UpdateOfsUsecase', () => {
  let useCase: UpdateOfsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOfsUsecase,
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

    useCase = module.get<UpdateOfsUsecase>(UpdateOfsUsecase);
  });

  it('should update an existing OFS and return its data', async () => {
    const updatedOfs = { ...ofs1, name: 'Updated OFS Name' };

    mockOfsRepository.findById.mockResolvedValue(ofs1);
    mockRegionRepository.findManyByNames.mockReturnValue([bretagne]);
    mockDepartementRepository.findManyByNames.mockReturnValue([
      finistere,
      paris,
    ]);
    mockDistributorRepository.findManyByIds.mockReturnValue([distributor1]);
    mockOfsRepository.save.mockResolvedValue(updatedOfs);

    const expectedResult = new OfsView(
      updatedOfs.id,
      updatedOfs.name,
      updatedOfs.websiteUrl,
      updatedOfs.phone,
      updatedOfs.email,
      updatedOfs.producesBrs,
      updatedOfs.departements.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
      })),
      updatedOfs.regions.map((r) => ({ id: r.id, name: r.name })),
      updatedOfs.distributors.map((d) => ({ id: d.id, name: d.name })),
    );

    const result = await useCase.execute({
      id: ofs1.id,
      name: 'Updated OFS Name',
      phone: ofs1.phone || undefined,
      websiteUrl: ofs1.websiteUrl || undefined,
      email: ofs1.email || undefined,
      departementNames: ofs1.departements.map((d) => d.name),
      regionNames: ofs1.regions.map((r) => r.name),
      distributorIds: ofs1.distributors.map((d) => d.id),
    });

    expect(result).toEqual(expectedResult);
    expect(mockOfsRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.findById).toHaveBeenCalledWith(ofs1.id);
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
    expect(mockOfsRepository.save).toHaveBeenCalledWith(ofs1);
  });

  it('should throw NotFoundException when OFS does not exist', async () => {
    mockOfsRepository.findById.mockResolvedValue(null);

    try {
      await useCase.execute({
        id: '1234',
        name: 'Updated OFS Name',
        phone: ofs1.phone || undefined,
        websiteUrl: ofs1.websiteUrl || undefined,
        email: ofs1.email || undefined,
        departementNames: ofs1.departements.map((d) => d.name),
        regionNames: ofs1.regions.map((r) => r.name),
        distributorIds: ofs1.distributors.map((d) => d.id),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(mockOfsRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockOfsRepository.findById).toHaveBeenCalledWith('1234');
      expect(mockOfsRepository.save).not.toHaveBeenCalled();
    }
  });

  it('should fail if a region does not exist', async () => {
    mockOfsRepository.findById.mockResolvedValue(ofs1);
    mockRegionRepository.findManyByNames.mockReturnValue([]);

    try {
      await useCase.execute({
        id: ofs1.id,
        name: 'Updated OFS Name',
        phone: ofs1.phone || undefined,
        websiteUrl: ofs1.websiteUrl || undefined,
        email: ofs1.email || undefined,
        departementNames: ofs1.departements.map((d) => d.name),
        regionNames: ofs1.regions.map((r) => r.name),
        distributorIds: ofs1.distributors.map((d) => d.id),
      });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(mockOfsRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockOfsRepository.findById).toHaveBeenCalledWith(ofs1.id);
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
    mockOfsRepository.findById.mockResolvedValue(ofs1);
    mockRegionRepository.findManyByNames.mockReturnValue([bretagne]);
    mockDepartementRepository.findManyByNames.mockReturnValue([]);

    try {
      await useCase.execute({
        id: ofs1.id,
        name: 'Updated OFS Name',
        phone: ofs1.phone || undefined,
        websiteUrl: ofs1.websiteUrl || undefined,
        email: ofs1.email || undefined,
        departementNames: ofs1.departements.map((d) => d.name),
        regionNames: ofs1.regions.map((r) => r.name),
        distributorIds: ofs1.distributors.map((d) => d.id),
      });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(mockOfsRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockOfsRepository.findById).toHaveBeenCalledWith(ofs1.id);
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
    mockOfsRepository.findById.mockResolvedValue(ofs1);
    mockRegionRepository.findManyByNames.mockReturnValue([bretagne]);
    mockDepartementRepository.findManyByNames.mockReturnValue([
      finistere,
      paris,
    ]);
    mockDistributorRepository.findManyByIds.mockReturnValue([]);

    try {
      await useCase.execute({
        id: ofs1.id,
        name: 'Updated OFS Name',
        phone: ofs1.phone || undefined,
        websiteUrl: ofs1.websiteUrl || undefined,
        email: ofs1.email || undefined,
        departementNames: ofs1.departements.map((d) => d.name),
        regionNames: ofs1.regions.map((r) => r.name),
        distributorIds: ofs1.distributors.map((d) => d.id),
      });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(mockOfsRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockOfsRepository.findById).toHaveBeenCalledWith(ofs1.id);
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

  it('should update OFS with null values for optional fields', async () => {
    const updatedOfs = {
      ...ofs1,
      name: 'Updated OFS Name',
      phone: null,
      websiteUrl: null,
      email: null,
    };

    mockOfsRepository.findById.mockResolvedValue(ofs1);
    mockRegionRepository.findManyByNames.mockReturnValue([]);
    mockDepartementRepository.findManyByNames.mockReturnValue([]);
    mockDistributorRepository.findManyByIds.mockReturnValue([]);
    mockOfsRepository.save.mockResolvedValue(updatedOfs);

    const expectedResult = new OfsView(
      updatedOfs.id,
      updatedOfs.name,
      updatedOfs.websiteUrl,
      updatedOfs.phone,
      updatedOfs.email,
      updatedOfs.producesBrs,
      updatedOfs.departements.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
      })),
      updatedOfs.regions.map((r) => ({ id: r.id, name: r.name })),
      updatedOfs.distributors.map((d) => ({ id: d.id, name: d.name })),
    );

    const result = await useCase.execute({
      id: ofs1.id,
      name: 'Updated OFS Name',
      phone: undefined,
      websiteUrl: undefined,
      email: undefined,
      departementNames: [],
      regionNames: [],
      distributorIds: [],
    });

    expect(result).toEqual(expectedResult);
    expect(mockOfsRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.findById).toHaveBeenCalledWith(ofs1.id);
    expect(mockOfsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.save).toHaveBeenCalledWith(ofs1);
  });
});

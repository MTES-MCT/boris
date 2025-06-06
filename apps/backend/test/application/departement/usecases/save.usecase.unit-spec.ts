import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SaveDepartementUsecase } from 'src/application/departement/usecases/save.usecase';
import { DepartementView } from 'src/application/departement/views/departement.view';
import {
  finistere,
  mockDepartementRepository,
} from 'test/mocks/integration/departement';
import { mockRegionRepository } from 'test/mocks/integration/region';

describe('SaveDepartementUsecase', () => {
  let useCase: SaveDepartementUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveDepartementUsecase,
        {
          provide: 'DepartementRepositoryInterface',
          useValue: mockDepartementRepository,
        },
        {
          provide: 'RegionRepositoryInterface',
          useValue: mockRegionRepository,
        },
      ],
    }).compile();

    useCase = module.get<SaveDepartementUsecase>(SaveDepartementUsecase);
  });

  it('should save a departement and return its data', async () => {
    mockDepartementRepository.save.mockReturnValue(finistere);
    mockDepartementRepository.findOneByName.mockReturnValue(null);
    mockDepartementRepository.findOneByCode.mockReturnValue(null);
    mockRegionRepository.findOneByName.mockReturnValue(finistere.region);

    const expectedResult = new DepartementView(
      finistere.id,
      finistere.name,
      finistere.code,
    );

    const result = await useCase.execute({
      name: finistere.name,
      code: finistere.code,
      regionName: finistere.region.name,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockDepartementRepository.findOneByName).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneByName).toHaveBeenCalledWith(
      finistere.name,
    );
    expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledWith(
      finistere.code,
    );
    expect(mockRegionRepository.findOneByName).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.findOneByName).toHaveBeenCalledWith(
      finistere.region.name,
    );
    expect(mockDepartementRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.save).toHaveBeenCalledWith(finistere);
  });

  it('should fail if a departement with the same name already exists', async () => {
    mockDepartementRepository.save.mockReturnValue(finistere);
    mockDepartementRepository.findOneByName.mockReturnValue(finistere);
    mockDepartementRepository.findOneByCode.mockReturnValue(null);
    mockRegionRepository.findOneByName.mockReturnValue(finistere.region);

    try {
      await useCase.execute({
        name: finistere.name,
        code: finistere.code,
        regionName: finistere.region.name,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledWith(
        finistere.name,
      );
      expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(0);
      expect(mockRegionRepository.findOneByName).toHaveBeenCalledTimes(0);
      expect(mockDepartementRepository.save).toHaveBeenCalledTimes(0);
    }
  });

  it('should fail if a departement with the same code already exists', async () => {
    mockDepartementRepository.save.mockReturnValue(finistere);
    mockDepartementRepository.findOneByName.mockReturnValue(null);
    mockDepartementRepository.findOneByCode.mockReturnValue(finistere);
    mockRegionRepository.findOneByName.mockReturnValue(finistere.region);

    try {
      await useCase.execute({
        name: finistere.name,
        code: finistere.code,
        regionName: finistere.region.name,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledWith(
        finistere.name,
      );
      expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledWith(
        finistere.code,
      );
      expect(mockRegionRepository.findOneByName).toHaveBeenCalledTimes(0);
      expect(mockDepartementRepository.save).toHaveBeenCalledTimes(0);
    }
  });

  it('should fail if the region does not exist', async () => {
    mockDepartementRepository.save.mockReturnValue(finistere);
    mockDepartementRepository.findOneByName.mockReturnValue(null);
    mockDepartementRepository.findOneByCode.mockReturnValue(null);
    mockRegionRepository.findOneByName.mockReturnValue(null);

    try {
      await useCase.execute({
        name: finistere.name,
        code: finistere.code,
        regionName: finistere.region.name,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledWith(
        finistere.name,
      );
      expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledWith(
        finistere.code,
      );
      expect(mockRegionRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockRegionRepository.findOneByName).toHaveBeenCalledWith(
        finistere.region.name,
      );
      expect(mockDepartementRepository.save).toHaveBeenCalledTimes(0);
    }
  });
});

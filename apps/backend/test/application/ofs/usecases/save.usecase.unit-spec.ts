import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SaveOfsUsecase } from 'src/application/ofs/usecases/save.usecase';
import {
  finistere,
  mockDepartementRepository,
  paris,
} from 'test/mocks/integration/departement';
import { mockOfsRepository, ofs1 } from 'test/mocks/integration/ofs';
import { bretagne, mockRegionRepository } from 'test/mocks/integration/region';

describe('SaveOfsUsecase', () => {
  let useCase: SaveOfsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveOfsUsecase,
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
      ],
    }).compile();

    useCase = module.get<SaveOfsUsecase>(SaveOfsUsecase);
  });

  it('should save an ofs and return its data', async () => {
    mockRegionRepository.findManyByNames.mockReturnValue([bretagne]);
    mockDepartementRepository.findManyByNames.mockReturnValue([
      finistere,
      paris,
    ]);
    mockOfsRepository.save.mockReturnValue(ofs1);

    const result = await useCase.execute(ofs1);

    expect(result).toMatchObject(ofs1);
    expect(mockRegionRepository.findManyByNames).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.findManyByNames).toHaveBeenCalledWith([
      'Bretagne',
    ]);
    expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledWith([
      'Finistère',
      'Paris',
    ]);
    expect(mockOfsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.save).toHaveBeenCalledWith(ofs1);
  });

  it('should fail if a region does not exist', async () => {
    mockRegionRepository.findManyByNames.mockReturnValue([]);

    try {
      await useCase.execute(ofs1);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(mockRegionRepository.findManyByNames).toHaveBeenCalledTimes(1);
      expect(mockRegionRepository.findManyByNames).toHaveBeenCalledWith([
        'Bretagne',
      ]);
      expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledTimes(
        0,
      );
      expect(mockOfsRepository.save).toHaveBeenCalledTimes(0);
    }
  });

  it('should fail if a departement does not exist', async () => {
    mockRegionRepository.findManyByNames.mockReturnValue([bretagne]);
    mockDepartementRepository.findManyByNames.mockReturnValue([]);

    try {
      await useCase.execute(ofs1);
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
      expect(mockOfsRepository.save).toHaveBeenCalledTimes(0);
    }
  });
});

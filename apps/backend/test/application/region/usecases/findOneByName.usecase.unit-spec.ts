import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FindOneRegionByNameUsecase } from 'src/application/region/usecases/findOneByName.usecase';
import { bretagne, mockRegionRepository } from 'test/mocks/region';

describe('FindOneRegionByNameUsecase', () => {
  let useCase: FindOneRegionByNameUsecase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneRegionByNameUsecase,
        {
          provide: 'RegionRepositoryInterface',
          useValue: mockRegionRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindOneRegionByNameUsecase>(
      FindOneRegionByNameUsecase,
    );
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should find a region according to its name', async () => {
    mockRegionRepository.findOneByName.mockResolvedValue(bretagne);

    const result = await useCase.execute(bretagne.name);

    expect(result).toMatchObject(bretagne);
    expect(mockRegionRepository.findOneByName).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.findOneByName).toHaveBeenCalledWith(
      bretagne.name,
    );
  });

  it('should throw a NotFoundException if the region does not exist', async () => {
    mockRegionRepository.findOneByName.mockResolvedValue(null);

    try {
      await useCase.execute(bretagne.name);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(mockRegionRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockRegionRepository.findOneByName).toHaveBeenCalledWith(
        bretagne.name,
      );
    }
  });
});

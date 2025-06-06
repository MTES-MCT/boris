import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FindOneRegionByNameUsecase } from 'src/application/region/usecases/findOneByName.usecase';
import { RegionView } from 'src/application/region/views/region.view';
import { bretagne, mockRegionRepository } from 'test/mocks/integration/region';

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

    const expectedResult = new RegionView(bretagne.id, bretagne.name);

    const result = await useCase.execute({ name: bretagne.name });

    expect(result).toMatchObject(expectedResult);
    expect(mockRegionRepository.findOneByName).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.findOneByName).toHaveBeenCalledWith(
      bretagne.name,
    );
  });

  it('should throw a NotFoundException if the region does not exist', async () => {
    mockRegionRepository.findOneByName.mockResolvedValue(null);

    try {
      await useCase.execute({ name: bretagne.name });
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(mockRegionRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockRegionRepository.findOneByName).toHaveBeenCalledWith(
        bretagne.name,
      );
    }
  });
});

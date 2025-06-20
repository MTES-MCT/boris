import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SaveRegionUsecase } from 'src/application/region/usecases/save.usecase';
import { RegionView } from 'src/application/region/views/region.view';
import { bretagne, mockRegionRepository } from 'test/mocks/integration/region';

describe('SaveRegionUsecase', () => {
  let useCase: SaveRegionUsecase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveRegionUsecase,
        {
          provide: 'RegionRepositoryInterface',
          useValue: mockRegionRepository,
        },
      ],
    }).compile();

    useCase = module.get<SaveRegionUsecase>(SaveRegionUsecase);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should save a region and return its data', async () => {
    mockRegionRepository.save.mockResolvedValue(bretagne);
    mockRegionRepository.findOneByName.mockResolvedValue(null);

    const expectedResult = new RegionView(bretagne.id, bretagne.name);

    const result = await useCase.execute({ name: bretagne.name });

    expect(result).toMatchObject(expectedResult);
    expect(mockRegionRepository.findOneByName).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.findOneByName).toHaveBeenCalledWith(
      bretagne.name,
    );
    expect(mockRegionRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.save).toHaveBeenCalledWith(bretagne);
  });

  it('should fail if a region with the same name already exists', async () => {
    mockRegionRepository.save.mockResolvedValue(bretagne);
    mockRegionRepository.findOneByName.mockResolvedValue(bretagne);

    try {
      await useCase.execute(bretagne);
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
      expect(mockRegionRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockRegionRepository.findOneByName).toHaveBeenCalledWith(
        bretagne.name,
      );
      expect(mockRegionRepository.save).toHaveBeenCalledTimes(0);
    }
  });
});

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateRegionUsecase } from 'src/application/region/usecases/update.usecase';
import { RegionView } from 'src/application/region/views/region.view';
import { bretagne, mockRegionRepository } from 'test/mocks/integration/region';

describe('UpdateRegionUsecase', () => {
  let useCase: UpdateRegionUsecase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateRegionUsecase,
        {
          provide: 'RegionRepositoryInterface',
          useValue: mockRegionRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateRegionUsecase>(UpdateRegionUsecase);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should update a region code and return its data', async () => {
    const updatedRegion = { ...bretagne, code: '53' };
    mockRegionRepository.findOneByName.mockResolvedValue(bretagne);
    mockRegionRepository.save.mockResolvedValue(updatedRegion);

    const expectedResult = new RegionView(updatedRegion.id, updatedRegion.name);

    const result = await useCase.execute({
      name: bretagne.name,
      code: '53',
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockRegionRepository.findOneByName).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.findOneByName).toHaveBeenCalledWith(
      bretagne.name,
    );
    expect(mockRegionRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.save).toHaveBeenCalledWith(updatedRegion);
    expect(updatedRegion.code).toBe('53');
  });

  it('should throw a NotFoundException if the region does not exist', async () => {
    mockRegionRepository.findOneByName.mockResolvedValue(null);

    try {
      await useCase.execute({ name: bretagne.name, code: '53' });
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('Region not found');
      expect(mockRegionRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockRegionRepository.findOneByName).toHaveBeenCalledWith(
        bretagne.name,
      );
      expect(mockRegionRepository.save).toHaveBeenCalledTimes(0);
    }
  });
});

import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SaveOfsUsecase } from 'src/application/ofs/save.use-case';
import { mockOfsRepository, ofs1 } from 'test/mocks/ofs';
import { bretagne, mockRegionRepository } from 'test/mocks/region';

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
      ],
    }).compile();

    useCase = module.get<SaveOfsUsecase>(SaveOfsUsecase);
  });

  it('should save an ofs and return its data', async () => {
    mockRegionRepository.findManyByNames.mockReturnValue([bretagne]);
    mockOfsRepository.save.mockReturnValue(ofs1);

    const result = await useCase.execute(ofs1);

    expect(result).toMatchObject(ofs1);
    expect(mockRegionRepository.findManyByNames).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.findManyByNames).toHaveBeenCalledWith([
      'Bretagne',
    ]);
    expect(mockOfsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.save).toHaveBeenCalledWith(ofs1);
  });

  it('should fail if a region does not exist', async () => {
    mockRegionRepository.findManyByNames.mockReturnValue([]);
    mockOfsRepository.save.mockReturnValue(ofs1);

    try {
      await useCase.execute(ofs1);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(mockRegionRepository.findManyByNames).toHaveBeenCalledTimes(1);
      expect(mockRegionRepository.findManyByNames).toHaveBeenCalledWith([
        'Bretagne',
      ]);
      expect(mockOfsRepository.save).toHaveBeenCalledTimes(0);
    }
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { RegionRepository } from 'src/infrastructure/region/region.repository';
import { bretagne, mockRegionRepository } from 'test/mocks/region';

describe('RegionRepository', () => {
  let regionRepository: RegionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegionRepository,
        {
          provide: getRepositoryToken(RegionEntity),
          useValue: mockRegionRepository,
        },
      ],
    }).compile();

    regionRepository = module.get<RegionRepository>(RegionRepository);
  });

  it('should save a region and return its data', async () => {
    mockRegionRepository.save.mockResolvedValue(bretagne);

    const result = await regionRepository.save(bretagne);

    expect(result).toMatchObject(bretagne);
    expect(mockRegionRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.save).toHaveBeenCalledWith(bretagne);
  });

  it('should find a region by name and return its data', async () => {
    mockRegionRepository.findOneBy.mockResolvedValue(bretagne);

    const result = await regionRepository.findOneByName('bretagne');

    expect(result).toMatchObject(bretagne);
    expect(mockRegionRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.findOneBy).toHaveBeenCalledWith({
      name: 'bretagne',
    });
  });
});

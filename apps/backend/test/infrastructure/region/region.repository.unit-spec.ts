import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { RegionRepository } from 'src/infrastructure/region/region.repository';
import { bretagne, ileDeFrance, mockRegionRepository } from 'test/mocks/region';
import { In } from 'typeorm';

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

    const result = await regionRepository.findOneByName('Bretagne');

    expect(result).toMatchObject(bretagne);
    expect(mockRegionRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.findOneBy).toHaveBeenCalledWith({
      name: 'Bretagne',
    });
  });

  it('should find regions by names', async () => {
    mockRegionRepository.findBy.mockResolvedValue([bretagne, ileDeFrance]);

    const result = await regionRepository.findManyByNames([
      'Bretagne',
      'Île de France',
    ]);

    expect(result).toMatchObject([bretagne, ileDeFrance]);
    expect(mockRegionRepository.findBy).toHaveBeenCalledTimes(1);
    expect(mockRegionRepository.findBy).toHaveBeenCalledWith({
      name: In(['Bretagne', 'Île de France']),
    });
  });
});

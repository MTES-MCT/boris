import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BrsDiffusionWebsiteEntity } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';
import { BrsDiffusionWebsiteRepository } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.repository';
import {
  mockedBrsDiffusionWebsite,
  mockedBrsDiffusionWebsiteRepository,
} from 'test/mocks/integration/brs-diffusion-website';

describe('BrsDiffusionWebsiteRepository', () => {
  let brsDiffusionWebsiteRepository: BrsDiffusionWebsiteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrsDiffusionWebsiteRepository,
        {
          provide: getRepositoryToken(BrsDiffusionWebsiteEntity),
          useValue: mockedBrsDiffusionWebsiteRepository,
        },
      ],
    }).compile();

    brsDiffusionWebsiteRepository = module.get<BrsDiffusionWebsiteRepository>(
      BrsDiffusionWebsiteRepository,
    );
  });

  it('should save a brs diffusion website and return its data', async () => {
    mockedBrsDiffusionWebsiteRepository.save.mockResolvedValue(
      mockedBrsDiffusionWebsite,
    );

    const result = await brsDiffusionWebsiteRepository.save(
      mockedBrsDiffusionWebsite,
    );

    expect(result).toMatchObject(mockedBrsDiffusionWebsite);
    expect(mockedBrsDiffusionWebsiteRepository.save).toHaveBeenCalledTimes(1);
    expect(mockedBrsDiffusionWebsiteRepository.save).toHaveBeenCalledWith(
      mockedBrsDiffusionWebsite,
    );
  });

  it('should find all brs diffusion websites', async () => {
    const mockQueryBuilder = {
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getManyAndCount: jest
        .fn()
        .mockResolvedValue([[mockedBrsDiffusionWebsite], 1]),
    };
    mockedBrsDiffusionWebsiteRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await brsDiffusionWebsiteRepository.findAll({
      page: 1,
      pageSize: 10,
    });

    expect(result).toEqual([[mockedBrsDiffusionWebsite], 1]);
    expect(
      mockedBrsDiffusionWebsiteRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('brs_diffusion_website');
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      'brs_diffusion_website.region',
      'region',
    );
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      'brs_diffusion_website.departement',
      'departement',
    );
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
      'brs_diffusion_website.createdAt',
      'DESC',
    );
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalledTimes(1);
  });

  it('should find a brs diffusion website by id', async () => {
    mockedBrsDiffusionWebsiteRepository.findOne.mockResolvedValue(
      mockedBrsDiffusionWebsite,
    );

    const result = await brsDiffusionWebsiteRepository.findById('1234');

    expect(result).toMatchObject(mockedBrsDiffusionWebsite);
    expect(mockedBrsDiffusionWebsiteRepository.findOne).toHaveBeenCalledTimes(
      1,
    );
    expect(mockedBrsDiffusionWebsiteRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1234' },
      relations: ['region', 'departement'],
    });
  });

  it('should delete a brs diffusion website', async () => {
    mockedBrsDiffusionWebsiteRepository.delete.mockResolvedValue({
      affected: 1,
    });

    await brsDiffusionWebsiteRepository.delete('1234');

    expect(mockedBrsDiffusionWebsiteRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockedBrsDiffusionWebsiteRepository.delete).toHaveBeenCalledWith(
      '1234',
    );
  });
});

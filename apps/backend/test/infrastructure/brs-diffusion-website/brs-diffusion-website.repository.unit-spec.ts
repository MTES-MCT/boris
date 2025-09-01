import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BrsDiffusionWebsiteEntity } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';
import { BrsDiffusionWebsiteRepository } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.repository';
import {
  mockedBrsDiffusionWebsite,
  mockedBrsDiffusionWebsiteRawWithDistance,
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

  it('should find all brs diffusion websites by location', async () => {
    const mockQueryBuilder = {
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(1),
      getRawAndEntities: jest.fn().mockResolvedValue({
        entities: [mockedBrsDiffusionWebsite],
        raw: [mockedBrsDiffusionWebsiteRawWithDistance],
      }),
    };

    mockedBrsDiffusionWebsiteRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const expectedResult = [
      [
        {
          ...mockedBrsDiffusionWebsite,
          distance: mockedBrsDiffusionWebsiteRawWithDistance.distance,
        },
      ],
      1,
    ];

    const result = await brsDiffusionWebsiteRepository.findAllByLocation(
      {
        page: 1,
        pageSize: 10,
      },
      48.292817,
      4.075149,
      150,
    );

    expect(result).toEqual(expectedResult);
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
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(
      'earth_distance(ll_to_earth(:latitude, :longitude), ll_to_earth(brs_diffusion_website.latitude, brs_diffusion_website.longitude))',
      'distance',
    );
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'earth_box(ll_to_earth(:latitude, :longitude), :radius) @> ll_to_earth(brs_diffusion_website.latitude, brs_diffusion_website.longitude)',
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'earth_distance(ll_to_earth(:latitude, :longitude), ll_to_earth(brs_diffusion_website.latitude, brs_diffusion_website.longitude)) < :radius',
    );
    expect(mockQueryBuilder.setParameters).toHaveBeenCalledWith({
      latitude: 48.292817,
      longitude: 4.075149,
      radius: 150000,
    });
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('distance', 'ASC');
    expect(mockQueryBuilder.getCount).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.getRawAndEntities).toHaveBeenCalledTimes(1);
  });

  it('should find all brs diffusion websites by bounds', async () => {
    const mockQueryBuilder = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest
        .fn()
        .mockResolvedValue([[mockedBrsDiffusionWebsite], 1]),
    };

    mockedBrsDiffusionWebsiteRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const expectedResult = [[mockedBrsDiffusionWebsite], 1];

    const result = await brsDiffusionWebsiteRepository.findAllByBounds(
      {
        page: 1,
        pageSize: 10,
      },
      48.292817,
      4.075149,
      48.292817,
      4.075149,
    );

    expect(result).toEqual(expectedResult);
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
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'll_to_earth(brs_diffusion_website.latitude, brs_diffusion_website.longitude) <@ earth_box(ll_to_earth(:southWestLat, :southWestLng), ll_to_earth(:northEastLat, :northEastLng))',
    );
    expect(mockQueryBuilder.setParameters).toHaveBeenCalledWith({
      northEastLat: 48.292817,
      northEastLng: 4.075149,
      southWestLat: 48.292817,
      southWestLng: 4.075149,
    });
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
      'brs_diffusion_website.createdAt',
      'DESC',
    );
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalledTimes(1);
  });

  it('should find all brs diffusion websites by region', async () => {
    const mockQueryBuilder = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest
        .fn()
        .mockResolvedValue([[mockedBrsDiffusionWebsite], 1]),
    };

    mockedBrsDiffusionWebsiteRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await brsDiffusionWebsiteRepository.findAllByRegion(
      {
        page: 1,
        pageSize: 10,
      },
      '1234',
    );

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
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'region.id = :regionId',
      { regionId: '1234' },
    );
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
      'brs_diffusion_website.createdAt',
      'DESC',
    );
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalledTimes(1);
  });

  it('should find all brs diffusion websites by departement', async () => {
    const mockQueryBuilder = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest
        .fn()
        .mockResolvedValue([[mockedBrsDiffusionWebsite], 1]),
    };

    mockedBrsDiffusionWebsiteRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await brsDiffusionWebsiteRepository.findAllByDepartement(
      {
        page: 1,
        pageSize: 10,
      },
      '1234',
    );

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
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'departement.id = :departementId',
      { departementId: '1234' },
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

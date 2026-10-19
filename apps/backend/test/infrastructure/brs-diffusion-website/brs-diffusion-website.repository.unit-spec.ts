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

  it('does not resurrect a program deleted while an edit was in progress', async () => {
    mockedBrsDiffusionWebsiteRepository.update.mockResolvedValue({
      affected: 0,
    });
    await expect(
      brsDiffusionWebsiteRepository.save({
        ...mockedBrsDiffusionWebsite,
        id: 'program-1',
        isDeleted: false,
      }),
    ).rejects.toThrow();
    expect(mockedBrsDiffusionWebsiteRepository.update).toHaveBeenCalledWith(
      { id: 'program-1', isDeleted: false },
      expect.not.objectContaining({ isDeleted: expect.anything() }),
    );
    expect(mockedBrsDiffusionWebsiteRepository.save).not.toHaveBeenCalled();
  });

  it('excludes deleted points from the nearest OFS search', async () => {
    const query = {
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      setParameters: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawAndEntities: jest.fn().mockResolvedValue({ entities: [], raw: [] }),
    };
    mockedBrsDiffusionWebsiteRepository.createQueryBuilder.mockReturnValue(
      query,
    );
    await brsDiffusionWebsiteRepository.findNearestOfssByLocation(48, 2, 50);
    expect(query.andWhere).toHaveBeenCalledWith(
      'brs_diffusion_website.isDeleted = false',
    );
  });

  it('should find all brs diffusion websites', async () => {
    const mockQueryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
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
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'brs_diffusion_website.isDeleted = false',
    );
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
      'brs_diffusion_website.createdAt',
      'DESC',
    );
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['  Lyon  ', '%Lyon%'],
    ['750', '%750%'],
    ['Habitat', '%Habitat%'],
    ['100%_\\', '%100\\%\\_\\\\%'],
  ])(
    'searches city, postal code and both seller fields for %s',
    async (search, pattern) => {
      const query = {
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      mockedBrsDiffusionWebsiteRepository.createQueryBuilder.mockReturnValue(
        query,
      );

      await brsDiffusionWebsiteRepository.findAll(
        { page: 2, pageSize: 10 },
        search,
      );

      expect(query.andWhere).toHaveBeenCalledWith(
        'brs_diffusion_website.isDeleted = false',
      );
      expect(query.andWhere).toHaveBeenCalledWith(
        '(brs_diffusion_website.city ILIKE :search OR brs_diffusion_website.zipcode ILIKE :search OR brs_diffusion_website.distributorName ILIKE :search OR distributor.name ILIKE :search)',
        { search: pattern },
      );
      expect(query.skip).toHaveBeenCalledWith(10);
      expect(query.take).toHaveBeenCalledWith(10);
    },
  );

  it('should find all brs diffusion websites by location', async () => {
    const mockQueryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
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
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'brs_diffusion_website.isDeleted = false',
    );
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('distance', 'ASC');
    expect(mockQueryBuilder.getCount).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.getRawAndEntities).toHaveBeenCalledTimes(1);
  });

  it('should find all brs diffusion websites by region', async () => {
    const mockQueryBuilder = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
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
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'brs_diffusion_website.isDeleted = false',
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
      andWhere: jest.fn().mockReturnThis(),
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
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'brs_diffusion_website.isDeleted = false',
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
      where: { id: '1234', isDeleted: false },
      relations: ['region', 'departement', 'ofs', 'distributor'],
    });
  });

  it('should delete a brs diffusion website', async () => {
    mockedBrsDiffusionWebsiteRepository.update.mockResolvedValue({
      affected: 1,
    });

    await brsDiffusionWebsiteRepository.delete('1234');

    expect(mockedBrsDiffusionWebsiteRepository.update).toHaveBeenCalledTimes(1);
    expect(mockedBrsDiffusionWebsiteRepository.update).toHaveBeenCalledWith(
      '1234',
      { isDeleted: true },
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LandbotCustomerEntity } from 'src/infrastructure/landbot-customer/landbot-customer.entity';
import { LandbotCustomerRepository } from 'src/infrastructure/landbot-customer/landbot-customer.repository';
import {
  mockedLandbotCustomer,
  mockLandbotCustomerRepository,
  mockGroupByEligibilityResults,
  mockGroupByBrsKnowledgeResults,
  mockGroupByRealEstateSituationResults,
  mockGroupSimulationsByYearAndMonthResults,
  mockGroupByDepartementsResults,
} from 'test/mocks/integration/landbot-customer';

describe('LandbotCustomerRepository', () => {
  let landbotCustomerRepository: LandbotCustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LandbotCustomerRepository,
        {
          provide: getRepositoryToken(LandbotCustomerEntity),
          useValue: mockLandbotCustomerRepository,
        },
      ],
    }).compile();

    landbotCustomerRepository = module.get<LandbotCustomerRepository>(
      LandbotCustomerRepository,
    );
  });

  it('should save a landbot customer and return its data', async () => {
    mockLandbotCustomerRepository.save.mockResolvedValue(mockedLandbotCustomer);

    const result = await landbotCustomerRepository.save(mockedLandbotCustomer);

    expect(result).toMatchObject(mockedLandbotCustomer);
    expect(mockLandbotCustomerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockLandbotCustomerRepository.save).toHaveBeenCalledWith(
      mockedLandbotCustomer,
    );
  });

  it('should find the last landbot customer by date and return its data', async () => {
    const mockQueryBuilder = {
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(mockedLandbotCustomer),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await landbotCustomerRepository.findLast();

    expect(result).toMatchObject(mockedLandbotCustomer);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('landbot_customer');
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
      'landbot_customer.date',
      'DESC',
    );
    expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
  });

  it('should return null when no landbot customer is found', async () => {
    const mockQueryBuilder = {
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await landbotCustomerRepository.findLast();

    expect(result).toBeNull();
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('landbot_customer');
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
      'landbot_customer.date',
      'DESC',
    );
    expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
  });

  it('should group by eligibility and return raw results', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(mockGroupByEligibilityResults),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await landbotCustomerRepository.groupByEligibility();

    expect(result).toEqual(mockGroupByEligibilityResults);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('landbot_customer');
    expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      'landbot_customer.eligibility',
      'eligibility',
    );
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(
      'COUNT(*)',
      'count',
    );
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith(
      'landbot_customer.eligibility',
    );
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });

  it('should group by brsKnowledge with where condition and return raw results', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(mockGroupByBrsKnowledgeResults),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await landbotCustomerRepository.groupByBrsKnowledge();

    expect(result).toEqual(mockGroupByBrsKnowledgeResults);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('landbot_customer');
    expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      'landbot_customer.brsKnowledge',
      'brsKnowledge',
    );
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(
      'COUNT(*)',
      'count',
    );
    expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'landbot_customer.desiredCity IS NOT NULL',
    );
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith(
      'landbot_customer.brsKnowledge',
    );
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });

  it('should group by realEstateSituation with where condition and return raw results', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest
        .fn()
        .mockResolvedValue(mockGroupByRealEstateSituationResults),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await landbotCustomerRepository.groupByRealEstateSituation();

    expect(result).toEqual(mockGroupByRealEstateSituationResults);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('landbot_customer');
    expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      'landbot_customer.realEstateSituation',
      'realEstateSituation',
    );
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(
      'COUNT(*)',
      'count',
    );
    expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'landbot_customer.desiredCity IS NOT NULL',
    );
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith(
      'landbot_customer.realEstateSituation',
    );
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });

  it('should group simulations by year and month and return raw results', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getRawMany: jest
        .fn()
        .mockResolvedValue(mockGroupSimulationsByYearAndMonthResults),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result =
      await landbotCustomerRepository.groupSimulationsByYearAndMonth();

    expect(result).toEqual(mockGroupSimulationsByYearAndMonthResults);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('landbot_customer');
    expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      'EXTRACT(YEAR FROM landbot_customer.date)',
      'year',
    );
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledTimes(2);
    expect(mockQueryBuilder.addSelect).toHaveBeenNthCalledWith(
      1,
      'EXTRACT(MONTH FROM landbot_customer.date)',
      'month',
    );
    expect(mockQueryBuilder.addSelect).toHaveBeenNthCalledWith(
      2,
      'COUNT(*)',
      'count',
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      "landbot_customer.eligibility in ('1', '2', '4')",
    );
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith(
      'EXTRACT(YEAR FROM landbot_customer.date)',
    );
    expect(mockQueryBuilder.addGroupBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.addGroupBy).toHaveBeenCalledWith(
      'EXTRACT(MONTH FROM landbot_customer.date)',
    );
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('year');
    expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith('month');
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no results are found for eligibility', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await landbotCustomerRepository.groupByEligibility();

    expect(result).toEqual([]);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('landbot_customer');
    expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      'landbot_customer.eligibility',
      'eligibility',
    );
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(
      'COUNT(*)',
      'count',
    );
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith(
      'landbot_customer.eligibility',
    );
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });

  it('should count simulations with eligibility 1, 2, or 4 for a given year and month and return the count', async () => {
    const expectedCount = 42;
    const year = 2024;
    const month = 3;
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(expectedCount),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await landbotCustomerRepository.countSimulations(
      year,
      month,
    );

    expect(result).toBe(expectedCount);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('landbot_customer');
    expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.select).toHaveBeenCalledWith('COUNT(*)', 'count');
    expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'EXTRACT(YEAR FROM landbot_customer.date) = :year',
      { year },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
    expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
      1,
      'EXTRACT(MONTH FROM landbot_customer.date) = :month',
      { month },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
      2,
      "landbot_customer.eligibility in ('1', '2', '4')",
    );
    expect(mockQueryBuilder.getCount).toHaveBeenCalledTimes(1);
  });

  it('should group by regions with joins and return results with total', async () => {
    const mockGroupByRegionsResults = [
      { regionName: 'Bretagne', regionCode: '53', count: '10' },
      { regionName: 'Île-de-France', regionCode: '11', count: '15' },
    ];
    const mockTotalResult = { count: '25' };
    const year = 2024;
    const month = 3;

    const mockQueryBuilderForResults = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(mockGroupByRegionsResults),
    };

    const mockQueryBuilderForTotal = {
      select: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue(mockTotalResult),
    };

    mockLandbotCustomerRepository.createQueryBuilder
      .mockReturnValueOnce(mockQueryBuilderForResults)
      .mockReturnValueOnce(mockQueryBuilderForTotal);

    const result = await landbotCustomerRepository.groupByRegions(year, month);

    expect(result).toEqual([mockGroupByRegionsResults, 25]);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenNthCalledWith(1, 'landbot_customer');
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenNthCalledWith(2, 'landbot_customer');

    expect(mockQueryBuilderForResults.select).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilderForResults.select).toHaveBeenCalledWith(
      'r.name',
      'regionName',
    );
    expect(mockQueryBuilderForResults.addSelect).toHaveBeenCalledTimes(2);
    expect(mockQueryBuilderForResults.addSelect).toHaveBeenNthCalledWith(
      1,
      'r.code',
      'regionCode',
    );
    expect(mockQueryBuilderForResults.addSelect).toHaveBeenNthCalledWith(
      2,
      'COUNT(*)',
      'count',
    );
    expect(mockQueryBuilderForResults.innerJoin).toHaveBeenCalledTimes(2);
    expect(mockQueryBuilderForResults.innerJoin).toHaveBeenNthCalledWith(
      1,
      'departement',
      'd',
      'd.id = landbot_customer.departementId',
    );
    expect(mockQueryBuilderForResults.innerJoin).toHaveBeenNthCalledWith(
      2,
      'region',
      'r',
      'r.id = d.regionId',
    );
    expect(mockQueryBuilderForResults.where).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilderForResults.where).toHaveBeenCalledWith(
      'landbot_customer.desiredCity IS NOT NULL',
    );
    expect(mockQueryBuilderForResults.andWhere).toHaveBeenCalledTimes(2);
    expect(mockQueryBuilderForResults.andWhere).toHaveBeenNthCalledWith(
      1,
      'EXTRACT(YEAR FROM landbot_customer.date) = :year',
      { year },
    );
    expect(mockQueryBuilderForResults.andWhere).toHaveBeenNthCalledWith(
      2,
      'EXTRACT(MONTH FROM landbot_customer.date) = :month',
      { month },
    );
    expect(mockQueryBuilderForResults.groupBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilderForResults.groupBy).toHaveBeenCalledWith('r.name');
    expect(mockQueryBuilderForResults.addGroupBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilderForResults.addGroupBy).toHaveBeenCalledWith(
      'r.code',
    );
    expect(mockQueryBuilderForResults.getRawMany).toHaveBeenCalledTimes(1);

    expect(mockQueryBuilderForTotal.select).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilderForTotal.select).toHaveBeenCalledWith(
      'COUNT(*)',
      'count',
    );
    expect(mockQueryBuilderForTotal.innerJoin).toHaveBeenCalledTimes(2);
    expect(mockQueryBuilderForTotal.innerJoin).toHaveBeenNthCalledWith(
      1,
      'departement',
      'd',
      'd.id = landbot_customer.departementId',
    );
    expect(mockQueryBuilderForTotal.innerJoin).toHaveBeenNthCalledWith(
      2,
      'region',
      'r',
      'r.id = d.regionId',
    );
    expect(mockQueryBuilderForTotal.where).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilderForTotal.where).toHaveBeenCalledWith(
      'landbot_customer.desiredCity IS NOT NULL',
    );
    expect(mockQueryBuilderForTotal.andWhere).toHaveBeenCalledTimes(2);
    expect(mockQueryBuilderForTotal.andWhere).toHaveBeenNthCalledWith(
      1,
      'EXTRACT(YEAR FROM landbot_customer.date) = :year',
      { year },
    );
    expect(mockQueryBuilderForTotal.andWhere).toHaveBeenNthCalledWith(
      2,
      'EXTRACT(MONTH FROM landbot_customer.date) = :month',
      { month },
    );
    expect(mockQueryBuilderForTotal.getRawOne).toHaveBeenCalledTimes(1);
  });

  it('should return empty array and 0 total when no results are found', async () => {
    const mockTotalResult = { count: '0' };
    const year = 2024;
    const month = 3;

    const mockQueryBuilderForResults = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    };

    const mockQueryBuilderForTotal = {
      select: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue(mockTotalResult),
    };

    mockLandbotCustomerRepository.createQueryBuilder
      .mockReturnValueOnce(mockQueryBuilderForResults)
      .mockReturnValueOnce(mockQueryBuilderForTotal);

    const result = await landbotCustomerRepository.groupByRegions(year, month);

    expect(result).toEqual([[], 0]);
    expect(mockQueryBuilderForResults.getRawMany).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilderForTotal.getRawOne).toHaveBeenCalledTimes(1);
  });

  it('should group by departements with inner join and where condition and return raw results', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(mockGroupByDepartementsResults),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await landbotCustomerRepository.groupByDepartements();

    expect(result).toEqual(mockGroupByDepartementsResults);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('landbot_customer');
    expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      'd.code',
      'departementCode',
    );
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(
      'COUNT(*)',
      'count',
    );
    expect(mockQueryBuilder.innerJoin).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith(
      'departement',
      'd',
      'd.id = landbot_customer.departementId',
    );
    expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'landbot_customer.desiredCity IS NOT NULL',
    );
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('d.code');
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no departements results are found', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await landbotCustomerRepository.groupByDepartements();

    expect(result).toEqual([]);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('landbot_customer');
    expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      'd.code',
      'departementCode',
    );
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(
      'COUNT(*)',
      'count',
    );
    expect(mockQueryBuilder.innerJoin).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.innerJoin).toHaveBeenCalledWith(
      'departement',
      'd',
      'd.id = landbot_customer.departementId',
    );
    expect(mockQueryBuilder.where).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'landbot_customer.desiredCity IS NOT NULL',
    );
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('d.code');
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });
});

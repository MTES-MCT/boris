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

  it('should count simulations with eligibility 1, 2, or 4 and return the count', async () => {
    const expectedCount = 42;
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(expectedCount),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await landbotCustomerRepository.countSimulations();

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
      "landbot_customer.eligibility = '1'",
    );
    expect(mockQueryBuilder.orWhere).toHaveBeenCalledTimes(2);
    expect(mockQueryBuilder.orWhere).toHaveBeenNthCalledWith(
      1,
      "landbot_customer.eligibility = '2'",
    );
    expect(mockQueryBuilder.orWhere).toHaveBeenNthCalledWith(
      2,
      "landbot_customer.eligibility = '4'",
    );
    expect(mockQueryBuilder.getCount).toHaveBeenCalledTimes(1);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LandbotCustomerEntity } from 'src/infrastructure/landbot-customer/landbot-customer.entity';
import { LandbotCustomerRepository } from 'src/infrastructure/landbot-customer/landbot-customer.repository';
import { LandbotCustomerInterface } from 'src/domain/landbot-customer/landbot-customer.interface';
import {
  mockedLandbotCustomer,
  mockLandbotCustomerRepository,
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
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
      'landbot_customer.date',
      'DESC',
    );
    expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
  });

  it('should group by a field and return raw results', async () => {
    const mockResults = [
      { realEstateSituation: "propriétaire d'un logement", count: '5' },
      { realEstateSituation: "locataire d'un logement privé", count: '3' },
      { realEstateSituation: null, count: '2' },
    ];

    const mockQueryBuilder = {
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(mockResults),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await landbotCustomerRepository.groupBy(
      'realEstateSituation',
    );

    expect(result).toEqual(mockResults);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('landbot_customer');
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith(
      'realEstateSituation',
    );
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });

  it('should group by a field with where conditions and return raw results', async () => {
    const mockResults = [
      { eligibility: '2', count: '10' },
      { eligibility: '3', count: '5' },
    ];

    const mockQueryBuilder = {
      groupBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(mockResults),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const whereConditions: [keyof LandbotCustomerInterface, string][] = [
      ['eligibility', 'value1'],
    ];

    const result = await landbotCustomerRepository.groupBy(
      'eligibility',
      whereConditions,
    );

    expect(result).toEqual(mockResults);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('landbot_customer');
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('eligibility');
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'landbot_customer.eligibility :value1',
      { column: 'eligibility', clause: 'value1' },
    );
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });

  it('should group by a field with multiple where conditions', async () => {
    const mockResults = [
      { brsKnowledge: 'Oui', count: '8' },
      { brsKnowledge: 'Non', count: '4' },
    ];

    const mockQueryBuilder = {
      groupBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(mockResults),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const whereConditions: [keyof LandbotCustomerInterface, string][] = [
      ['eligibility', 'value1'],
      ['brsKnowledge', 'value2'],
    ];

    const result = await landbotCustomerRepository.groupBy(
      'brsKnowledge',
      whereConditions,
    );

    expect(result).toEqual(mockResults);
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('brsKnowledge');
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
    expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
      1,
      'landbot_customer.eligibility :value1',
      { column: 'eligibility', clause: 'value1' },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
      2,
      'landbot_customer.brsKnowledge :value2',
      { column: 'brsKnowledge', clause: 'value2' },
    );
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no results are found', async () => {
    const mockQueryBuilder = {
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    };

    mockLandbotCustomerRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result = await landbotCustomerRepository.groupBy('desiredCity');

    expect(result).toEqual([]);
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('desiredCity');
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });
});

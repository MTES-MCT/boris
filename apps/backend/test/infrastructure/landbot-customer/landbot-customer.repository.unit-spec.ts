import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LandbotCustomerEntity } from 'src/infrastructure/landbot-customer/landbot-customer.entity';
import { LandbotCustomerRepository } from 'src/infrastructure/landbot-customer/landbot-customer.repository';
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
});

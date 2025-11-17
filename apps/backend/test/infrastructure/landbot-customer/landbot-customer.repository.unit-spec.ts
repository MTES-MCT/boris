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
    mockLandbotCustomerRepository.findOne.mockResolvedValue(
      mockedLandbotCustomer,
    );

    const result = await landbotCustomerRepository.findLast();

    expect(result).toMatchObject(mockedLandbotCustomer);
    expect(mockLandbotCustomerRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockLandbotCustomerRepository.findOne).toHaveBeenCalledWith({
      order: { date: 'DESC' },
    });
  });

  it('should return null when no landbot customer is found', async () => {
    mockLandbotCustomerRepository.findOne.mockResolvedValue(null);

    const result = await landbotCustomerRepository.findLast();

    expect(result).toBeNull();
    expect(mockLandbotCustomerRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockLandbotCustomerRepository.findOne).toHaveBeenCalledWith({
      order: { date: 'DESC' },
    });
  });
});

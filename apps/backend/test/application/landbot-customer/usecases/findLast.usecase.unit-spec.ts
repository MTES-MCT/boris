import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindLastLandbotCustomerUsecase } from 'src/application/landbot-customer/usecases/findLast.usecase';
import { LandbotCustomerView } from 'src/application/landbot-customer/views/landbot-customer.view';
import {
  mockedLandbotCustomer,
  mockLandbotCustomerRepository,
} from 'test/mocks/integration/landbot-customer';
import { finistere } from 'test/mocks/integration/departement';

describe('FindLastLandbotCustomerUsecase', () => {
  let useCase: FindLastLandbotCustomerUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindLastLandbotCustomerUsecase,
        {
          provide: 'LandbotCustomerRepositoryInterface',
          useValue: mockLandbotCustomerRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindLastLandbotCustomerUsecase>(
      FindLastLandbotCustomerUsecase,
    );
  });

  it('should find the last landbot customer and return its data', async () => {
    mockLandbotCustomerRepository.findLast.mockResolvedValue(
      mockedLandbotCustomer,
    );

    const expectedResult = new LandbotCustomerView(
      mockedLandbotCustomer.id,
      mockedLandbotCustomer.date,
      mockedLandbotCustomer.desiredCity,
      {
        id: finistere.id,
        name: finistere.name,
        code: finistere.code,
      },
      mockedLandbotCustomer.eligibility,
      mockedLandbotCustomer.brsKnowledge,
      mockedLandbotCustomer.realEstateSituation,
    );

    const result = await useCase.execute();

    expect(result).toMatchObject(expectedResult);
    expect(mockLandbotCustomerRepository.findLast).toHaveBeenCalledTimes(1);
    expect(mockLandbotCustomerRepository.findLast).toHaveBeenCalledWith();
  });

  it('should throw NotFoundException when no landbot customer is found', async () => {
    mockLandbotCustomerRepository.findLast.mockResolvedValue(null);

    try {
      await useCase.execute();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(mockLandbotCustomerRepository.findLast).toHaveBeenCalledTimes(1);
      expect(mockLandbotCustomerRepository.findLast).toHaveBeenCalledWith();
    }
  });

  it('should return landbot customer without departement when departement is undefined', async () => {
    const landbotCustomerWithoutDepartement = { ...mockedLandbotCustomer };
    landbotCustomerWithoutDepartement.departement = undefined;

    mockLandbotCustomerRepository.findLast.mockResolvedValue(
      landbotCustomerWithoutDepartement,
    );

    const expectedResult = new LandbotCustomerView(
      landbotCustomerWithoutDepartement.id,
      landbotCustomerWithoutDepartement.date,
      landbotCustomerWithoutDepartement.desiredCity,
      undefined,
      landbotCustomerWithoutDepartement.eligibility,
      landbotCustomerWithoutDepartement.brsKnowledge,
      landbotCustomerWithoutDepartement.realEstateSituation,
    );

    const result = await useCase.execute();

    expect(result).toMatchObject(expectedResult);
    expect(mockLandbotCustomerRepository.findLast).toHaveBeenCalledTimes(1);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FindAllLandbotCustomersUsecase } from 'src/application/landbot-customer/usecases/findAll.usecase';
import { LandbotCustomerView } from 'src/application/landbot-customer/views/landbot-customer.view';
import {
  DEFAULT_PAGINATION,
  Pagination,
} from 'src/application/common/pagination';
import {
  mockedLandbotCustomer,
  mockLandbotCustomerRepository,
} from 'test/mocks/integration/landbot-customer';
import { finistere } from 'test/mocks/integration/departement';

describe('FindAllLandbotCustomersUsecase', () => {
  let useCase: FindAllLandbotCustomersUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllLandbotCustomersUsecase,
        {
          provide: 'LandbotCustomerRepositoryInterface',
          useValue: mockLandbotCustomerRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllLandbotCustomersUsecase>(
      FindAllLandbotCustomersUsecase,
    );
  });

  it('should return all landbot customers paginated', async () => {
    mockLandbotCustomerRepository.findAll.mockResolvedValue([
      [mockedLandbotCustomer],
      1,
    ]);

    const expectedResult = new Pagination(
      [
        new LandbotCustomerView(
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
          mockedLandbotCustomer.disability,
          mockedLandbotCustomer.declarationType,
          mockedLandbotCustomer.connectionWish,
          mockedLandbotCustomer.resources,
          mockedLandbotCustomer.hasProvidedEmail,
        ),
      ],
      1,
      DEFAULT_PAGINATION,
    );

    const result = await useCase.execute(DEFAULT_PAGINATION);

    expect(result).toMatchObject(expectedResult);
    expect(mockLandbotCustomerRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockLandbotCustomerRepository.findAll).toHaveBeenCalledWith(
      DEFAULT_PAGINATION,
    );
  });

  it('should return empty list when no landbot customers exist', async () => {
    mockLandbotCustomerRepository.findAll.mockResolvedValue([[], 0]);

    const result = await useCase.execute(DEFAULT_PAGINATION);

    expect(result.items).toHaveLength(0);
    expect(result.totalCount).toBe(0);
    expect(mockLandbotCustomerRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockLandbotCustomerRepository.findAll).toHaveBeenCalledWith(
      DEFAULT_PAGINATION,
    );
  });

  it('should return landbot customers without departement when departement is undefined', async () => {
    const landbotCustomerWithoutDepartement = { ...mockedLandbotCustomer };
    landbotCustomerWithoutDepartement.departement = undefined;

    mockLandbotCustomerRepository.findAll.mockResolvedValue([
      [landbotCustomerWithoutDepartement],
      1,
    ]);

    const expectedResult = new Pagination(
      [
        new LandbotCustomerView(
          landbotCustomerWithoutDepartement.id,
          landbotCustomerWithoutDepartement.date,
          landbotCustomerWithoutDepartement.desiredCity,
          undefined,
          landbotCustomerWithoutDepartement.eligibility,
          landbotCustomerWithoutDepartement.brsKnowledge,
          landbotCustomerWithoutDepartement.realEstateSituation,
          landbotCustomerWithoutDepartement.disability,
          landbotCustomerWithoutDepartement.declarationType,
          landbotCustomerWithoutDepartement.connectionWish,
          landbotCustomerWithoutDepartement.resources,
          landbotCustomerWithoutDepartement.hasProvidedEmail,
        ),
      ],
      1,
      DEFAULT_PAGINATION,
    );

    const result = await useCase.execute(DEFAULT_PAGINATION);

    expect(result).toMatchObject(expectedResult);
    expect(mockLandbotCustomerRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should call repository with custom pagination params', async () => {
    mockLandbotCustomerRepository.findAll.mockResolvedValue([[], 0]);

    const customParams = { page: 2, pageSize: 10 };
    await useCase.execute(customParams);

    expect(mockLandbotCustomerRepository.findAll).toHaveBeenCalledWith(
      customParams,
    );
  });
});

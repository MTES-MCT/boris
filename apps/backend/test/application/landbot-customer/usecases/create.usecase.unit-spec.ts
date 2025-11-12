import { Test, TestingModule } from '@nestjs/testing';
import { CreateLandbotCustomerUsecase } from 'src/application/landbot-customer/usecases/create.usecase';
import { LandbotCustomerView } from 'src/application/landbot-customer/views/landbot-customer.view';
import { LandbotCustomerEntity } from 'src/infrastructure/landbot-customer/landbot-customer.entity';
import {
  LandbotBrsKnowledge,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from 'src/domain/landbot-customer/landbot-customer.interface';
import {
  mockedLandbotCustomer,
  mockLandbotCustomerRepository,
} from 'test/mocks/integration/landbot-customer';
import {
  finistere,
  mockDepartementRepository,
} from 'test/mocks/integration/departement';

describe('CreateLandbotCustomerUsecase', () => {
  let useCase: CreateLandbotCustomerUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateLandbotCustomerUsecase,
        {
          provide: 'LandbotCustomerRepositoryInterface',
          useValue: mockLandbotCustomerRepository,
        },
        {
          provide: 'DepartementRepositoryInterface',
          useValue: mockDepartementRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateLandbotCustomerUsecase>(
      CreateLandbotCustomerUsecase,
    );
  });

  it('should create a landbot customer with departement', async () => {
    mockDepartementRepository.findOneByCode.mockResolvedValue(finistere);
    mockLandbotCustomerRepository.save.mockResolvedValue(mockedLandbotCustomer);

    const expectedResult = new LandbotCustomerView(
      mockedLandbotCustomer.id,
      mockedLandbotCustomer.date,
      {
        id: finistere.id,
        name: finistere.name,
        code: finistere.code,
      },
      mockedLandbotCustomer.eligibility,
      mockedLandbotCustomer.brsKnowledge,
      mockedLandbotCustomer.realEstateSituation,
    );

    const result = await useCase.execute({
      date: new Date('2024-01-15'),
      departementCode: '29',
      eligibility: LandbotEligibility.ZONE_TENDUE,
      brsKnowledge: LandbotBrsKnowledge.OUI,
      realEstateSituation: LandbotRealEstateSituation.PROPRIETAIRE,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledWith('29');
    expect(mockLandbotCustomerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockLandbotCustomerRepository.save).toHaveBeenCalledWith(
      new LandbotCustomerEntity(
        new Date('2024-01-15'),
        finistere,
        LandbotEligibility.ZONE_TENDUE,
        LandbotBrsKnowledge.OUI,
        LandbotRealEstateSituation.PROPRIETAIRE,
      ),
    );
  });

  it('should create a landbot customer without departement when departement is not found', async () => {
    mockDepartementRepository.findOneByCode.mockResolvedValue(null);
    const landbotCustomerWithoutDepartement = new LandbotCustomerEntity(
      new Date('2024-01-15'),
      undefined,
      LandbotEligibility.ZONE_TENDUE,
    );
    landbotCustomerWithoutDepartement.id = 'test-id';
    mockLandbotCustomerRepository.save.mockResolvedValue(
      landbotCustomerWithoutDepartement,
    );

    const expectedResult = new LandbotCustomerView(
      landbotCustomerWithoutDepartement.id,
      landbotCustomerWithoutDepartement.date,
      undefined,
      landbotCustomerWithoutDepartement.eligibility,
      landbotCustomerWithoutDepartement.brsKnowledge,
      landbotCustomerWithoutDepartement.realEstateSituation,
    );

    const result = await useCase.execute({
      date: new Date('2024-01-15'),
      departementCode: '99',
      eligibility: LandbotEligibility.ZONE_TENDUE,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledWith('99');
    expect(mockLandbotCustomerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockLandbotCustomerRepository.save).toHaveBeenCalledWith(
      new LandbotCustomerEntity(
        new Date('2024-01-15'),
        undefined,
        LandbotEligibility.ZONE_TENDUE,
      ),
    );
  });

  it('should create a landbot customer with only required fields', async () => {
    mockDepartementRepository.findOneByCode.mockResolvedValue(null);
    const landbotCustomerMinimal = new LandbotCustomerEntity(
      new Date('2024-02-20'),
      undefined,
    );
    landbotCustomerMinimal.id = 'test-id-2';
    mockLandbotCustomerRepository.save.mockResolvedValue(
      landbotCustomerMinimal,
    );

    const expectedResult = new LandbotCustomerView(
      landbotCustomerMinimal.id,
      landbotCustomerMinimal.date,
      undefined,
      undefined,
      undefined,
      undefined,
    );

    const result = await useCase.execute({
      date: new Date('2024-02-20'),
      departementCode: '99',
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledWith('99');
    expect(mockLandbotCustomerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockLandbotCustomerRepository.save).toHaveBeenCalledWith(
      new LandbotCustomerEntity(new Date('2024-02-20'), undefined),
    );
  });
});

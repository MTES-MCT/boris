import { Test, TestingModule } from '@nestjs/testing';
import { FindAllDepartementsUsecase } from 'src/application/departement/usecases/findAll.usecase';
import { DepartementView } from 'src/application/departement/views/departement.view';
import {
  DEFAULT_PAGINATION,
  Pagination,
} from 'src/application/pagination/pagination';
import {
  finistere,
  mockDepartementRepository,
  paris,
} from 'test/mocks/integration/departement';

describe('FindAllDepartementsUsecase', () => {
  let useCase: FindAllDepartementsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllDepartementsUsecase,
        {
          provide: 'DepartementRepositoryInterface',
          useValue: mockDepartementRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllDepartementsUsecase>(
      FindAllDepartementsUsecase,
    );
  });

  it('should return all departements', async () => {
    mockDepartementRepository.findAll.mockReturnValue([[finistere, paris], 2]);

    const expectedResult = new Pagination(
      [
        new DepartementView(finistere.id, finistere.name, finistere.code),
        new DepartementView(paris.id, paris.name, paris.code),
      ],
      2,
      DEFAULT_PAGINATION,
    );

    const result = await useCase.execute(DEFAULT_PAGINATION);

    expect(result).toMatchObject(expectedResult);
    expect(mockDepartementRepository.findAll).toHaveBeenCalledTimes(1);
  });
});

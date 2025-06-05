import { Test, TestingModule } from '@nestjs/testing';
import { FindAllDistributorsUsecase } from 'src/application/distributor/usecases/findAll.usecase';
import { DistributorView } from 'src/application/distributor/views/distributor.view';
import {
  DEFAULT_PAGINATION,
  Pagination,
} from 'src/application/pagination/pagination';
import {
  distributor1,
  distributor2,
  mockDistributorRepository,
} from 'test/mocks/integration/distributor';

describe('FindAllDistributorsUsecase', () => {
  let useCase: FindAllDistributorsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllDistributorsUsecase,
        {
          provide: 'DistributorRepositoryInterface',
          useValue: mockDistributorRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllDistributorsUsecase>(
      FindAllDistributorsUsecase,
    );
  });

  it('should return all distributors', async () => {
    mockDistributorRepository.findAll.mockReturnValue([
      [distributor1, distributor2],
      2,
    ]);

    const expectedResult = new Pagination(
      [
        new DistributorView(
          distributor1.id,
          distributor1.name,
          distributor1.websiteUrl,
        ),
        new DistributorView(
          distributor2.id,
          distributor2.name,
          distributor2.websiteUrl,
        ),
      ],
      2,
      DEFAULT_PAGINATION,
    );

    const result = await useCase.execute({
      paginationProps: DEFAULT_PAGINATION,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockDistributorRepository.findAll).toHaveBeenCalledTimes(1);
  });
});

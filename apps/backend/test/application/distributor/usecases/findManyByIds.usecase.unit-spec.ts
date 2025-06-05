import { Test, TestingModule } from '@nestjs/testing';
import { FindManyDistributorsByIdsUsecase } from 'src/application/distributor/usecases/findManyByIds.usecase';
import { DistributorView } from 'src/application/distributor/views/distributor.view';
import {
  distributor1,
  distributor2,
  mockDistributorRepository,
} from 'test/mocks/integration/distributor';

describe('FindManyDistributorsByIdsUsecase', () => {
  let useCase: FindManyDistributorsByIdsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindManyDistributorsByIdsUsecase,
        {
          provide: 'DistributorRepositoryInterface',
          useValue: mockDistributorRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindManyDistributorsByIdsUsecase>(
      FindManyDistributorsByIdsUsecase,
    );
  });

  it('should return distributors by ids', async () => {
    const ids = ['id1', 'id2'];
    mockDistributorRepository.findManyByIds.mockResolvedValue([
      distributor1,
      distributor2,
    ]);

    const expectedResult = [
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
    ];

    const result = await useCase.execute({ ids });

    expect(result).toMatchObject(expectedResult);
    expect(mockDistributorRepository.findManyByIds).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.findManyByIds).toHaveBeenCalledWith(ids);
  });
});

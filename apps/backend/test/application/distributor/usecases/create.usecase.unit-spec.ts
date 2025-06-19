import { Test, TestingModule } from '@nestjs/testing';
import { CreateDistributorUsecase } from 'src/application/distributor/usecases/create.usecase';
import {
  mockDistributorRepository,
  distributor1,
} from 'test/mocks/integration/distributor';
import { DistributorView } from 'src/application/distributor/views/distributor.view';

describe('CreateDistributorUsecase', () => {
  let useCase: CreateDistributorUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDistributorUsecase,
        {
          provide: 'DistributorRepositoryInterface',
          useValue: mockDistributorRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateDistributorUsecase>(CreateDistributorUsecase);
  });

  it('should create a distributor and return its data', async () => {
    mockDistributorRepository.save.mockReturnValue(distributor1);

    const expectedResult = new DistributorView(
      distributor1.id,
      distributor1.name,
      distributor1.websiteUrl,
    );

    const result = await useCase.execute({
      name: distributor1.name,
      websiteUrl: distributor1.websiteUrl,
    });

    expect(result).toEqual(expectedResult);
    expect(mockDistributorRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.save).toHaveBeenCalledWith(distributor1);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SaveDistributorUsecase } from 'src/application/distributor/usecases/save.usecase';
import { DistributorView } from 'src/application/distributor/views/distributor.view';
import {
  distributor1,
  mockDistributorRepository,
} from 'test/mocks/integration/distributor';

describe('SaveDistributorUsecase', () => {
  let useCase: SaveDistributorUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveDistributorUsecase,
        {
          provide: 'DistributorRepositoryInterface',
          useValue: mockDistributorRepository,
        },
      ],
    }).compile();

    useCase = module.get<SaveDistributorUsecase>(SaveDistributorUsecase);
  });

  it('should save a distributor and return its data', async () => {
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

    expect(result).toMatchObject(expectedResult);
    expect(mockDistributorRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.save).toHaveBeenCalledWith(distributor1);
  });
});

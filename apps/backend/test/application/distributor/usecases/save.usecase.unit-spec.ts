import { Test, TestingModule } from '@nestjs/testing';
import { SaveDistributorUsecase } from 'src/application/distributor/usecases/save.usecase';
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

  it('should save a departement and return its data', async () => {
    mockDistributorRepository.save.mockReturnValue(distributor1);

    const result = await useCase.execute(distributor1);

    expect(result).toMatchObject(distributor1);
    expect(mockDistributorRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.save).toHaveBeenCalledWith(distributor1);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FindManyDepartementsByNamesUsecase } from 'src/application/departement/findManyByNames.usecase';
import {
  finistere,
  mockDepartementRepository,
  paris,
} from 'test/mocks/departement';

describe('FindManyDepartementsByNamesUsecase', () => {
  let useCase: FindManyDepartementsByNamesUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindManyDepartementsByNamesUsecase,
        {
          provide: 'DepartementRepositoryInterface',
          useValue: mockDepartementRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindManyDepartementsByNamesUsecase>(
      FindManyDepartementsByNamesUsecase,
    );
  });

  it('should find many departements', async () => {
    mockDepartementRepository.findManyByNames.mockReturnValue([
      finistere,
      paris,
    ]);

    const result = await useCase.execute([finistere.name, paris.name]);

    expect(result).toMatchObject([finistere, paris]);
    expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledWith([
      finistere.name,
      paris.name,
    ]);
  });
});

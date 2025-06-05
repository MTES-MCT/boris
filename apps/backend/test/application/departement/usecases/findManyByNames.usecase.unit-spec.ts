import { Test, TestingModule } from '@nestjs/testing';
import { FindManyDepartementsByNamesUsecase } from 'src/application/departement/usecases/findManyByNames.usecase';
import { DepartementView } from 'src/application/departement/views/departement.view';
import {
  finistere,
  mockDepartementRepository,
  paris,
} from 'test/mocks/integration/departement';

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

    const expectedResult = [
      new DepartementView(finistere.id, finistere.name, finistere.code),
      new DepartementView(paris.id, paris.name, paris.code),
    ];

    const result = await useCase.execute([finistere.name, paris.name]);

    expect(result).toMatchObject(expectedResult);
    expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledWith([
      finistere.name,
      paris.name,
    ]);
  });

  it('should return an empty array if no departements are found', async () => {
    mockDepartementRepository.findManyByNames.mockReturnValue([]);

    const result = await useCase.execute([finistere.name, paris.name]);

    expect(result).toEqual([]);
    expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findManyByNames).toHaveBeenCalledWith([
      finistere.name,
      paris.name,
    ]);
  });
});

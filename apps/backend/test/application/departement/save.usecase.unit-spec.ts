/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SaveDepartementUsecase } from 'src/application/departement/save.usecase';
import { finistere, mockDepartementRepository } from 'test/mocks/departement';

describe('SaveDepartementUsecase', () => {
  let useCase: SaveDepartementUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveDepartementUsecase,
        {
          provide: 'DepartementRepositoryInterface',
          useValue: mockDepartementRepository,
        },
      ],
    }).compile();

    useCase = module.get<SaveDepartementUsecase>(SaveDepartementUsecase);
  });

  it('should save a departement and return its data', async () => {
    const result = await useCase.execute(finistere);

    expect(result).toMatchObject(finistere);
    expect(mockDepartementRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.save).toHaveBeenCalledWith(finistere);
  });
});

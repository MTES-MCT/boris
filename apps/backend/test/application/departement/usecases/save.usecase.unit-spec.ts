import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SaveDepartementUsecase } from 'src/application/departement/usecases/save.usecase';
import { DepartementView } from 'src/application/departement/views/departement.view';
import {
  finistere,
  mockDepartementRepository,
} from 'test/mocks/integration/departement';

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
    mockDepartementRepository.save.mockReturnValue(finistere);
    mockDepartementRepository.findOneByName.mockReturnValue(null);
    mockDepartementRepository.findOneByCode.mockReturnValue(null);

    const expectedResult = new DepartementView(
      finistere.id,
      finistere.name,
      finistere.code,
    );

    const result = await useCase.execute(finistere);

    expect(result).toMatchObject(expectedResult);
    expect(mockDepartementRepository.findOneByName).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneByName).toHaveBeenCalledWith(
      finistere.name,
    );
    expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledWith(
      finistere.code,
    );
    expect(mockDepartementRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.save).toHaveBeenCalledWith(finistere);
  });

  it('should fail if a departement with the same name already exists', async () => {
    mockDepartementRepository.save.mockReturnValue(finistere);
    mockDepartementRepository.findOneByName.mockReturnValue(finistere);
    mockDepartementRepository.findOneByCode.mockReturnValue(null);

    try {
      await useCase.execute(finistere);
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledWith(
        finistere.name,
      );
      expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(0);
      expect(mockDepartementRepository.save).toHaveBeenCalledTimes(0);
    }
  });

  it('should fail if a departement with the same code already exists', async () => {
    mockDepartementRepository.save.mockReturnValue(finistere);
    mockDepartementRepository.findOneByName.mockReturnValue(null);
    mockDepartementRepository.findOneByCode.mockReturnValue(finistere);

    try {
      await useCase.execute(finistere);
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledWith(
        finistere.name,
      );
      expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledWith(
        finistere.code,
      );
      expect(mockDepartementRepository.save).toHaveBeenCalledTimes(0);
    }
  });
});

import { ConflictException } from '@nestjs/common';
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
    mockDepartementRepository.save.mockReturnValue(finistere);
    mockDepartementRepository.findOneByName.mockReturnValue(null);
    mockDepartementRepository.findOneByZipcode.mockReturnValue(null);

    const result = await useCase.execute(finistere);

    expect(result).toMatchObject(finistere);
    expect(mockDepartementRepository.findOneByName).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneByName).toHaveBeenCalledWith(
      finistere.name,
    );
    expect(mockDepartementRepository.findOneByZipcode).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneByZipcode).toHaveBeenCalledWith(
      finistere.zipcode,
    );
    expect(mockDepartementRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.save).toHaveBeenCalledWith(finistere);
  });

  it('should fail if a departement with the same name already exists', async () => {
    mockDepartementRepository.save.mockReturnValue(finistere);
    mockDepartementRepository.findOneByName.mockReturnValue(finistere);
    mockDepartementRepository.findOneByZipcode.mockReturnValue(null);

    try {
      await useCase.execute(finistere);
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledWith(
        finistere.name,
      );
      expect(mockDepartementRepository.findOneByZipcode).toHaveBeenCalledTimes(
        0,
      );
      expect(mockDepartementRepository.save).toHaveBeenCalledTimes(0);
    }
  });

  it('should fail if a departement with the same zipcode already exists', async () => {
    mockDepartementRepository.save.mockReturnValue(finistere);
    mockDepartementRepository.findOneByName.mockReturnValue(null);
    mockDepartementRepository.findOneByZipcode.mockReturnValue(finistere);

    try {
      await useCase.execute(finistere);
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByName).toHaveBeenCalledWith(
        finistere.name,
      );
      expect(mockDepartementRepository.findOneByZipcode).toHaveBeenCalledTimes(
        1,
      );
      expect(mockDepartementRepository.findOneByZipcode).toHaveBeenCalledWith(
        finistere.zipcode,
      );
      expect(mockDepartementRepository.save).toHaveBeenCalledTimes(0);
    }
  });
});

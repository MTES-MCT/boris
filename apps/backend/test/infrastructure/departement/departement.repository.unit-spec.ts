import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { DepartementRepository } from 'src/infrastructure/departement/departement.repository';
import {
  finistere,
  mockDepartementRepository,
  paris,
} from 'test/mocks/integration/departement';
import { In } from 'typeorm';

describe('DepartementRepository', () => {
  let departementRepository: DepartementRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartementRepository,
        {
          provide: getRepositoryToken(DepartementEntity),
          useValue: mockDepartementRepository,
        },
      ],
    }).compile();

    departementRepository = module.get<DepartementRepository>(
      DepartementRepository,
    );
  });

  it('should save a departement and return its data', async () => {
    mockDepartementRepository.save.mockResolvedValue(finistere);

    const result = await departementRepository.save(finistere);

    expect(result).toMatchObject(finistere);
    expect(mockDepartementRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.save).toHaveBeenCalledWith(finistere);
  });

  it('should find a departement by name and return its data', async () => {
    mockDepartementRepository.findOneBy.mockResolvedValue(finistere);

    const result = await departementRepository.findOneByName('finistere');

    expect(result).toMatchObject(finistere);
    expect(mockDepartementRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneBy).toHaveBeenCalledWith({
      name: 'finistere',
    });
  });

  it('should find a departement by code and return its data', async () => {
    mockDepartementRepository.findOneBy.mockResolvedValue(finistere);

    const result = await departementRepository.findOneByCode('29');

    expect(result).toMatchObject(finistere);
    expect(mockDepartementRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneBy).toHaveBeenCalledWith({
      code: '29',
    });
  });

  it('should find departements by names', async () => {
    mockDepartementRepository.findBy.mockResolvedValue([finistere, paris]);

    const result = await departementRepository.findManyByNames([
      'Finistère',
      'Paris',
    ]);

    expect(result).toMatchObject([finistere, paris]);
    expect(mockDepartementRepository.findBy).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findBy).toHaveBeenCalledWith({
      name: In(['Finistère', 'Paris']),
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { DepartementRepository } from 'src/infrastructure/departement/departement.repository';
import { finistere, mockDepartementRepository } from 'test/mocks/departement';

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

  it('should find a departement by zipcode and return its data', async () => {
    mockDepartementRepository.findOneBy.mockResolvedValue(finistere);

    const result = await departementRepository.findOneByZipcode(29);

    expect(result).toMatchObject(finistere);
    expect(mockDepartementRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneBy).toHaveBeenCalledWith({
      zipcode: 29,
    });
  });
});

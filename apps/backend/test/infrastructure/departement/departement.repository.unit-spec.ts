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
    mockDepartementRepository.findOne.mockResolvedValue(finistere);

    const result = await departementRepository.findOneByCode('29');

    expect(result).toMatchObject(finistere);
    expect(mockDepartementRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOne).toHaveBeenCalledWith({
      where: {
        code: '29',
      },
      relations: ['region'],
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

  it('should find a departement by a cityZipcode', async () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(finistere),
    };

    mockDepartementRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const expectedResult = finistere;

    const result = await departementRepository.findOneByCityZipcode('12345');

    expect(result).toMatchObject(expectedResult);
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      'departement.region',
      'region',
    );
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      ":cityZipcode LIKE departement.code || '%'",
      { cityZipcode: '12345' },
    );
    expect(mockQueryBuilder.getOne).toHaveBeenCalledTimes(1);
  });
});

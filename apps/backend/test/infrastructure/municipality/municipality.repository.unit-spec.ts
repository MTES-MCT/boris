import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MunicipalityEntity } from 'src/infrastructure/municipality/municipality.entity';
import { MunicipalityRepository } from 'src/infrastructure/municipality/municipality.repository';
import {
  mockMunicipalityRepository,
  parisMunicipality,
} from 'test/mocks/integration/municipality';

describe('MunicipalityRepository', () => {
  let municipalityRepository: MunicipalityRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MunicipalityRepository,
        {
          provide: getRepositoryToken(MunicipalityEntity),
          useValue: mockMunicipalityRepository,
        },
      ],
    }).compile();

    municipalityRepository = module.get<MunicipalityRepository>(
      MunicipalityRepository,
    );
  });

  it('should save a municipality and return its data', async () => {
    mockMunicipalityRepository.save.mockResolvedValue(parisMunicipality);
    const result = await municipalityRepository.save(parisMunicipality);

    expect(result).toMatchObject(parisMunicipality);
    expect(mockMunicipalityRepository.save).toHaveBeenCalledTimes(1);
    expect(mockMunicipalityRepository.save).toHaveBeenCalledWith(
      parisMunicipality,
    );
  });

  it('should find a municipality by insee code and return its data', async () => {
    mockMunicipalityRepository.findOne.mockResolvedValue(parisMunicipality);

    const result = await municipalityRepository.findOneByInseeCode('75056');

    expect(result).toMatchObject(parisMunicipality);
    expect(mockMunicipalityRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockMunicipalityRepository.findOne).toHaveBeenCalledWith({
      where: {
        inseeCode: '75056',
      },
      relations: ['departement'],
    });
  });

  it('should not find a municipality by insee code and return null', async () => {
    mockMunicipalityRepository.findOne.mockResolvedValue(null);

    const result = await municipalityRepository.findOneByInseeCode('75056');

    expect(result).toBeNull();
    expect(mockMunicipalityRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockMunicipalityRepository.findOne).toHaveBeenCalledWith({
      where: {
        inseeCode: '75056',
      },
      relations: ['departement'],
    });
  });
});

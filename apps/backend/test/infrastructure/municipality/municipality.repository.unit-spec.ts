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
    mockMunicipalityRepository.findOneBy.mockResolvedValue(parisMunicipality);

    const result = await municipalityRepository.findOneByInseeCode('75056');

    expect(result).toMatchObject(parisMunicipality);
    expect(mockMunicipalityRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockMunicipalityRepository.findOneBy).toHaveBeenCalledWith({
      inseeCode: '75056',
    });
  });

  it('should not find a municipality by insee code and return null', async () => {
    mockMunicipalityRepository.findOneBy.mockResolvedValue(null);

    const result = await municipalityRepository.findOneByInseeCode('75056');

    expect(result).toBeNull();
    expect(mockMunicipalityRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockMunicipalityRepository.findOneBy).toHaveBeenCalledWith({
      inseeCode: '75056',
    });
  });
});

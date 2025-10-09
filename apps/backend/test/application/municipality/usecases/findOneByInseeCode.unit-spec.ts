import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import {
  mockMunicipalityRepository,
  parisMunicipality,
  quimperMunicipality,
} from 'test/mocks/integration/municipality';
import { FindOneMunicipalityByInseeCodeUsecase } from 'src/application/municipality/usecases/findOneByInseeCode.usecase';
import { MunicipalityView } from 'src/application/municipality/views/municipality.view';

describe('FindOneMunicipalityByInseeCodeUsecase', () => {
  let useCase: FindOneMunicipalityByInseeCodeUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneMunicipalityByInseeCodeUsecase,
        {
          provide: 'MunicipalityRepositoryInterface',
          useValue: mockMunicipalityRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindOneMunicipalityByInseeCodeUsecase>(
      FindOneMunicipalityByInseeCodeUsecase,
    );
  });

  it('should find a municipality by insee code', async () => {
    mockMunicipalityRepository.findOneByInseeCode.mockResolvedValue(
      quimperMunicipality,
    );

    const expectedResult = new MunicipalityView(
      quimperMunicipality.id,
      quimperMunicipality.name,
      quimperMunicipality.inseeCode,
      quimperMunicipality.zone,
      {
        id: quimperMunicipality.departement.id,
        name: quimperMunicipality.departement.name,
        code: quimperMunicipality.departement.code,
      },
    );

    const result = await useCase.execute({ inseeCode: '1234' });

    expect(result).toEqual(expectedResult);
    expect(mockMunicipalityRepository.findOneByInseeCode).toHaveBeenCalledTimes(
      1,
    );
    expect(mockMunicipalityRepository.findOneByInseeCode).toHaveBeenCalledWith(
      '1234',
    );
  });

  it('should find a municipality by insee code of Paris', async () => {
    mockMunicipalityRepository.findOneByInseeCode
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(parisMunicipality);

    const expectedResult = new MunicipalityView(
      parisMunicipality.id,
      parisMunicipality.name,
      parisMunicipality.inseeCode,
      parisMunicipality.zone,
      {
        id: parisMunicipality.departement.id,
        name: parisMunicipality.departement.name,
        code: parisMunicipality.departement.code,
      },
    );

    const result = await useCase.execute({ inseeCode: '75156' });

    expect(result).toEqual(expectedResult);
    expect(mockMunicipalityRepository.findOneByInseeCode).toHaveBeenCalledTimes(
      2,
    );
    expect(
      mockMunicipalityRepository.findOneByInseeCode,
    ).toHaveBeenNthCalledWith(1, '75156');
    expect(
      mockMunicipalityRepository.findOneByInseeCode,
    ).toHaveBeenNthCalledWith(2, '75056');
  });

  it('should find a municipality by insee code of Lyon', async () => {
    mockMunicipalityRepository.findOneByInseeCode
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(parisMunicipality);

    const expectedResult = new MunicipalityView(
      parisMunicipality.id,
      parisMunicipality.name,
      parisMunicipality.inseeCode,
      parisMunicipality.zone,
      {
        id: parisMunicipality.departement.id,
        name: parisMunicipality.departement.name,
        code: parisMunicipality.departement.code,
      },
    );

    const result = await useCase.execute({ inseeCode: '69122' });

    expect(result).toEqual(expectedResult);
    expect(mockMunicipalityRepository.findOneByInseeCode).toHaveBeenCalledTimes(
      2,
    );
    expect(
      mockMunicipalityRepository.findOneByInseeCode,
    ).toHaveBeenNthCalledWith(1, '69122');
    expect(
      mockMunicipalityRepository.findOneByInseeCode,
    ).toHaveBeenNthCalledWith(2, '69123');
  });

  it('should find a municipality by insee code of Marseille', async () => {
    mockMunicipalityRepository.findOneByInseeCode
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(parisMunicipality);

    const expectedResult = new MunicipalityView(
      parisMunicipality.id,
      parisMunicipality.name,
      parisMunicipality.inseeCode,
      parisMunicipality.zone,
      {
        id: parisMunicipality.departement.id,
        name: parisMunicipality.departement.name,
        code: parisMunicipality.departement.code,
      },
    );

    const result = await useCase.execute({ inseeCode: '13056' });

    expect(result).toEqual(expectedResult);
    expect(mockMunicipalityRepository.findOneByInseeCode).toHaveBeenCalledTimes(
      2,
    );
    expect(
      mockMunicipalityRepository.findOneByInseeCode,
    ).toHaveBeenNthCalledWith(1, '13056');
    expect(
      mockMunicipalityRepository.findOneByInseeCode,
    ).toHaveBeenNthCalledWith(2, '13055');
  });

  it('should throw NotFoundException when municipality does not exist', async () => {
    mockMunicipalityRepository.findOneByInseeCode.mockResolvedValue(null);

    try {
      await useCase.execute({ inseeCode: '1234' });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(
        mockMunicipalityRepository.findOneByInseeCode,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockMunicipalityRepository.findOneByInseeCode,
      ).toHaveBeenCalledWith('1234');
    }
  });
});

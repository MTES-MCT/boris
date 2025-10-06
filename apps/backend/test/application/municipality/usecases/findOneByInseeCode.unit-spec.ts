import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import {
  mockMunicipalityRepository,
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

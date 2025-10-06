import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateMunicipalityUsecase } from 'src/application/municipality/usecases/create.usecase';
import { MunicipalityView } from 'src/application/municipality/views/municipality.view';
import {
  finistere,
  mockDepartementRepository,
} from 'test/mocks/integration/departement';
import {
  mockMunicipalityRepository,
  quimperMunicipality,
} from 'test/mocks/integration/municipality';

describe('CreateMunicipalityUsecase', () => {
  let useCase: CreateMunicipalityUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMunicipalityUsecase,
        {
          provide: 'MunicipalityRepositoryInterface',
          useValue: mockMunicipalityRepository,
        },
        {
          provide: 'DepartementRepositoryInterface',
          useValue: mockDepartementRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateMunicipalityUsecase>(CreateMunicipalityUsecase);
  });

  it('should save a municipality and return its data', async () => {
    mockDepartementRepository.findOneByInseeCode.mockReturnValue(finistere);
    mockMunicipalityRepository.save.mockReturnValue(quimperMunicipality);

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

    const result = await useCase.execute({
      name: quimperMunicipality.name,
      inseeCode: quimperMunicipality.inseeCode,
      zone: quimperMunicipality.zone,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockDepartementRepository.findOneByInseeCode).toHaveBeenCalledTimes(
      1,
    );
    expect(mockDepartementRepository.findOneByInseeCode).toHaveBeenCalledWith(
      quimperMunicipality.inseeCode,
    );
    expect(mockMunicipalityRepository.save).toHaveBeenCalledTimes(1);
    expect(mockMunicipalityRepository.save).toHaveBeenCalledWith(
      quimperMunicipality,
    );
  });

  it('should fail if the inseeCode does not match a departement', async () => {
    mockDepartementRepository.findOneByInseeCode.mockReturnValue(null);

    try {
      await useCase.execute({
        name: quimperMunicipality.name,
        inseeCode: quimperMunicipality.inseeCode,
        zone: quimperMunicipality.zone,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(
        mockDepartementRepository.findOneByInseeCode,
      ).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByInseeCode).toHaveBeenCalledWith(
        quimperMunicipality.inseeCode,
      );
      expect(mockMunicipalityRepository.save).toHaveBeenCalledTimes(0);
    }
  });
});

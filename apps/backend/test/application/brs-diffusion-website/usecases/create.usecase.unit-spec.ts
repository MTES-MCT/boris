import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/create.usecase';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import { BrsDiffusionWebsiteEntity } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';

import {
  mockedBrsDiffusionWebsite,
  mockedBrsDiffusionWebsiteRepository,
} from 'test/mocks/integration/brs-diffusion-website';
import {
  finistere,
  mockDepartementRepository,
} from 'test/mocks/integration/departement';
import {
  mockedGeocodedResponse,
  mockedGeocoderService,
} from 'test/mocks/integration/geocoder';

describe('CreateBrsDiffusionWebsiteUsecase', () => {
  let useCase: CreateBrsDiffusionWebsiteUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBrsDiffusionWebsiteUsecase,
        {
          provide: 'BrsDiffusionWebsiteRepositoryInterface',
          useValue: mockedBrsDiffusionWebsiteRepository,
        },
        {
          provide: 'DepartementRepositoryInterface',
          useValue: mockDepartementRepository,
        },
        {
          provide: 'GeocoderServiceInterface',
          useValue: mockedGeocoderService,
        },
      ],
    }).compile();

    useCase = module.get<CreateBrsDiffusionWebsiteUsecase>(
      CreateBrsDiffusionWebsiteUsecase,
    );
  });

  it('should create a brs diffusion website', async () => {
    mockedGeocoderService.geocodeByMunicipality.mockResolvedValue(
      mockedGeocodedResponse,
    );
    mockedGeocoderService.getZipcodeFirstTwoDigits.mockReturnValue(
      mockedGeocodedResponse.properties?.postcode?.slice(0, 2),
    );
    mockDepartementRepository.findOneByCode.mockResolvedValue(finistere);
    mockedBrsDiffusionWebsiteRepository.save.mockResolvedValue(
      mockedBrsDiffusionWebsite,
    );

    const expectedResult = new BrsDiffusionWebsiteView(
      mockedBrsDiffusionWebsite.id,
      mockedBrsDiffusionWebsite.source,
      mockedBrsDiffusionWebsite.distributorName,
      mockedBrsDiffusionWebsite.ofsName,
      mockedBrsDiffusionWebsite.city,
      mockedBrsDiffusionWebsite.zipcode,
      mockedBrsDiffusionWebsite.address,
      mockedBrsDiffusionWebsite.inseeCode,
      mockedBrsDiffusionWebsite.latitude,
      mockedBrsDiffusionWebsite.longitude,
      {
        id: mockedBrsDiffusionWebsite.region.id,
        name: mockedBrsDiffusionWebsite.region.name,
      },
      {
        id: mockedBrsDiffusionWebsite.departement.id,
        name: mockedBrsDiffusionWebsite.departement.name,
        code: mockedBrsDiffusionWebsite.departement.code,
      },
    );

    const result = await useCase.execute({
      source: mockedBrsDiffusionWebsite.source,
      distributorName: mockedBrsDiffusionWebsite.distributorName,
      ofsName: mockedBrsDiffusionWebsite.ofsName,
      city: mockedBrsDiffusionWebsite.city,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockedGeocoderService.geocodeByMunicipality).toHaveBeenCalledTimes(
      1,
    );
    expect(mockedGeocoderService.geocodeByMunicipality).toHaveBeenCalledWith(
      mockedBrsDiffusionWebsite.city,
    );
    expect(
      mockedGeocoderService.getZipcodeFirstTwoDigits,
    ).toHaveBeenCalledTimes(1);
    expect(mockedGeocoderService.getZipcodeFirstTwoDigits).toHaveBeenCalledWith(
      mockedGeocodedResponse.properties?.postcode,
    );
    expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(1);
    expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledWith(
      mockedGeocodedResponse.properties?.postcode?.slice(0, 2),
    );
    expect(mockedBrsDiffusionWebsiteRepository.save).toHaveBeenCalledTimes(1);
    expect(mockedBrsDiffusionWebsiteRepository.save).toHaveBeenCalledWith(
      new BrsDiffusionWebsiteEntity(
        mockedBrsDiffusionWebsite.source,
        mockedBrsDiffusionWebsite.distributorName,
        mockedBrsDiffusionWebsite.ofsName,
        mockedGeocodedResponse.properties?.city as string,
        mockedGeocodedResponse.properties?.postcode as string,
        mockedGeocodedResponse.properties?.context as string,
        mockedGeocodedResponse.properties?.citycode as string,
        mockedGeocodedResponse.geometry?.coordinates?.[1] as number,
        mockedGeocodedResponse.geometry?.coordinates?.[0] as number,
        finistere.region,
        finistere,
      ),
    );
  });

  it('should throw a BadRequestException if the municipality is not found', async () => {
    mockedGeocoderService.geocodeByMunicipality.mockResolvedValue(undefined);

    try {
      await useCase.execute({
        source: mockedBrsDiffusionWebsite.source,
        distributorName: mockedBrsDiffusionWebsite.distributorName,
        ofsName: mockedBrsDiffusionWebsite.ofsName,
        city: mockedBrsDiffusionWebsite.city,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(mockedGeocoderService.geocodeByMunicipality).toHaveBeenCalledTimes(
        1,
      );
      expect(mockedGeocoderService.geocodeByMunicipality).toHaveBeenCalledWith(
        mockedBrsDiffusionWebsite.city,
      );
      expect(
        mockedGeocoderService.getZipcodeFirstTwoDigits,
      ).not.toHaveBeenCalled();
      expect(mockDepartementRepository.findOneByCode).not.toHaveBeenCalled();
      expect(mockedBrsDiffusionWebsiteRepository.save).not.toHaveBeenCalled();
    }
  });

  it('should throw a NotFoundException if the departement is not found', async () => {
    mockedGeocoderService.geocodeByMunicipality.mockResolvedValue(
      mockedGeocodedResponse,
    );

    mockedGeocoderService.getZipcodeFirstTwoDigits.mockReturnValue(
      mockedGeocodedResponse.properties?.postcode?.slice(0, 2),
    );
    mockDepartementRepository.findOneByCode.mockResolvedValue(null);

    try {
      await useCase.execute({
        source: mockedBrsDiffusionWebsite.source,
        distributorName: mockedBrsDiffusionWebsite.distributorName,
        ofsName: mockedBrsDiffusionWebsite.ofsName,
        city: mockedBrsDiffusionWebsite.city,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(mockedGeocoderService.geocodeByMunicipality).toHaveBeenCalledTimes(
        1,
      );
      expect(mockedGeocoderService.geocodeByMunicipality).toHaveBeenCalledWith(
        mockedBrsDiffusionWebsite.city,
      );
      expect(
        mockedGeocoderService.getZipcodeFirstTwoDigits,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockedGeocoderService.getZipcodeFirstTwoDigits,
      ).toHaveBeenCalledWith(mockedGeocodedResponse.properties?.postcode);
      expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledWith(
        mockedGeocodedResponse.properties?.postcode?.slice(0, 2),
      );
      expect(mockedBrsDiffusionWebsiteRepository.save).not.toHaveBeenCalled();
    }
  });
});

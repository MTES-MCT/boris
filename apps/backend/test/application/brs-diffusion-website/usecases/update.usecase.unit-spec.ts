import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/update.usecase';
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

describe('UpdateBrsDiffusionWebsiteUsecase', () => {
  let useCase: UpdateBrsDiffusionWebsiteUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateBrsDiffusionWebsiteUsecase,
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

    useCase = module.get<UpdateBrsDiffusionWebsiteUsecase>(
      UpdateBrsDiffusionWebsiteUsecase,
    );
  });

  it('should update a brs diffusion website with geocoding', async () => {
    const payload = {
      id: '1234',
      source: 'https://source_updated.fr',
      distributorName: 'Commercialisateur_updated',
      ofsName: 'OFS_updated',
      city: 'Paris',
    };

    mockedBrsDiffusionWebsiteRepository.findById.mockResolvedValue(
      mockedBrsDiffusionWebsite,
    );
    mockedGeocoderService.geocodeByMunicipality.mockResolvedValue(
      mockedGeocodedResponse,
    );
    mockedGeocoderService.getZipcodeFirstTwoDigits.mockReturnValue(
      mockedGeocodedResponse.properties?.postcode?.slice(0, 2),
    );
    mockDepartementRepository.findOneByCode.mockResolvedValue(finistere);
    mockedBrsDiffusionWebsiteRepository.save.mockResolvedValue({
      ...mockedBrsDiffusionWebsite,
      source: payload.source,
      distributorName: payload.distributorName,
      ofsName: payload.ofsName,
      city: mockedGeocodedResponse.properties?.city as string,
      zipcode: mockedGeocodedResponse.properties?.postcode as string,
      address: mockedGeocodedResponse.properties?.context as string,
      inseeCode: mockedGeocodedResponse.properties?.citycode as string,
      latitude: mockedGeocodedResponse.geometry?.coordinates?.[1] as number,
      longitude: mockedGeocodedResponse.geometry?.coordinates?.[0] as number,
      region: finistere.region,
      departement: finistere,
    });

    const expectedResult = new BrsDiffusionWebsiteView(
      mockedBrsDiffusionWebsite.id,
      payload.source,
      payload.distributorName,
      payload.ofsName,
      mockedGeocodedResponse.properties?.city as string,
      mockedGeocodedResponse.properties?.postcode as string,
      mockedGeocodedResponse.properties?.context as string,
      mockedGeocodedResponse.properties?.citycode as string,
      mockedGeocodedResponse.geometry?.coordinates?.[1] as number,
      mockedGeocodedResponse.geometry?.coordinates?.[0] as number,
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

    const result = await useCase.execute(payload);

    expect(result).toMatchObject(expectedResult);
    expect(mockedBrsDiffusionWebsiteRepository.findById).toHaveBeenCalledTimes(
      1,
    );
    expect(mockedBrsDiffusionWebsiteRepository.findById).toHaveBeenCalledWith(
      payload.id,
    );
    expect(mockedGeocoderService.geocodeByMunicipality).toHaveBeenCalledTimes(
      1,
    );
    expect(mockedGeocoderService.geocodeByMunicipality).toHaveBeenCalledWith(
      payload.city,
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
        payload.source,
        payload.distributorName,
        payload.ofsName,
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

  it('should update a brs diffusion website without geocoding', async () => {
    const payload = {
      id: '1234',
      source: 'https://source_updated.fr',
      distributorName: 'Commercialisateur_updated',
      ofsName: 'OFS_updated',
      city: mockedBrsDiffusionWebsite.city,
    };

    mockedBrsDiffusionWebsiteRepository.findById.mockResolvedValue(
      mockedBrsDiffusionWebsite,
    );
    mockedBrsDiffusionWebsiteRepository.save.mockResolvedValue({
      ...mockedBrsDiffusionWebsite,
      source: payload.source,
      distributorName: payload.distributorName,
      ofsName: payload.ofsName,
    });

    const expectedResult = new BrsDiffusionWebsiteView(
      mockedBrsDiffusionWebsite.id,
      payload.source,
      payload.distributorName,
      payload.ofsName,
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

    const result = await useCase.execute(payload);

    expect(result).toMatchObject(expectedResult);
    expect(mockedBrsDiffusionWebsiteRepository.findById).toHaveBeenCalledTimes(
      1,
    );
    expect(mockedBrsDiffusionWebsiteRepository.findById).toHaveBeenCalledWith(
      payload.id,
    );
    expect(mockedGeocoderService.geocodeByMunicipality).not.toHaveBeenCalled();
    expect(
      mockedGeocoderService.getZipcodeFirstTwoDigits,
    ).not.toHaveBeenCalled();
    expect(mockDepartementRepository.findOneByCode).not.toHaveBeenCalled();
    expect(mockedBrsDiffusionWebsiteRepository.save).toHaveBeenCalledTimes(1);
    expect(mockedBrsDiffusionWebsiteRepository.save).toHaveBeenCalledWith(
      new BrsDiffusionWebsiteEntity(
        payload.source,
        payload.distributorName,
        payload.ofsName,
        mockedBrsDiffusionWebsite.city,
        mockedBrsDiffusionWebsite.zipcode,
        mockedBrsDiffusionWebsite.address,
        mockedBrsDiffusionWebsite.inseeCode,
        mockedBrsDiffusionWebsite.latitude,
        mockedBrsDiffusionWebsite.longitude,
        mockedBrsDiffusionWebsite.region,
        mockedBrsDiffusionWebsite.departement,
      ),
    );
  });

  it('should throw a NotFoundException if the brs diffusion website does not exist', async () => {
    const payload = {
      id: '1234',
      source: 'https://source_updated.fr',
      distributorName: 'Commercialisateur_updated',
      ofsName: 'OFS_updated',
      city: mockedBrsDiffusionWebsite.city,
    };

    mockedBrsDiffusionWebsiteRepository.findById.mockResolvedValue(null);

    try {
      await useCase.execute(payload);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(
        mockedBrsDiffusionWebsiteRepository.findById,
      ).toHaveBeenCalledTimes(1);
      expect(mockedBrsDiffusionWebsiteRepository.findById).toHaveBeenCalledWith(
        '1234',
      );
      expect(
        mockedGeocoderService.geocodeByMunicipality,
      ).not.toHaveBeenCalled();
      expect(
        mockedGeocoderService.getZipcodeFirstTwoDigits,
      ).not.toHaveBeenCalled();
      expect(mockDepartementRepository.findOneByCode).not.toHaveBeenCalled();
      expect(mockedBrsDiffusionWebsiteRepository.save).not.toHaveBeenCalled();
    }
  });

  it('should throw a BadRequestException if the municipality is not found', async () => {
    const payload = {
      source: 'https://source_updated.fr',
      distributorName: 'Commercialisateur_updated',
      ofsName: 'OFS_updated',
      city: 'Minas Ithil',
    };

    mockedBrsDiffusionWebsiteRepository.findById.mockResolvedValue(
      mockedBrsDiffusionWebsite,
    );
    mockedGeocoderService.geocodeByMunicipality.mockResolvedValue(null);

    try {
      await useCase.execute({
        id: '1234',
        ...payload,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect(
        mockedBrsDiffusionWebsiteRepository.findById,
      ).toHaveBeenCalledTimes(1);
      expect(mockedBrsDiffusionWebsiteRepository.findById).toHaveBeenCalledWith(
        '1234',
      );
      expect(mockedGeocoderService.geocodeByMunicipality).toHaveBeenCalledTimes(
        1,
      );
      expect(mockedGeocoderService.geocodeByMunicipality).toHaveBeenCalledWith(
        payload.city,
      );
      expect(
        mockedGeocoderService.getZipcodeFirstTwoDigits,
      ).not.toHaveBeenCalled();
      expect(mockDepartementRepository.findOneByCode).not.toHaveBeenCalled();
      expect(mockedBrsDiffusionWebsiteRepository.save).not.toHaveBeenCalled();
    }
  });

  it('should throw a NotFoundException if the departement is not found', async () => {
    const payload = {
      id: '1234',
      source: 'https://source_updated.fr',
      distributorName: 'Commercialisateur_updated',
      ofsName: 'OFS_updated',
      city: 'Quimper',
    };

    mockedBrsDiffusionWebsiteRepository.findById.mockResolvedValue(
      mockedBrsDiffusionWebsite,
    );
    mockedGeocoderService.geocodeByMunicipality.mockResolvedValue(
      mockedGeocodedResponse,
    );
    mockedGeocoderService.getZipcodeFirstTwoDigits.mockReturnValue('99');
    mockDepartementRepository.findOneByCode.mockResolvedValue(null);

    try {
      await useCase.execute(payload);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(
        mockedBrsDiffusionWebsiteRepository.findById,
      ).toHaveBeenCalledTimes(1);
      expect(mockedGeocoderService.geocodeByMunicipality).toHaveBeenCalledTimes(
        1,
      );
      expect(mockedGeocoderService.geocodeByMunicipality).toHaveBeenCalledWith(
        payload.city,
      );
      expect(
        mockedGeocoderService.getZipcodeFirstTwoDigits,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockedGeocoderService.getZipcodeFirstTwoDigits,
      ).toHaveBeenCalledWith(mockedGeocodedResponse.properties?.postcode);
      expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledTimes(1);
      expect(mockDepartementRepository.findOneByCode).toHaveBeenCalledWith(
        '99',
      );
      expect(mockedBrsDiffusionWebsiteRepository.save).not.toHaveBeenCalled();
    }
  });
});

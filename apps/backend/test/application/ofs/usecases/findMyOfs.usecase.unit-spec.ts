import { Test } from '@nestjs/testing';
import { FindMyOfsUsecase } from 'src/application/ofs/usecases/findMyOfs.usecase';
import { mockedBrsDiffusionWebsiteRepository } from 'test/mocks/integration/brs-diffusion-website';
import {
  mockedGeocodedResponse,
  mockedGeocoderService,
} from 'test/mocks/integration/geocoder';
import { mockedBrsDiffusionWebsite } from 'test/mocks/integration/brs-diffusion-website';
import { ofs1 } from 'test/mocks/integration/ofs';

describe('FindMyOfsUsecase', () => {
  let findMyOfsUsecase: FindMyOfsUsecase;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        FindMyOfsUsecase,
        {
          provide: 'GeocoderServiceInterface',
          useValue: mockedGeocoderService,
        },
        {
          provide: 'BrsDiffusionWebsiteRepositoryInterface',
          useValue: mockedBrsDiffusionWebsiteRepository,
        },
      ],
    }).compile();

    findMyOfsUsecase = module.get<FindMyOfsUsecase>(FindMyOfsUsecase);
  });

  it('returns deduplicated OFS candidates ordered by distance from the repository', async () => {
    const ofs = Object.assign(ofs1, { id: 'ofs-id' });
    const program = Object.assign(mockedBrsDiffusionWebsite, {
      ofs,
      distance: 1234,
    });

    mockedGeocoderService.geocodeByAddress.mockResolvedValue([
      mockedGeocodedResponse,
    ]);
    mockedBrsDiffusionWebsiteRepository.findNearestOfssByLocation.mockResolvedValue(
      [program],
    );

    const result = await findMyOfsUsecase.execute({
      address: '1 rue de la Paix, Vannes',
    });

    expect(mockedGeocoderService.geocodeByAddress).toHaveBeenCalledWith(
      '1 rue de la Paix, Vannes',
    );
    expect(
      mockedBrsDiffusionWebsiteRepository.findNearestOfssByLocation,
    ).toHaveBeenCalledWith(47.659971, -2.752192, 10);
    expect(result).toHaveLength(1);
    expect(result[0].ofs.name).toBe(ofs.name);
    expect(result[0].distance).toBe(1234);
  });
});

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
    const secondProgram = Object.assign(
      Object.create(Object.getPrototypeOf(mockedBrsDiffusionWebsite)),
      mockedBrsDiffusionWebsite,
      {
        ofs,
        distance: 4567,
        address: '2 rue du Port',
        city: 'Vannes',
        zipcode: '56000',
        programName: 'Second programme',
      },
    );

    mockedGeocoderService.geocodeByAddress.mockResolvedValue([
      mockedGeocodedResponse,
    ]);
    mockedBrsDiffusionWebsiteRepository.findNearestOfssByLocation.mockResolvedValue(
      [program, secondProgram],
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
    expect(result[0].programs).toHaveLength(2);
    expect(result[0].nearestProgram.address).toBe(program.address);
  });
});

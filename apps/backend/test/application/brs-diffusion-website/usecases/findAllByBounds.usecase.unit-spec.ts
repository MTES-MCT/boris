import { Test, TestingModule } from '@nestjs/testing';
import { FindAllBrsDiffusionWebsitesByBoundsUsecase } from 'src/application/brs-diffusion-website/usecases/findAllByBounds.usecase';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import {
  DEFAULT_PAGINATION,
  Pagination,
} from 'src/application/common/pagination';
import {
  mockedBrsDiffusionWebsite,
  mockedBrsDiffusionWebsiteRepository,
} from 'test/mocks/integration/brs-diffusion-website';

describe('FindAllBrsDiffusionWebsitesByBounds', () => {
  let useCase: FindAllBrsDiffusionWebsitesByBoundsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllBrsDiffusionWebsitesByBoundsUsecase,
        {
          provide: 'BrsDiffusionWebsiteRepositoryInterface',
          useValue: mockedBrsDiffusionWebsiteRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllBrsDiffusionWebsitesByBoundsUsecase>(
      FindAllBrsDiffusionWebsitesByBoundsUsecase,
    );
  });

  it('should return all brs diffusion in certain bounds', async () => {
    mockedBrsDiffusionWebsiteRepository.findAllByBounds.mockResolvedValue([
      [mockedBrsDiffusionWebsite],
      1,
    ]);

    const expectedResult = new Pagination(
      [
        new BrsDiffusionWebsiteView(
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
        ),
      ],
      1,
      DEFAULT_PAGINATION,
    );

    const result = await useCase.execute({
      ...DEFAULT_PAGINATION,
      northEastLat: 48,
      northEastLng: 40,
      southWestLat: 48,
      southWestLng: 40
    });

    expect(result).toMatchObject(expectedResult);
    expect(
      mockedBrsDiffusionWebsiteRepository.findAllByBounds,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockedBrsDiffusionWebsiteRepository.findAllByBounds,
    ).toHaveBeenCalledWith(DEFAULT_PAGINATION, 48, 40, 48, 40);
  });
});

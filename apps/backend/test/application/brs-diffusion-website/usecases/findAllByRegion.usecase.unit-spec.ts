import { Test, TestingModule } from '@nestjs/testing';
import { FindAllBrsDiffusionWebsitesByRegionUsecase } from 'src/application/brs-diffusion-website/usecases/findAllByRegion.usecase';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import {
  DEFAULT_PAGINATION,
  Pagination,
} from 'src/application/common/pagination';
import {
  mockedBrsDiffusionWebsite,
  mockedBrsDiffusionWebsiteRepository,
} from 'test/mocks/integration/brs-diffusion-website';

describe('FindAllBrsDiffusionWebsitesByRegionUsecase', () => {
  let useCase: FindAllBrsDiffusionWebsitesByRegionUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllBrsDiffusionWebsitesByRegionUsecase,
        {
          provide: 'BrsDiffusionWebsiteRepositoryInterface',
          useValue: mockedBrsDiffusionWebsiteRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllBrsDiffusionWebsitesByRegionUsecase>(
      FindAllBrsDiffusionWebsitesByRegionUsecase,
    );
  });

  it('should return all brs diffusion websites by region', async () => {
    mockedBrsDiffusionWebsiteRepository.findAllByRegion.mockResolvedValue([
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
      regionId: '1234',
    });

    expect(result).toMatchObject(expectedResult);
    expect(
      mockedBrsDiffusionWebsiteRepository.findAllByRegion,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockedBrsDiffusionWebsiteRepository.findAllByRegion,
    ).toHaveBeenCalledWith(DEFAULT_PAGINATION, '1234');
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FindAllBrsDiffusionWebsitesUsecase } from 'src/application/brs-diffusion-website/usecases/findAll.usecase';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import {
  DEFAULT_PAGINATION,
  Pagination,
} from 'src/application/common/pagination';
import {
  mockedBrsDiffusionWebsite,
  mockedBrsDiffusionWebsiteRepository,
} from 'test/mocks/integration/brs-diffusion-website';

describe('FindAllBrsDiffusionWebsitesUsecase', () => {
  let useCase: FindAllBrsDiffusionWebsitesUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllBrsDiffusionWebsitesUsecase,
        {
          provide: 'BrsDiffusionWebsiteRepositoryInterface',
          useValue: mockedBrsDiffusionWebsiteRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllBrsDiffusionWebsitesUsecase>(
      FindAllBrsDiffusionWebsitesUsecase,
    );
  });

  it('should return all brs diffusion websites', async () => {
    mockedBrsDiffusionWebsiteRepository.findAll.mockResolvedValue([
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

    const result = await useCase.execute(DEFAULT_PAGINATION);

    expect(result).toMatchObject(expectedResult);
    expect(mockedBrsDiffusionWebsiteRepository.findAll).toHaveBeenCalledTimes(
      1,
    );
    expect(mockedBrsDiffusionWebsiteRepository.findAll).toHaveBeenCalledWith(
      DEFAULT_PAGINATION,
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FindAllBrsDiffusionWebsitesByDepartementUsecase } from 'src/application/brs-diffusion-website/usecases/findAllByDepartement.usecase';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import {
  DEFAULT_PAGINATION,
  Pagination,
} from 'src/application/common/pagination';
import {
  mockedBrsDiffusionWebsite,
  mockedBrsDiffusionWebsiteRepository,
} from 'test/mocks/integration/brs-diffusion-website';

describe('FindAllBrsDiffusionWebsitesByDepartementUsecase', () => {
  let useCase: FindAllBrsDiffusionWebsitesByDepartementUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllBrsDiffusionWebsitesByDepartementUsecase,
        {
          provide: 'BrsDiffusionWebsiteRepositoryInterface',
          useValue: mockedBrsDiffusionWebsiteRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllBrsDiffusionWebsitesByDepartementUsecase>(
      FindAllBrsDiffusionWebsitesByDepartementUsecase,
    );
  });

  it('should return all brs diffusion websites by departement', async () => {
    mockedBrsDiffusionWebsiteRepository.findAllByDepartement.mockResolvedValue([
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
      departementId: '1234',
    });

    expect(result).toMatchObject(expectedResult);
    expect(
      mockedBrsDiffusionWebsiteRepository.findAllByDepartement,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockedBrsDiffusionWebsiteRepository.findAllByDepartement,
    ).toHaveBeenCalledWith(DEFAULT_PAGINATION, '1234');
  });
});

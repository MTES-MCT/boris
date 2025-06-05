import { Test, TestingModule } from '@nestjs/testing';
import { FindAllRegionsUsecase } from 'src/application/region/usecases/findAll.usecase';
import { RegionView } from 'src/application/region/views/region.view';
import {
  DEFAULT_PAGINATION,
  Pagination,
} from 'src/application/pagination/pagination';
import {
  bretagne,
  ileDeFrance,
  mockRegionRepository,
} from 'test/mocks/integration/region';

describe('FindAllRegionsUsecase', () => {
  let useCase: FindAllRegionsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllRegionsUsecase,
        {
          provide: 'RegionRepositoryInterface',
          useValue: mockRegionRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllRegionsUsecase>(FindAllRegionsUsecase);
  });

  it('should return all regions', async () => {
    mockRegionRepository.findAll.mockReturnValue([[bretagne, ileDeFrance], 2]);

    const expectedResult = new Pagination(
      [
        new RegionView(bretagne.id, bretagne.name),
        new RegionView(ileDeFrance.id, ileDeFrance.name),
      ],
      2,
      DEFAULT_PAGINATION,
    );

    const result = await useCase.execute(DEFAULT_PAGINATION);

    expect(result).toMatchObject(expectedResult);
    expect(mockRegionRepository.findAll).toHaveBeenCalledTimes(1);
  });
});

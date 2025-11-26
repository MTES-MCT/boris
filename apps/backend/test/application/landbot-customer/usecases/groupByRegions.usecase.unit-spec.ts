import { Test, TestingModule } from '@nestjs/testing';
import { GroupByRegionsUsecase } from 'src/application/landbot-customer/usecases/groupByRegions.usecase';
import { LandbotCustomerGroupByRegionsView } from 'src/application/landbot-customer/views/landbot-customer-group-by-regions.view';
import { mockLandbotCustomerRepository } from 'test/mocks/integration/landbot-customer';

describe('GroupByRegionsUsecase', () => {
  let useCase: GroupByRegionsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupByRegionsUsecase,
        {
          provide: 'LandbotCustomerRepositoryInterface',
          useValue: mockLandbotCustomerRepository,
        },
      ],
    }).compile();

    useCase = module.get<GroupByRegionsUsecase>(GroupByRegionsUsecase);
  });

  it('should group by regions and return a view with data and total', async () => {
    const mockGroupByRegionsResults = [
      { regionName: 'Bretagne', regionCode: '53', count: '10' },
      { regionName: 'Île-de-France', regionCode: '11', count: '15' },
    ];
    const total = 25;

    mockLandbotCustomerRepository.groupByRegions.mockResolvedValue([
      mockGroupByRegionsResults,
      total,
    ]);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(LandbotCustomerGroupByRegionsView);
    expect(result.data).toEqual(mockGroupByRegionsResults);
    expect(result.total).toBe(total);
    expect(mockLandbotCustomerRepository.groupByRegions).toHaveBeenCalledTimes(
      1,
    );
    expect(mockLandbotCustomerRepository.groupByRegions).toHaveBeenCalledWith();
  });

  it('should return an empty array and 0 total when no results are found', async () => {
    mockLandbotCustomerRepository.groupByRegions.mockResolvedValue([[], 0]);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(LandbotCustomerGroupByRegionsView);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
    expect(mockLandbotCustomerRepository.groupByRegions).toHaveBeenCalledTimes(
      1,
    );
    expect(mockLandbotCustomerRepository.groupByRegions).toHaveBeenCalledWith();
  });
});

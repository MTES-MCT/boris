import { Test, TestingModule } from '@nestjs/testing';
import { CalculateConversionFunnelUsecase } from 'src/application/landbot-customer/usecases/calculateConversionFunnel.usecase';
import { LandbotCustomerCalculateFunnelConversionView } from 'src/application/landbot-customer/views/landbot-customer-calculate-conversion-tunnel.view';
import { mockLandbotCustomerRepository } from 'test/mocks/integration/landbot-customer';
import { ConversionFunnelResult } from 'src/domain/landbot-customer/landbot-customer.repository.interface';

describe('CalculateConversionFunnelUsecase', () => {
  let useCase: CalculateConversionFunnelUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalculateConversionFunnelUsecase,
        {
          provide: 'LandbotCustomerRepositoryInterface',
          useValue: mockLandbotCustomerRepository,
        },
      ],
    }).compile();

    useCase = module.get<CalculateConversionFunnelUsecase>(
      CalculateConversionFunnelUsecase,
    );
  });

  it('should calculate conversion funnel', async () => {
    const mockConversionFunnelResult: ConversionFunnelResult = {
      totalSimulations: 105,
      totalHouseholdProvided: 105,
      totalEligble: 84,
      totalConnectionWish: 54,
      totalEmailProvided: 32,
      totalDesiredCityProvided: 32,
    };

    mockLandbotCustomerRepository.calculateConversionFunnel.mockResolvedValue(
      mockConversionFunnelResult,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(LandbotCustomerCalculateFunnelConversionView);
    expect(result.totalSimulations).toEqual(
      mockConversionFunnelResult.totalSimulations,
    );
    expect(result.totalHouseholdProvided).toEqual(
      mockConversionFunnelResult.totalHouseholdProvided,
    );
    expect(result.totalEligble).toEqual(
      mockConversionFunnelResult.totalEligble,
    );
    expect(result.totalConnectionWish).toEqual(
      mockConversionFunnelResult.totalConnectionWish,
    );
    expect(result.totalEmailProvided).toEqual(
      mockConversionFunnelResult.totalEmailProvided,
    );
    expect(result.totalDesiredCityProvided).toEqual(
      mockConversionFunnelResult.totalDesiredCityProvided,
    );
    expect(
      mockLandbotCustomerRepository.calculateConversionFunnel,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.calculateConversionFunnel,
    ).toHaveBeenCalledWith();
  });
});

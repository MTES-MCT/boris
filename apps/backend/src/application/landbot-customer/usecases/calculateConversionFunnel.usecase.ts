import { Inject } from '@nestjs/common';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotCustomerCalculateFunnelConversionView } from '../views/landbot-customer-calculate-conversion-tunnel.view';

export class CalculateConversionFunnelUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(): Promise<LandbotCustomerCalculateFunnelConversionView> {
    const result =
      await this.landbotCustomerRepository.calculateConversionFunnel();

    return new LandbotCustomerCalculateFunnelConversionView(result);
  }
}

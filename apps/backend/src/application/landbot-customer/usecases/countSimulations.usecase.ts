import { Inject } from '@nestjs/common';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { CountSimulationsParams } from './countSimulations.params';

export class CountSimulationsUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(params: CountSimulationsParams): Promise<number> {
    const { year, month } = params;

    return this.landbotCustomerRepository.countSimulations(year, month);
  }
}

import { Inject } from '@nestjs/common';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotCustomerGroupByRegionsView } from '../views/landbot-customer-group-by-regions.view';

export class GroupByRegionsUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(): Promise<LandbotCustomerGroupByRegionsView> {
    const [result, total] =
      await this.landbotCustomerRepository.groupByRegions();
    return new LandbotCustomerGroupByRegionsView(result, total);
  }
}

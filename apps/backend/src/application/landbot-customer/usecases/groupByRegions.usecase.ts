import { Inject } from '@nestjs/common';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotCustomerGroupByRegionsView } from '../views/landbot-customer-group-by-regions.view';
import { GroupByRegionsParams } from './groupByRegion.params';

export class GroupByRegionsUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(
    params: GroupByRegionsParams,
  ): Promise<LandbotCustomerGroupByRegionsView> {
    const { year, month } = params;

    const [result, total] = await this.landbotCustomerRepository.groupByRegions(
      year,
      month,
    );

    return new LandbotCustomerGroupByRegionsView(result, total);
  }
}

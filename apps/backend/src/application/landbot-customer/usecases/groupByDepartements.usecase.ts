import { Inject } from '@nestjs/common';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotCustomerGroupByDepartementsView } from '../views/landbot-customer-group-by-departements.view';

export class GroupByDepartementsUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(): Promise<LandbotCustomerGroupByDepartementsView> {
    const result = await this.landbotCustomerRepository.groupByDepartements();

    return new LandbotCustomerGroupByDepartementsView(result);
  }
}

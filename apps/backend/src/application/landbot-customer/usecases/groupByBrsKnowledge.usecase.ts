import { Inject } from '@nestjs/common';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotBrsKnowledge } from 'src/domain/landbot-customer/landbot-customer.interface';
import { LandbotCustomerGroupByView } from '../views/landbot-customer-group-by.view';

export class GroupByBrsKnowledgeUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(): Promise<
    LandbotCustomerGroupByView<'brsKnowledge', LandbotBrsKnowledge>
  > {
    const result = await this.landbotCustomerRepository.groupByBrsKnowledge();

    return new LandbotCustomerGroupByView<'brsKnowledge', LandbotBrsKnowledge>(
      result,
    );
  }
}

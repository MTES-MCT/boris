import { Inject, NotFoundException } from '@nestjs/common';
import { LandbotCustomerView } from '../views/landbot-customer.view';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';

export class FindLastLandbotCustomerUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(): Promise<LandbotCustomerView> {
    const landbotCustomer = await this.landbotCustomerRepository.findLast();

    if (!landbotCustomer) {
      throw new NotFoundException();
    }

    return new LandbotCustomerView(
      landbotCustomer.id,
      landbotCustomer.date,
      landbotCustomer.desiredCity,
      landbotCustomer.departement
        ? {
            id: landbotCustomer.departement?.id,
            name: landbotCustomer.departement.name,
            code: landbotCustomer.departement.code,
          }
        : undefined,
      landbotCustomer.eligibility,
      landbotCustomer.brsKnowledge,
      landbotCustomer.realEstateSituation,
    );
  }
}

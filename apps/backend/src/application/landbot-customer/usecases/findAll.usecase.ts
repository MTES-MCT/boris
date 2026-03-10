import { Inject } from '@nestjs/common';
import { FindAllLandbotCustomersParams } from './findAll.params';
import { Pagination } from 'src/application/common/pagination';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotCustomerView } from '../views/landbot-customer.view';

export class FindAllLandbotCustomersUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(
    params: FindAllLandbotCustomersParams,
  ): Promise<Pagination<LandbotCustomerView>> {
    const { page, pageSize } = params;
    const paginationProps = { page, pageSize };

    const [landbotCustomers, totalCount] =
      await this.landbotCustomerRepository.findAll(paginationProps);

    const items = landbotCustomers.map((landbotCustomer) => {
      return new LandbotCustomerView(
        landbotCustomer.id,
        landbotCustomer.date,
        landbotCustomer.desiredCity,
        landbotCustomer.departement
          ? {
              id: landbotCustomer.departement.id,
              name: landbotCustomer.departement.name,
              code: landbotCustomer.departement.code,
            }
          : undefined,
        landbotCustomer.eligibility,
        landbotCustomer.brsKnowledge,
        landbotCustomer.realEstateSituation,
        landbotCustomer.disability,
        landbotCustomer.declarationType,
        landbotCustomer.connectionWish,
        landbotCustomer.resources,
        landbotCustomer.hasProvidedEmail,
      );
    });

    return new Pagination(items, totalCount, { page, pageSize });
  }
}

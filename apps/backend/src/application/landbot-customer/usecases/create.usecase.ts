import { Inject } from '@nestjs/common';
import { LandbotCustomerView } from '../views/landbot-customer.view';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { CreateLandbotCustomerParams } from './create.params';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotCustomerEntity } from 'src/infrastructure/landbot-customer/landbot-customer.entity';

export class CreateLandbotCustomerUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
  ) {}

  public async execute(
    params: CreateLandbotCustomerParams,
  ): Promise<LandbotCustomerView> {
    const {
      date,
      departementCode,
      eligibility,
      brsKnowledge,
      realEstateSituation,
    } = params;

    const departement =
      await this.departementRepository.findOneByCode(departementCode);

    const landbotCustomer = await this.landbotCustomerRepository.save(
      new LandbotCustomerEntity(
        date,
        departement || undefined,
        eligibility,
        brsKnowledge,
        realEstateSituation,
      ),
    );

    return new LandbotCustomerView(
      landbotCustomer.id,
      landbotCustomer.date,
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

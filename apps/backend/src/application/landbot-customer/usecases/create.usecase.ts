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
      desiredCity,
      departementCode,
      eligibility,
      brsKnowledge,
      realEstateSituation,
      disability,
      declarationType,
      connectionWish,
      resources,
      hasProvidedEmail,
    } = params;

    let departement;

    if (departementCode) {
      departement =
        await this.departementRepository.findOneByCode(departementCode);
    }

    const landbotCustomer = await this.landbotCustomerRepository.save(
      new LandbotCustomerEntity(
        date,
        desiredCity,
        departement || undefined,
        eligibility,
        brsKnowledge,
        realEstateSituation,
        disability,
        declarationType,
        connectionWish,
        resources,
        hasProvidedEmail,
      ),
    );

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
      landbotCustomer.disability,
      landbotCustomer.declarationType,
      landbotCustomer.connectionWish,
      landbotCustomer.resources,
      landbotCustomer.hasProvidedEmail,
    );
  }
}

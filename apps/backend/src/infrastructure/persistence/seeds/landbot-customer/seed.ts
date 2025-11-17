import { Inject, Injectable } from '@nestjs/common';
import { CreateLandbotCustomerUsecase } from 'src/application/landbot-customer/usecases/create.usecase';
import { LandbotApiClientRepositoryInterface } from 'src/domain/landbot-api-client/landbot-api-client.repository.interface';
// import { CreateMunicipalityUsecase } from 'src/application/municipality/usecases/create.usecase';

@Injectable()
export class LandbotCustomerSeed {
  constructor(
    @Inject('LandbotApiClientRepositoryInterface')
    private readonly landbotApiClientRepository: LandbotApiClientRepositoryInterface,
    private readonly createLandbotCustomerUsecase: CreateLandbotCustomerUsecase,
  ) {}

  async seed() {
    const { total } = await this.landbotApiClientRepository.listCustomers(0, 0);
    let offset = 0;
    const limit = 100;

    while (offset <= total) {
      console.log(`Fetching customers from ${offset} to ${offset + limit}`);

      const { customers } = await this.landbotApiClientRepository.listCustomers(
        offset,
        limit,
      );

      for (const customer of customers) {
        // console.log(new Date(customer.register_date * 1000));

        // await this.createLandbotCustomerUsecase.execute({
        //   date: new Date(customer.register_date * 1000),
        //   departementCode: customer.custom_fields.departement,
        //   eligibility: customer.custom_fields.eligibility,
        //   brsKnowledge: customer.custom_fields.brsKnowledge,
        //   realEstateSituation: customer.custom_fields.realEstateSituation,
        // });

        console.log(customer.custom_fields.eligibilite1);

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      offset += limit;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

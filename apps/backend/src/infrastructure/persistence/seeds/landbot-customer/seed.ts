import { Inject, Injectable } from '@nestjs/common';
import { CreateLandbotCustomerUsecase } from 'src/application/landbot-customer/usecases/create.usecase';
import { LandbotApiClientRepositoryInterface } from 'src/domain/landbot-api-client/landbot-api-client.repository.interface';
import { LandbotRealEstateSituation } from 'src/domain/landbot-customer/landbot-customer.interface';

@Injectable()
export class LandbotCustomerSeed {
  constructor(
    @Inject('LandbotApiClientRepositoryInterface')
    private readonly landbotApiClientRepository: LandbotApiClientRepositoryInterface,
    private readonly createLandbotCustomerUsecase: CreateLandbotCustomerUsecase,
  ) {}

  async seed() {
    const { total } = await this.landbotApiClientRepository.listCustomers(0, 0);
    let offset = 5600;
    const limit = 100;
    let landbotCustomersCount = 0;

    while (offset <= total) {
      console.log(`Fetching customers from ${offset} to ${offset + limit}`);

      const { customers } = await this.landbotApiClientRepository.listCustomers(
        offset,
        limit,
      );

      for (const customer of customers) {
        const {
          eligibilite1: eligibility,
          ville_souhaitee: desiredCity,
          departement: departementCode,
          situation_immo: realEstateSituation,
          connaissancebrs: brsKnowledge,
        } = customer;

        if (eligibility) {
          await this.createLandbotCustomerUsecase.execute({
            date: new Date(customer.register_date * 1000),
            desiredCity,
            departementCode,
            eligibility,
            brsKnowledge,
            realEstateSituation: realEstateSituation?.endsWith(' ')
              ? (realEstateSituation.trimEnd() as LandbotRealEstateSituation)
              : realEstateSituation,
          });

          landbotCustomersCount += 1;
        }
      }

      console.log(`${landbotCustomersCount} landbot customers créés`);

      offset += limit;

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}

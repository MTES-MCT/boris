import { Cron } from '@nestjs/schedule';
import { Inject, Injectable } from '@nestjs/common';
import { FindLastLandbotCustomerUsecase } from 'src/application/landbot-customer/usecases/findLast.usecase';
import { LandbotApiClientRepositoryInterface } from 'src/domain/landbot-api-client/landbot-api-client.repository.interface';
import { CreateLandbotCustomerUsecase } from 'src/application/landbot-customer/usecases/create.usecase';
import { LandbotRealEstateSituation } from 'src/domain/landbot-customer/landbot-customer.interface';

@Injectable()
export class ImportLandbotCustomersCron {
  constructor(
    @Inject('LandbotApiClientRepositoryInterface')
    private readonly landbotApiClientRepository: LandbotApiClientRepositoryInterface,
    private readonly findLastLandbotCustomerUsecase: FindLastLandbotCustomerUsecase,
    private readonly createLandbotCustomerUsecase: CreateLandbotCustomerUsecase,
  ) {}

  @Cron('35 18 * * *', { timeZone: 'Europe/Paris' })
  public async execute() {
    console.log('Import des données Landbot...');

    const lastLandbotCustomer =
      await this.findLastLandbotCustomerUsecase.execute();

    const pastDatesTrehshold = 5; // Landbot API sometimes throw customers with register_date in the deep past, so we set a treshold to 10 past dates to avoid missing correct data
    let pastDatesCount = 0;
    const { date } = lastLandbotCustomer;
    console.log('Last landbot customer', lastLandbotCustomer);
    let offset = 0;
    const limit = 25;
    let landbotCustomersCount = 0;

    while (pastDatesCount < pastDatesTrehshold) {
      console.log(
        `Récupérations des landbot customers de ${offset} à ${offset + limit}`,
      );

      const { customers } = await this.landbotApiClientRepository.listCustomers(
        offset,
        limit,
      );

      for (const customer of customers) {
        const {
          register_date,
          eligibilite1: eligibility,
          ville_souhaitee: desiredCity,
          departement: departementCode,
          situation_immo: realEstateSituation,
          connaissancebrs: brsKnowledge,
        } = customer;

        if (new Date(register_date * 1000) > date) {
          try {
            await this.createLandbotCustomerUsecase.execute({
              date: new Date(register_date * 1000),
              desiredCity,
              departementCode,
              eligibility,
              brsKnowledge,
              realEstateSituation: realEstateSituation?.endsWith(' ')
                ? (realEstateSituation.trimEnd() as LandbotRealEstateSituation)
                : realEstateSituation,
            });

            landbotCustomersCount += 1;
          } catch (error) {
            console.log(error);
          }
        } else {
          pastDatesCount += 1;
        }
      }

      offset += limit;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    console.log(`${landbotCustomersCount} landbot customers créés`);
    console.log('Création des landbot customers terminée.');
  }
}

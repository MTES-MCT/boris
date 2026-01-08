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
    let offset = 0;
    const limit = 100;
    let landbotCustomersCount = 0;
    let errorsCount = 0;

    while (offset <= total) {
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
          email,
          handicap: disability,
          declaration_seul_en_commun: declarationType,
          miseenrelation_yesno: connectionWish,
          ressources: resources,
          eligibilite1: eligibility,
          ville_souhaitee: desiredCity,
          departement: departementCode,
          situation_immo: realEstateSituation,
          connaissancebrs: brsKnowledge,
        } = customer;

        try {
          await this.createLandbotCustomerUsecase.execute({
            date: new Date(register_date * 1000),
            hasProvidedEmail: Boolean(email),
            desiredCity,
            departementCode,
            eligibility,
            brsKnowledge,
            realEstateSituation: realEstateSituation?.endsWith(' ')
              ? (realEstateSituation.trimEnd() as LandbotRealEstateSituation)
              : realEstateSituation,
            disability,
            declarationType,
            connectionWish,
            resources: resources ? parseInt(resources) : undefined,
          });

          landbotCustomersCount += 1;
        } catch (error) {
          console.log(error);

          errorsCount += 1;
        }
      }

      console.log(`${landbotCustomersCount} landbot customers créés`);
      console.log(`${errorsCount} erreurs enregistrées`);

      offset += limit;

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    console.log('Création des landbot customers terminée.');
  }
}

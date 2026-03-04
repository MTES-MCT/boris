import { Injectable } from '@nestjs/common';
import { CreateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/create.usecase';
import { UpdateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/update.usecase';
import { FindAllLandbotCustomersUsecase } from 'src/application/landbot-customer/usecases/findAll.usecase';
import { SaveLocationUsecase } from 'src/application/location/usecases/save.usecase';
import {
  DeclarationType,
  PropertySituation,
} from 'src/domain/eligibility-simulation/eligibility-simulation.interface';
import {
  LandbotBrsKnowledge,
  LandbotConnectionWish,
  LandbotDeclarationType,
  LandbotDisability,
  LandbotRealEstateSituation,
} from 'src/domain/landbot-customer/landbot-customer.interface';

@Injectable()
export class EligibilitySimulationsSeed {
  constructor(
    private readonly findAllLandbotCustomersUsecase: FindAllLandbotCustomersUsecase,
    private readonly createEligibilitySimulationUsecase: CreateEligibilitySimulationUsecase,
    private readonly updateEligibilitySimulationUsecase: UpdateEligibilitySimulationUsecase,
    private readonly saveLocationUsecase: SaveLocationUsecase,
  ) {}

  async seed() {
    console.log('Création des eligibility simulations...');
    let eligibilitySimulationsCount = 0;
    let errorsCount = 0;

    let whileHasNextPage = true;
    let currentPage = 1;
    const pageSize = 100;

    while (whileHasNextPage) {
      const {
        totalCount,
        items: landbotCustomers,
        hasNextPage,
      } = await this.findAllLandbotCustomersUsecase.execute({
        page: currentPage,
        pageSize,
      });

      whileHasNextPage = hasNextPage;

      for (const landbotCustomer of landbotCustomers) {
        try {
          const eligibilitySimulation =
            await this.createEligibilitySimulationUsecase.execute({
              householdSize: 0,
              hasDisability:
                landbotCustomer.disability === LandbotDisability.OUI,
              isFromLandbot: true,
              landbotDate: landbotCustomer.date,
            });
          const updatedEligibilitySimulation =
            await this.updateEligibilitySimulationUsecase.execute({
              id: eligibilitySimulation.id,
              eligibility: {
                category: 1,
                eligibleZoneAandAbis:
                  landbotCustomer.eligibility === 1 ||
                  landbotCustomer.eligibility === 2 ||
                  landbotCustomer.eligibility === 4,
                eligibleZoneB1:
                  landbotCustomer.eligibility === 1 ||
                  landbotCustomer.eligibility === 2,
                eligibleZoneB2andC: landbotCustomer.eligibility === 1,
              },
              hadBrsKnowledge:
                landbotCustomer.brsKnowledge === LandbotBrsKnowledge.OUI,
              propertySituation: this.getPropertySituation(
                landbotCustomer.realEstateSituation as LandbotRealEstateSituation,
              ),
              declarationType: this.getDeclarationType(
                landbotCustomer.declarationType as LandbotDeclarationType,
              ),
              hasRefusedConnection:
                landbotCustomer.connectionWish === LandbotConnectionWish.NON,
              resources: landbotCustomer.resources,
              email: landbotCustomer.hasProvidedEmail
                ? 'landbot-customer@landbot.com'
                : undefined,
            });
          if (landbotCustomer.desiredCity && landbotCustomer.departement) {
            await this.saveLocationUsecase.execute({
              name: landbotCustomer.desiredCity,
              latitude: 0,
              longitude: 0,
              city: landbotCustomer.desiredCity,
              label: landbotCustomer.desiredCity,
              municipality: landbotCustomer.desiredCity,
              postalCode: landbotCustomer.departement.code,
              citycode: landbotCustomer.departement.code,
              eligibilitySimulationId: eligibilitySimulation.id,
            });
          }
          if (landbotCustomer.eligibility === 1) {
            console.log(landbotCustomer.eligibility);
            console.log(
              JSON.stringify(updatedEligibilitySimulation.eligibility),
            );
            console.log(' ');
            console.log(' ');
          }
          eligibilitySimulationsCount++;
        } catch (error) {
          console.log(error);
          errorsCount++;
        }
      }

      currentPage++;

      console.log(`${eligibilitySimulationsCount}/${totalCount}`);
      console.log(`${errorsCount} erreurs enregistrées`);

      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    console.log('Création des eligibility simulations terminée.');
  }

  private getPropertySituation(
    realEstateSituation: LandbotRealEstateSituation,
  ): PropertySituation | undefined {
    switch (realEstateSituation) {
      case LandbotRealEstateSituation.PROPRIETAIRE:
        return 'PROPRIETAIRE';
      case LandbotRealEstateSituation.LOCATAIRE_SOCIAL:
        return 'LOCATAIRE_SOCIAL';
      case LandbotRealEstateSituation.LOCATAIRE_PRIVE:
        return 'LOCATAIRE_PRIVE';
      case LandbotRealEstateSituation.HEBERGEE:
        return 'HEBERGE';
      case LandbotRealEstateSituation.AUTRE:
        return 'AUTRE';
      default:
        return undefined;
    }
  }

  private getDeclarationType(
    declarationType: LandbotDeclarationType,
  ): DeclarationType | undefined {
    switch (declarationType) {
      case LandbotDeclarationType.ACHAT_SEUL_SOUHAIT_SEUL:
        return 'SEUL_SOUHAIT_SEUL';
      case LandbotDeclarationType.ACHAT_SEUL_SOUHAIT_PARTENAIRE:
        return 'SEUL_SOUHAIT_PARTENAIRE';
      case LandbotDeclarationType.ACHAT_COMMUN:
        return 'COMMUN';
      default:
        return undefined;
    }
  }
}

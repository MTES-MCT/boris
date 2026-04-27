import { Inject, Injectable } from '@nestjs/common';
import {
  EligibilitySimulationRepositoryInterface,
  PortalEligibilitySimulationContactFilters,
  PortalEligibilitySimulationContactResult,
} from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { PortalContactLineView } from '../views/portal-contact-line.view';

@Injectable()
export class ExportPortalContactLinesUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
  ) {}

  public async execute(
    filters: PortalEligibilitySimulationContactFilters,
  ): Promise<PortalContactLineView[]> {
    const items =
      await this.eligibilitySimulationRepository.findAllPortalContactsByOfsScope(
        filters,
      );

    return items.map((item) => this.toView(item));
  }

  private toView(item: PortalEligibilitySimulationContactResult) {
    return new PortalContactLineView({
      ...item,
      submittedAt: new Date(item.submittedAt),
      propertySituation: this.propertySituationLabel(item.propertySituation),
      housingType: item.housingType,
      isNew: false,
    } as PortalContactLineView);
  }

  private propertySituationLabel(value: string | null) {
    switch (value) {
      case 'PROPRIETAIRE':
        return "Propriétaire d'un logement";
      case 'LOCATAIRE_SOCIAL':
        return "Locataire d'un logement social";
      case 'LOCATAIRE_PRIVE':
        return "Locataire d'un logement privé";
      case 'HEBERGE':
        return 'Hébergé·e';
      case 'AUTRE':
        return 'Autre';
      default:
        return null;
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Pagination } from 'src/application/common/pagination';
import {
  EligibilitySimulationRepositoryInterface,
  PortalEligibilitySimulationContactFilters,
  PortalEligibilitySimulationContactResult,
} from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { PaginationProps } from 'src/domain/common/paginationProps';
import { PortalContactLineView } from '../views/portal-contact-line.view';

@Injectable()
export class FindPortalContactLinesUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
  ) {}

  public async execute(
    pagination: PaginationProps,
    filters: PortalEligibilitySimulationContactFilters & {
      compareDate?: Date | null;
    },
  ): Promise<Pagination<PortalContactLineView>> {
    const [items, total] =
      await this.eligibilitySimulationRepository.findPortalContactsByOfsScope(
        pagination,
        filters,
      );

    return new Pagination(
      items.map((item) => this.toView(item, filters.compareDate || null)),
      total,
      pagination,
    );
  }

  private toView(
    item: PortalEligibilitySimulationContactResult,
    compareDate: Date | null,
  ) {
    return new PortalContactLineView({
      ...item,
      submittedAt: new Date(item.submittedAt),
      propertySituation: this.propertySituationLabel(item.propertySituation),
      housingType: item.housingType,
      isNew: compareDate ? new Date(item.submittedAt) > compareDate : false,
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

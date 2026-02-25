import {
  ContractType,
  DeclarationType,
  EligibilityCategory,
  EmploymentStatus,
  HousingType,
  PositionType,
  PropertySituation,
} from 'src/domain/eligibility-simulation/eligibility-simulation.interface';
import { LocationEntity } from 'src/infrastructure/location/location.entity';

export interface UpdateEligibilitySimulationParams {
  id: string;
  propertySituation?: PropertySituation;
  taxableIncome?: number;
  declarationType?: DeclarationType;
  firstCoBuyerFormattedTaxableIncome?: number;
  secondCoBuyerFormattedTaxableIncome?: number;
  eligibility?: EligibilityCategory;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  hasRefusedConnection?: boolean;
  housingType?: HousingType;
  contribution?: number;
  resources?: number;
  hadBrsKnowledge?: boolean;
  employmentStatus?: EmploymentStatus;
  laposteEmployer?: string;
  canSendInformationsToLaposte?: boolean;
  positionType?: PositionType;
  positionStage?: boolean;
  hasCompanyMoreThan10Employees?: boolean;
  hasCompanyMoreThan50Employees?: boolean;
  allowFinancingAndOwnershipAdvices?: boolean;
  positionContractType?: ContractType;
  locations?: Omit<
    LocationEntity,
    'departement' | 'eligibilitySimulation' | 'createdAt' | 'updatedAt' | 'id'
  >[];
}

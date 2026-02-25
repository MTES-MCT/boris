import {
  ContractType,
  DeclarationType,
  EligibilityCategory,
  EmploymentStatus,
  HousingType,
  PositionType,
  PropertySituation,
} from 'src/domain/eligibility-simulation/eligibility-simulation.interface';
import { LocationInterface } from 'src/domain/location/location.interface';

export interface SaveEligibilitySimulationParams {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  householdSize?: number;
  hasDisability?: boolean;
  propertySituation?: PropertySituation;
  dependantsAmount?: number;
  birthday?: Date;
  coBuyerBirthday?: Date;
  taxableIncome?: number;
  declarationType?: DeclarationType;
  firstCoBuyerFormattedTaxableIncome?: string;
  secondCoBuyerFormattedTaxableIncome?: string;
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
  locations?: LocationInterface[];
}

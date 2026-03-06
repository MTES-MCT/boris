import { SaveLocationParams } from 'src/application/location/usecases/save.params';
import {
  ContractType,
  DeclarationType,
  EligibilityCategory,
  EmploymentStatus,
  HousingType,
  PositionType,
  PropertySituation,
} from 'src/domain/eligibility-simulation/eligibility-simulation.interface';

export interface UpdateEligibilitySimulationParams {
  id: string;
  householdSize?: number;
  hasDisability?: boolean;
  dependantsAmount?: number;
  birthday?: Date;
  coBuyerBirthday?: Date;
  propertySituation?: PropertySituation;
  taxableIncome?: number;
  declarationType?: DeclarationType;
  firstCoBuyerTaxableIncome?: number;
  secondCoBuyerTaxableIncome?: number;
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
  locations?: SaveLocationParams[];
}

import { LocationInterface } from '../location/location.interface';

export type PropertySituation =
  | 'LOCATAIRE_SOCIAL'
  | 'LOCATAIRE_PRIVE'
  | 'PROPRIETAIRE'
  | 'HEBERGE'
  | 'AUTRE';

export type DeclarationType =
  | 'SEUL_SOUHAIT_SEUL'
  | 'SEUL_SOUHAIT_PARTENAIRE'
  | 'COMMUN';

export type EligibilityCategory = {
  category: number;
  eligibleZoneAandAbis: boolean;
  eligibleZoneB1: boolean;
  eligibleZoneB2andC: boolean;
};

export type HousingType = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

export type EmploymentStatus =
  | 'SALARIE_PRIVE_NON_AGRICOLE'
  | 'SALARIE_AGRICOLE'
  | 'SALARIE_PUBLIC_OU_FONCTIONNAIRE'
  | 'INDEPENDANT'
  | 'SALARIE_GROUPE_LA_POSTE'
  | 'SANS_ACTIVITE_PROFESSIONNELLE'
  | 'RETRAITE';

export type PositionType =
  | 'CADRE'
  | 'NON_CADRE'
  | 'NO_CATEGORIE_PROFESSIONNELLE';

export type ContractType = 'CDI' | 'CDD';

export interface EligibilitySimulationInterface {
  id: string;
  householdSize?: number;
  hasDisability?: boolean;
  propertySituation?: PropertySituation;
  dependantsAmount?: number;
  birthday?: Date;
  coBuyerBirthday?: Date;
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
  locations?: LocationInterface[];
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
  createdAt: Date;
  updatedAt: Date;
}

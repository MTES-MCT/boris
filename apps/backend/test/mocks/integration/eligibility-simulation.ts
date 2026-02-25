import { EligibilitySimulationEntity } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.entity';
import type {
  PropertySituation,
  DeclarationType,
  EligibilityCategory,
  HousingType,
  EmploymentStatus,
  PositionType,
  ContractType,
} from 'src/domain/eligibility-simulation/eligibility-simulation.interface';

const eligibilityCategory: EligibilityCategory = {
  category: 1,
  eligibleZoneAandAbis: true,
  eligibleZoneB1: false,
  eligibleZoneB2andC: false,
};

export const mockedEligibilitySimulation = Object.assign(
  new EligibilitySimulationEntity(),
  {
    id: 'eligibility-sim-uuid',
    householdSize: 2,
    hasDisability: false,
    propertySituation: 'LOCATAIRE_PRIVE' as PropertySituation,
    dependantsAmount: 1,
    birthday: new Date('1990-05-15'),
    coBuyerBirthday: new Date('1988-03-20'),
    taxableIncome: 35000,
    declarationType: 'COMMUN' as DeclarationType,
    firstCoBuyerFormattedTaxableIncome: 35000,
    secondCoBuyerFormattedTaxableIncome: 28000,
    eligibility: eligibilityCategory,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '0612345678',
    hasRefusedConnection: false,
    housingType: 'T3' as HousingType,
    contribution: 10000,
    resources: 45000,
    hadBrsKnowledge: true,
    employmentStatus: 'SALARIE_PRIVE_NON_AGRICOLE' as EmploymentStatus,
    laposteEmployer: '',
    canSendInformationsToLaposte: true,
    positionType: 'CADRE' as PositionType,
    positionStage: false,
    hasCompanyMoreThan10Employees: true,
    hasCompanyMoreThan50Employees: false,
    allowFinancingAndOwnershipAdvices: true,
    positionContractType: 'CDI' as ContractType,
    locations: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
);

export const mockEligibilitySimulationRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
};

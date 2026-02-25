import { mockedEligibilitySimulation } from 'test/mocks/integration/eligibility-simulation';
import type {
  PropertySituation,
  DeclarationType,
  EligibilityCategory,
  HousingType,
  EmploymentStatus,
  PositionType,
  ContractType,
} from 'src/domain/eligibility-simulation/eligibility-simulation.interface';

describe('EligibilitySimulationEntity', () => {
  it('getters', () => {
    expect(mockedEligibilitySimulation.id).toBe('eligibility-sim-uuid');
    expect(mockedEligibilitySimulation.householdSize).toBe(2);
    expect(mockedEligibilitySimulation.hasDisability).toBe(false);
    expect(mockedEligibilitySimulation.propertySituation).toBe(
      'LOCATAIRE_PRIVE',
    );
    expect(mockedEligibilitySimulation.dependantsAmount).toBe(1);
    expect(mockedEligibilitySimulation.birthday).toEqual(
      new Date('1990-05-15'),
    );
    expect(mockedEligibilitySimulation.coBuyerBirthday).toEqual(
      new Date('1988-03-20'),
    );
    expect(mockedEligibilitySimulation.taxableIncome).toBe(35000);
    expect(mockedEligibilitySimulation.declarationType).toBe('COMMUN');
    expect(mockedEligibilitySimulation.firstCoBuyerTaxableIncome).toBe(35000);
    expect(mockedEligibilitySimulation.secondCoBuyerTaxableIncome).toBe(28000);
    expect(mockedEligibilitySimulation.eligibility).toEqual({
      category: 1,
      eligibleZoneAandAbis: true,
      eligibleZoneB1: false,
      eligibleZoneB2andC: false,
    });
    expect(mockedEligibilitySimulation.firstName).toBe('Jean');
    expect(mockedEligibilitySimulation.lastName).toBe('Dupont');
    expect(mockedEligibilitySimulation.email).toBe('jean.dupont@example.com');
    expect(mockedEligibilitySimulation.phone).toBe('0612345678');
    expect(mockedEligibilitySimulation.hasRefusedConnection).toBe(false);
    expect(mockedEligibilitySimulation.housingType).toBe('T3');
    expect(mockedEligibilitySimulation.contribution).toBe(10000);
    expect(mockedEligibilitySimulation.resources).toBe(45000);
    expect(mockedEligibilitySimulation.hadBrsKnowledge).toBe(true);
    expect(mockedEligibilitySimulation.employmentStatus).toBe(
      'SALARIE_PRIVE_NON_AGRICOLE',
    );
    expect(mockedEligibilitySimulation.laposteEmployer).toBe('');
    expect(mockedEligibilitySimulation.canSendInformationsToLaposte).toBe(true);
    expect(mockedEligibilitySimulation.positionType).toBe('CADRE');
    expect(mockedEligibilitySimulation.positionStage).toBe(false);
    expect(mockedEligibilitySimulation.hasCompanyMoreThan10Employees).toBe(
      true,
    );
    expect(mockedEligibilitySimulation.hasCompanyMoreThan50Employees).toBe(
      false,
    );
    expect(mockedEligibilitySimulation.allowFinancingAndOwnershipAdvices).toBe(
      true,
    );
    expect(mockedEligibilitySimulation.positionContractType).toBe('CDI');
    expect(mockedEligibilitySimulation.createdAt).toEqual(
      new Date('2024-01-15'),
    );
    expect(mockedEligibilitySimulation.updatedAt).toEqual(
      new Date('2024-01-15'),
    );
  });

  it('setters', () => {
    const newEligibility: EligibilityCategory = {
      category: 2,
      eligibleZoneAandAbis: false,
      eligibleZoneB1: true,
      eligibleZoneB2andC: true,
    };
    const newDate = new Date('2024-02-20');

    mockedEligibilitySimulation.householdSize = 3;
    mockedEligibilitySimulation.hasDisability = true;
    mockedEligibilitySimulation.propertySituation =
      'PROPRIETAIRE' as PropertySituation;
    mockedEligibilitySimulation.dependantsAmount = 2;
    mockedEligibilitySimulation.birthday = new Date('1985-01-10');
    mockedEligibilitySimulation.coBuyerBirthday = new Date('1987-07-22');
    mockedEligibilitySimulation.taxableIncome = 42000;
    mockedEligibilitySimulation.declarationType =
      'SEUL_SOUHAIT_SEUL' as DeclarationType;
    mockedEligibilitySimulation.firstCoBuyerTaxableIncome = 42000;
    mockedEligibilitySimulation.secondCoBuyerTaxableIncome = 30000;
    mockedEligibilitySimulation.eligibility = newEligibility;
    mockedEligibilitySimulation.firstName = 'Marie';
    mockedEligibilitySimulation.lastName = 'Martin';
    mockedEligibilitySimulation.email = 'marie.martin@example.com';
    mockedEligibilitySimulation.phone = '0698765432';
    mockedEligibilitySimulation.hasRefusedConnection = true;
    mockedEligibilitySimulation.housingType = 'T4' as HousingType;
    mockedEligibilitySimulation.contribution = 15000;
    mockedEligibilitySimulation.resources = 52000;
    mockedEligibilitySimulation.hadBrsKnowledge = false;
    mockedEligibilitySimulation.employmentStatus =
      'SALARIE_PUBLIC_OU_FONCTIONNAIRE' as EmploymentStatus;
    mockedEligibilitySimulation.laposteEmployer = 'La Poste';
    mockedEligibilitySimulation.canSendInformationsToLaposte = false;
    mockedEligibilitySimulation.positionType = 'NON_CADRE' as PositionType;
    mockedEligibilitySimulation.positionStage = true;
    mockedEligibilitySimulation.hasCompanyMoreThan10Employees = false;
    mockedEligibilitySimulation.hasCompanyMoreThan50Employees = true;
    mockedEligibilitySimulation.allowFinancingAndOwnershipAdvices = false;
    mockedEligibilitySimulation.positionContractType = 'CDD' as ContractType;
    mockedEligibilitySimulation.createdAt = newDate;
    mockedEligibilitySimulation.updatedAt = newDate;

    expect(mockedEligibilitySimulation.householdSize).toBe(3);
    expect(mockedEligibilitySimulation.hasDisability).toBe(true);
    expect(mockedEligibilitySimulation.propertySituation).toBe('PROPRIETAIRE');
    expect(mockedEligibilitySimulation.dependantsAmount).toBe(2);
    expect(mockedEligibilitySimulation.birthday).toEqual(
      new Date('1985-01-10'),
    );
    expect(mockedEligibilitySimulation.coBuyerBirthday).toEqual(
      new Date('1987-07-22'),
    );
    expect(mockedEligibilitySimulation.taxableIncome).toBe(42000);
    expect(mockedEligibilitySimulation.declarationType).toBe(
      'SEUL_SOUHAIT_SEUL',
    );
    expect(mockedEligibilitySimulation.firstCoBuyerTaxableIncome).toBe(42000);
    expect(mockedEligibilitySimulation.secondCoBuyerTaxableIncome).toBe(30000);
    expect(mockedEligibilitySimulation.eligibility).toEqual(newEligibility);
    expect(mockedEligibilitySimulation.firstName).toBe('Marie');
    expect(mockedEligibilitySimulation.lastName).toBe('Martin');
    expect(mockedEligibilitySimulation.email).toBe('marie.martin@example.com');
    expect(mockedEligibilitySimulation.phone).toBe('0698765432');
    expect(mockedEligibilitySimulation.hasRefusedConnection).toBe(true);
    expect(mockedEligibilitySimulation.housingType).toBe('T4');
    expect(mockedEligibilitySimulation.contribution).toBe(15000);
    expect(mockedEligibilitySimulation.resources).toBe(52000);
    expect(mockedEligibilitySimulation.hadBrsKnowledge).toBe(false);
    expect(mockedEligibilitySimulation.employmentStatus).toBe(
      'SALARIE_PUBLIC_OU_FONCTIONNAIRE',
    );
    expect(mockedEligibilitySimulation.laposteEmployer).toBe('La Poste');
    expect(mockedEligibilitySimulation.canSendInformationsToLaposte).toBe(
      false,
    );
    expect(mockedEligibilitySimulation.positionType).toBe('NON_CADRE');
    expect(mockedEligibilitySimulation.positionStage).toBe(true);
    expect(mockedEligibilitySimulation.hasCompanyMoreThan10Employees).toBe(
      false,
    );
    expect(mockedEligibilitySimulation.hasCompanyMoreThan50Employees).toBe(
      true,
    );
    expect(mockedEligibilitySimulation.allowFinancingAndOwnershipAdvices).toBe(
      false,
    );
    expect(mockedEligibilitySimulation.positionContractType).toBe('CDD');
    expect(mockedEligibilitySimulation.createdAt).toEqual(newDate);
    expect(mockedEligibilitySimulation.updatedAt).toEqual(newDate);
  });
});

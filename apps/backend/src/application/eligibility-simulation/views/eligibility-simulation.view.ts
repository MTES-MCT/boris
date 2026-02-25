import { ApiProperty } from '@nestjs/swagger';
import {
  ContractType,
  DeclarationType,
  EligibilityCategory,
  EmploymentStatus,
  HousingType,
  PositionType,
  PropertySituation,
} from 'src/domain/eligibility-simulation/eligibility-simulation.interface';
import { LocationView } from 'src/application/location/views/location.view';

export class EligibilitySimulationView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 2 })
  public householdSize?: number;

  @ApiProperty({ example: false })
  public hasDisability?: boolean;

  @ApiProperty({ example: 'LOCATAIRE_PRIVE' })
  public propertySituation?: PropertySituation;

  @ApiProperty({ example: 1 })
  public dependantsAmount?: number;

  @ApiProperty({ example: new Date() })
  public birthday?: Date;

  @ApiProperty({ example: new Date() })
  public coBuyerBirthday?: Date;

  @ApiProperty({ example: 35000 })
  public taxableIncome?: number;

  @ApiProperty({ example: 'COMMUN' })
  public declarationType?: DeclarationType;

  @ApiProperty({ example: 35000 })
  public firstCoBuyerTaxableIncome?: number;

  @ApiProperty({ example: 28000 })
  public secondCoBuyerTaxableIncome?: number;

  @ApiProperty({
    example: {
      category: 1,
      eligibleZoneAandAbis: true,
      eligibleZoneB1: false,
      eligibleZoneB2andC: false,
    },
  })
  public eligibility?: EligibilityCategory;

  @ApiProperty({ example: 'Jean' })
  public firstName?: string;

  @ApiProperty({ example: 'Dupont' })
  public lastName?: string;

  @ApiProperty({ example: 'jean.dupont@example.com' })
  public email?: string;

  @ApiProperty({ example: '0612345678' })
  public phone?: string;

  @ApiProperty({ example: false })
  public hasRefusedConnection?: boolean;

  @ApiProperty({ example: 'T3' })
  public housingType?: HousingType;

  @ApiProperty({ example: 10000 })
  public contribution?: number;

  @ApiProperty({ example: 45000 })
  public resources?: number;

  @ApiProperty({ example: true })
  public hadBrsKnowledge?: boolean;

  @ApiProperty({ example: 'SALARIE_PRIVE_NON_AGRICOLE' })
  public employmentStatus?: EmploymentStatus;

  @ApiProperty({ example: '' })
  public laposteEmployer?: string;

  @ApiProperty({ example: true })
  public canSendInformationsToLaposte?: boolean;

  @ApiProperty({ example: 'CADRE' })
  public positionType?: PositionType;

  @ApiProperty({ example: false })
  public positionStage?: boolean;

  @ApiProperty({ example: true })
  public hasCompanyMoreThan10Employees?: boolean;

  @ApiProperty({ example: false })
  public hasCompanyMoreThan50Employees?: boolean;

  @ApiProperty({ example: true })
  public allowFinancingAndOwnershipAdvices?: boolean;

  @ApiProperty({ example: 'CDI' })
  public positionContractType?: ContractType;

  @ApiProperty({ type: [LocationView] })
  public locations?: LocationView[];

  @ApiProperty({ example: new Date() })
  public createdAt: Date;

  @ApiProperty({ example: new Date() })
  public updatedAt: Date;

  constructor({
    id,
    createdAt,
    updatedAt,
    householdSize,
    hasDisability,
    propertySituation,
    dependantsAmount,
    birthday,
    coBuyerBirthday,
    taxableIncome,
    declarationType,
    firstCoBuyerTaxableIncome,
    secondCoBuyerTaxableIncome,
    eligibility,
    firstName,
    lastName,
    email,
    phone,
    hasRefusedConnection,
    housingType,
    contribution,
    resources,
    hadBrsKnowledge,
    employmentStatus,
    laposteEmployer,
    canSendInformationsToLaposte,
    positionType,
    positionStage,
    hasCompanyMoreThan10Employees,
    hasCompanyMoreThan50Employees,
    allowFinancingAndOwnershipAdvices,
    positionContractType,
    locations,
  }: {
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
    locations?: LocationView[];
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.householdSize = householdSize;
    this.hasDisability = hasDisability;
    this.propertySituation = propertySituation;
    this.dependantsAmount = dependantsAmount;
    this.birthday = birthday;
    this.coBuyerBirthday = coBuyerBirthday;
    this.taxableIncome = taxableIncome;
    this.declarationType = declarationType;
    this.firstCoBuyerTaxableIncome = firstCoBuyerTaxableIncome;
    this.secondCoBuyerTaxableIncome = secondCoBuyerTaxableIncome;
    this.eligibility = eligibility;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.hasRefusedConnection = hasRefusedConnection;
    this.housingType = housingType;
    this.contribution = contribution;
    this.resources = resources;
    this.hadBrsKnowledge = hadBrsKnowledge;
    this.employmentStatus = employmentStatus;
    this.laposteEmployer = laposteEmployer;
    this.canSendInformationsToLaposte = canSendInformationsToLaposte;
    this.positionType = positionType;
    this.positionStage = positionStage;
    this.hasCompanyMoreThan10Employees = hasCompanyMoreThan10Employees;
    this.hasCompanyMoreThan50Employees = hasCompanyMoreThan50Employees;
    this.allowFinancingAndOwnershipAdvices = allowFinancingAndOwnershipAdvices;
    this.positionContractType = positionContractType;
    this.locations = locations;
  }
}

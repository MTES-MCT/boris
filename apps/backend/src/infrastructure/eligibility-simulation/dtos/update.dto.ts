import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  ContractType,
  DeclarationType,
  EmploymentStatus,
  HousingType,
  PositionType,
  PropertySituation,
} from 'src/domain/eligibility-simulation/eligibility-simulation.interface';

const PROPERTY_SITUATIONS: PropertySituation[] = [
  'LOCATAIRE_SOCIAL',
  'LOCATAIRE_PRIVE',
  'PROPRIETAIRE',
  'HEBERGE',
  'AUTRE',
];

const DECLARATION_TYPES: DeclarationType[] = [
  'SEUL_SOUHAIT_SEUL',
  'SEUL_SOUHAIT_PARTENAIRE',
  'COMMUN',
];

const HOUSING_TYPES: HousingType[] = ['T1', 'T2', 'T3', 'T4', 'T5'];

const EMPLOYMENT_STATUSES: EmploymentStatus[] = [
  'SALARIE_PRIVE_NON_AGRICOLE',
  'SALARIE_AGRICOLE',
  'SALARIE_PUBLIC_OU_FONCTIONNAIRE',
  'INDEPENDANT',
  'SALARIE_GROUPE_LA_POSTE',
  'SANS_ACTIVITE_PROFESSIONNELLE',
  'RETRAITE',
];

const POSITION_TYPES: PositionType[] = [
  'CADRE',
  'NON_CADRE',
  'NO_CATEGORIE_PROFESSIONNELLE',
];

const CONTRACT_TYPES: ContractType[] = ['CDI', 'CDD'];

export class UpdateEligibilitySimulationEligibilityDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  public category: number;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    value === undefined || value === null
      ? value
      : value === true || value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  public eligibleZoneAandAbis: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    value === undefined || value === null
      ? value
      : value === true || value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  public eligibleZoneB1: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    value === undefined || value === null
      ? value
      : value === true || value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  public eligibleZoneB2andC: boolean;
}

export class UpdateEligibilitySimulationLocationDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  public latitude: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  public longitude: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public city: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public citycode: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public label: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public municipality: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public postalCode: string;
}

export class UpdateEligibilitySimulationDTO {
  @ApiPropertyOptional({ enum: PROPERTY_SITUATIONS })
  @IsOptional()
  @IsIn(PROPERTY_SITUATIONS)
  public propertySituation?: PropertySituation;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(0)
  public taxableIncome?: number;

  @ApiPropertyOptional({ enum: DECLARATION_TYPES })
  @IsOptional()
  @IsIn(DECLARATION_TYPES)
  public declarationType?: DeclarationType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(0)
  public firstCoBuyerFormattedTaxableIncome?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(0)
  public secondCoBuyerFormattedTaxableIncome?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEligibilitySimulationEligibilityDTO)
  public eligibility?: UpdateEligibilitySimulationEligibilityDTO;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public phone?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    value === undefined || value === null
      ? value
      : value === true || value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  public hasRefusedConnection?: boolean;

  @ApiPropertyOptional({ enum: HOUSING_TYPES })
  @IsOptional()
  @IsIn(HOUSING_TYPES)
  public housingType?: HousingType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(0)
  public contribution?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(0)
  public resources?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    value === undefined || value === null
      ? value
      : value === true || value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  public hadBrsKnowledge?: boolean;

  @ApiPropertyOptional({ enum: EMPLOYMENT_STATUSES })
  @IsOptional()
  @IsIn(EMPLOYMENT_STATUSES)
  public employmentStatus?: EmploymentStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public laposteEmployer?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    value === undefined || value === null
      ? value
      : value === true || value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  public canSendInformationsToLaposte?: boolean;

  @ApiPropertyOptional({ enum: POSITION_TYPES })
  @IsOptional()
  @IsIn(POSITION_TYPES)
  public positionType?: PositionType;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    value === undefined || value === null
      ? value
      : value === true || value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  public positionStage?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    value === undefined || value === null
      ? value
      : value === true || value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  public hasCompanyMoreThan10Employees?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    value === undefined || value === null
      ? value
      : value === true || value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  public hasCompanyMoreThan50Employees?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) =>
    value === undefined || value === null
      ? value
      : value === true || value === 'true',
  )
  @IsBoolean()
  @IsOptional()
  public allowFinancingAndOwnershipAdvices?: boolean;

  @ApiPropertyOptional({ enum: CONTRACT_TYPES })
  @IsOptional()
  @IsIn(CONTRACT_TYPES)
  public positionContractType?: ContractType;

  @ApiPropertyOptional({ type: [UpdateEligibilitySimulationLocationDTO] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateEligibilitySimulationLocationDTO)
  public locations?: UpdateEligibilitySimulationLocationDTO[];
}

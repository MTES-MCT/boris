import { IsEnum, IsOptional } from 'class-validator';
import {
  OfsEligibilitySimulationAction,
  OfsEligibilitySimulationStatus,
} from '../ofs-eligibility-simulation.entity';

export class UpdatePortalSimulationMetadataDto {
  @IsEnum(OfsEligibilitySimulationAction)
  @IsOptional()
  public action?: OfsEligibilitySimulationAction | null;

  @IsEnum(OfsEligibilitySimulationStatus)
  @IsOptional()
  public status?: OfsEligibilitySimulationStatus | null;
}

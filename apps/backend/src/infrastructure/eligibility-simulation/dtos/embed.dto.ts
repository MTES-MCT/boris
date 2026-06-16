import { IsOptional, IsString } from 'class-validator';
import { CreateEligibilitySimulationDTO } from './create.dto';
import { UpdateEligibilitySimulationDTO } from './update.dto';

export class CreateEmbedEligibilitySimulationDTO extends CreateEligibilitySimulationDTO {
  @IsString()
  @IsOptional()
  public parentOrigin?: string;
}

export class UpdateEmbedEligibilitySimulationDTO extends UpdateEligibilitySimulationDTO {
  @IsString()
  @IsOptional()
  public parentOrigin?: string;

  @IsString()
  @IsOptional()
  public selectionDepartments?: string;

  @IsString()
  @IsOptional()
  public selectionCitycodes?: string;
}

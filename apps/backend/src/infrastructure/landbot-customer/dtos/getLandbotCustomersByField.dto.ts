import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum LandbotCustomerGroupByField {
  ELIGIBILITY = 'eligibility',
  BRS_KNOWLEDGE = 'brsKnowledge',
  REAL_ESTATE_SITUATION = 'realEstateSituation',
}

export class GetLandbotCustomersByFieldDTO {
  @ApiProperty({
    description: 'Le champ par lequel grouper les clients Landbot',
    enum: LandbotCustomerGroupByField,
    example: LandbotCustomerGroupByField.ELIGIBILITY,
  })
  @IsEnum(LandbotCustomerGroupByField)
  @IsNotEmpty()
  public field: LandbotCustomerGroupByField;
}

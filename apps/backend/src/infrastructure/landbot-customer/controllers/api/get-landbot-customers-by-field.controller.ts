import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';
import { LandbotCustomerGroupByFieldView } from 'src/application/landbot-customer/views/landbot-customer-group-by-field.view';
import {
  GetLandbotCustomersByFieldDTO,
  LandbotCustomerGroupByField,
} from '../../dtos/getLandbotCustomersByField.dto';
import { GroupByEligibilityUsecase } from 'src/application/landbot-customer/usecases/groupByEligibility.usecase';
import { GroupByBrsKnowledgeUsecase } from 'src/application/landbot-customer/usecases/groupByBrsKnowledge.usecase';
import { GroupByRealEstateSituationUsecase } from 'src/application/landbot-customer/usecases/groupByRealEstateSituation.usecase';

@Controller('api/landbot-customers')
@ApiTags("Simulations d'éligibilité")
export class GetLandbotCustomersByFieldApiController {
  constructor(
    private readonly groupByEligibilityUsecase: GroupByEligibilityUsecase,
    private readonly groupByBrsKnowledgeUsecase: GroupByBrsKnowledgeUsecase,
    private readonly groupByRealEstateSituationUsecase: GroupByRealEstateSituationUsecase,
  ) {}

  @Get(':field')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: 'Clients Landbot groupés par champs',
    type: LandbotCustomerGroupByFieldView,
  })
  @ApiOperation({
    summary:
      'Récupérer tous les sites web de diffusion BRS groupés par un champs spécifique',
  })
  index(@Param() { field }: GetLandbotCustomersByFieldDTO) {
    if (field === LandbotCustomerGroupByField.ELIGIBILITY) {
      return this.groupByEligibilityUsecase.execute();
    } else if (field === LandbotCustomerGroupByField.BRS_KNOWLEDGE) {
      return this.groupByBrsKnowledgeUsecase.execute();
    } else if (field === LandbotCustomerGroupByField.REAL_ESTATE_SITUATION) {
      return this.groupByRealEstateSituationUsecase.execute();
    }
  }
}

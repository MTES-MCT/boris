import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
// import { FindAllBrsDiffusionWebsitesUsecase } from 'src/application/brs-diffusion-website/usecases/findAll.usecase';

import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';
import { LandbotCustomerGroupByView } from 'src/application/landbot-customer/views/landbot-customer-group-by.view';
import {
  GetLandbotCustomersByFieldDTO,
  LandbotCustomerGroupByField,
} from '../../dtos/getLandbotCustomersByField.dto';
import { GroupByEligibilityUsecase } from 'src/application/landbot-customer/usecases/groupByEligibility.usecase';
import { GroupByBrsKnowledgeUsecase } from 'src/application/landbot-customer/usecases/groupByBrsKnowledge.usecase';
import { GroupByRealEstateSituationUsecase } from 'src/application/landbot-customer/usecases/groupByRealEstateSituation.usecase';

@Controller('api/landbot-customers')
@ApiTags('Clients Landbot groupés par champs')
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
    type: LandbotCustomerGroupByView,
  })
  @ApiOperation({ summary: 'Récupérer tous les sites web de diffusion BRS' })
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

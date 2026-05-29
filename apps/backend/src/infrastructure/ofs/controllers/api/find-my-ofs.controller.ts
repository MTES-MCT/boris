import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FindMyOfsUsecase } from 'src/application/ofs/usecases/findMyOfs.usecase';
import { FindMyOfsResultView } from 'src/application/ofs/views/find-my-ofs-result.view';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';
import { FindMyOfsDTO } from '../../dtos/find-my-ofs.dto';

@Controller('api/ofss/find-my-ofs')
@ApiTags('OFS')
export class FindMyOfsApiController {
  constructor(private readonly findMyOfsUsecase: FindMyOfsUsecase) {}

  @Get()
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiOkResponse({ type: [FindMyOfsResultView] })
  @ApiOperation({
    summary: 'Trouver les OFS candidats les plus proches d’une adresse',
  })
  index(@Query() query: FindMyOfsDTO) {
    return this.findMyOfsUsecase.execute(query);
  }
}

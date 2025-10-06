import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';
import { FindOneMunicipalityByInseeCodeUsecase } from 'src/application/municipality/usecases/findOneByInseeCode.usecase';
import { MunicipalityView } from 'src/application/municipality/views/municipality.view';
import { GetMunicipalityByInseeCodeDTO } from '../../dtos/getMunicipalityByInseeCode.dto';

@Controller('api/municipalities')
@ApiTags('Communes')
export class GetMunicipalityByInseeCodeApiController {
  constructor(
    private readonly findOneMunicipalityByInseeCodeUsecase: FindOneMunicipalityByInseeCodeUsecase,
  ) {}

  @Get(':inseeCode')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({ type: MunicipalityView })
  @ApiOperation({ summary: 'Récupérer une commune par son code INSEE' })
  index(@Param() { inseeCode }: GetMunicipalityByInseeCodeDTO) {
    return this.findOneMunicipalityByInseeCodeUsecase.execute({
      inseeCode,
    });
  }
}

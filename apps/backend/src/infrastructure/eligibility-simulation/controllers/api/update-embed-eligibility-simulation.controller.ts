import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/update.usecase';
import { Repository } from 'typeorm';
import { OfsEmbedOriginEntity } from 'src/infrastructure/ofs/ofs-embed-origin.entity';
import { EligibilitySimulationRepository } from '../../eligibility-simulation.repository';
import {
  UpdateEligibilitySimulationLocationDTO,
} from '../../dtos/update.dto';
import { UpdateEmbedEligibilitySimulationDTO } from '../../dtos/embed.dto';
import { EmbedRateLimiterService } from '../../embed-rate-limiter.service';

@ApiExcludeController()
@Controller('api/embed/eligibility-simulations')
export class UpdateEmbedEligibilitySimulationApiController {
  constructor(
    private readonly updateEligibilitySimulationUsecase: UpdateEligibilitySimulationUsecase,
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepository,
    @InjectRepository(OfsEmbedOriginEntity)
    private readonly ofsEmbedOriginRepository: Repository<OfsEmbedOriginEntity>,
    private readonly embedRateLimiter: EmbedRateLimiterService,
  ) {}

  @Put(':id')
  public async updateEligibilitySimulation(
    @Param('id') id: string,
    @Body() body: UpdateEmbedEligibilitySimulationDTO,
    @Query('parentOrigin') parentOrigin?: string,
    @Query('selectionDepartments') selectionDepartments?: string,
    @Query('selectionCitycodes') selectionCitycodes?: string,
  ) {
    const embedOrigin = await this.findEnabledOrigin(
      body.parentOrigin || parentOrigin,
    );
    this.embedRateLimiter.assertAllowed(embedOrigin.origin);

    const eligibilitySimulation =
      await this.eligibilitySimulationRepository.findById(id);

    if (!eligibilitySimulation) {
      throw new NotFoundException();
    }

    if (
      eligibilitySimulation.sourceType !== 'OFS_EMBED' ||
      eligibilitySimulation.sourceOfsId !== embedOrigin.ofsId
    ) {
      throw new ForbiddenException();
    }

    this.validateLocations(body.locations, {
      selectionDepartments: body.selectionDepartments || selectionDepartments,
      selectionCitycodes: body.selectionCitycodes || selectionCitycodes,
    });

    return await this.updateEligibilitySimulationUsecase.execute({
      id,
      ...body,
    });
  }

  private validateLocations(
    locations: UpdateEligibilitySimulationLocationDTO[] | undefined,
    selection: {
      selectionDepartments?: string;
      selectionCitycodes?: string;
    },
  ) {
    if (!locations?.length) {
      return;
    }

    const departments = this.parseList(selection.selectionDepartments);
    const citycodes = this.parseList(selection.selectionCitycodes);

    if (departments.length === 0 && citycodes.length === 0) {
      return;
    }

    const hasInvalidLocation = locations.some((location) => {
      if (!location.citycode) {
        return true;
      }

      return (
        !citycodes.includes(location.citycode) &&
        !departments.includes(this.departementCodeFromCitycode(location.citycode))
      );
    });

    if (hasInvalidLocation) {
      throw new BadRequestException(
        'Une localisation ne correspond pas au périmètre de sélection.',
      );
    }
  }

  private parseList(value?: string) {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private departementCodeFromCitycode(citycode: string) {
    return citycode.startsWith('97') || citycode.startsWith('98')
      ? citycode.slice(0, 3)
      : citycode.slice(0, 2);
  }

  private async findEnabledOrigin(parentOrigin?: string) {
    const origin = this.normalizeOrigin(parentOrigin);

    if (!origin) {
      throw new ForbiddenException();
    }

    const embedOrigin = await this.ofsEmbedOriginRepository.findOne({
      where: { origin, enabled: true },
    });

    if (!embedOrigin) {
      throw new ForbiddenException();
    }

    return embedOrigin;
  }

  private normalizeOrigin(origin?: string) {
    if (!origin) {
      return null;
    }

    try {
      return new URL(origin).origin;
    } catch {
      return null;
    }
  }
}

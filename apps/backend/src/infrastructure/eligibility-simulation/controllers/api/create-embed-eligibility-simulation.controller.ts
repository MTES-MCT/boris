import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/create.usecase';
import { Repository } from 'typeorm';
import { OfsEmbedOriginEntity } from 'src/infrastructure/ofs/ofs-embed-origin.entity';
import { CreateEmbedEligibilitySimulationDTO } from '../../dtos/embed.dto';
import { EmbedRateLimiterService } from '../../embed-rate-limiter.service';

@ApiExcludeController()
@Controller('api/embed/eligibility-simulations')
export class CreateEmbedEligibilitySimulationApiController {
  constructor(
    private readonly createEligibilitySimulationUsecase: CreateEligibilitySimulationUsecase,
    @InjectRepository(OfsEmbedOriginEntity)
    private readonly ofsEmbedOriginRepository: Repository<OfsEmbedOriginEntity>,
    private readonly embedRateLimiter: EmbedRateLimiterService,
  ) {}

  @Post()
  public async createEligibilitySimulation(
    @Body() body: CreateEmbedEligibilitySimulationDTO,
    @Query('parentOrigin') parentOrigin?: string,
  ) {
    const embedOrigin = await this.findEnabledOrigin(
      body.parentOrigin || parentOrigin,
    );
    this.embedRateLimiter.assertAllowed(embedOrigin.origin);

    return await this.createEligibilitySimulationUsecase.execute({
      ...body,
      sourceType: 'OFS_EMBED',
      sourceOfsId: embedOrigin.ofsId,
    });
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

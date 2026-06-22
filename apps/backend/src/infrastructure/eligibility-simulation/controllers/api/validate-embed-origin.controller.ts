import { Controller, ForbiddenException, Get, Query } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { OfsEmbedOriginEntity } from 'src/infrastructure/ofs/ofs-embed-origin.entity';
import { Repository } from 'typeorm';

@ApiExcludeController()
@Controller('api/embed/origin')
export class ValidateEmbedOriginApiController {
  constructor(
    @InjectRepository(OfsEmbedOriginEntity)
    private readonly ofsEmbedOriginRepository: Repository<OfsEmbedOriginEntity>,
  ) {}

  @Get()
  public async validate(@Query('parentOrigin') parentOrigin?: string) {
    const origin = this.normalizeOrigin(parentOrigin);

    if (!origin) {
      throw new ForbiddenException();
    }

    const embedOrigin = await this.ofsEmbedOriginRepository.findOne({
      where: { origin, enabled: true },
      relations: ['ofs'],
    });

    if (!embedOrigin) {
      throw new ForbiddenException();
    }

    return {
      origin: embedOrigin.origin,
      ofsName: embedOrigin.ofs.name,
    };
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

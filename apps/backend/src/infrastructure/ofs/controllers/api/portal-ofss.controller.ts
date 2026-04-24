import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { UserRole } from 'src/domain/user/user-role.enum';
import { PortalApiAuthenticatedGuard } from 'src/infrastructure/auth/guards/portal-api-authenticated.guard';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';
import { FindPortalContactLinesUsecase } from 'src/application/eligibility-simulation/usecases/find-portal-contact-lines.usecase';
import { PortalUpdateOfsDto } from '../../dtos/portal-update.dto';
import { OfsEntity } from '../../ofs.entity';

@ApiExcludeController()
@Controller('/api/portal/ofss')
export class PortalOfssController {
  constructor(
    @InjectRepository(OfsEntity)
    private readonly ofsRepository: Repository<OfsEntity>,
    private readonly findPortalContactLinesUsecase: FindPortalContactLinesUsecase,
  ) {}

  @UseGuards(PortalApiAuthenticatedGuard)
  @Get()
  public async list(@Req() req: Request) {
    const user = req.user as UserEntity;

    const ofss = user.roles.includes(UserRole.ADMIN)
      ? await this.ofsRepository.find({
          relations: ['regions', 'departements'],
          order: { name: 'ASC' },
        })
      : user.ofss
          .slice()
          .sort((left, right) => left.name.localeCompare(right.name, 'fr'));

    return ofss.map((ofs) => ({
      id: ofs.id,
      name: ofs.name,
      email: ofs.email,
      regions: ofs.regions?.map((region) => region.name) || [],
      departements:
        ofs.departements?.map((departement) => departement.name) || [],
    }));
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Get(':id')
  public async detail(@Param('id') id: string, @Req() req: Request) {
    const ofs = await this.findAccessibleOfs(id, req.user as UserEntity);

    return {
      id: ofs.id,
      name: ofs.name,
      email: ofs.email,
      phone: ofs.phone,
      websiteUrl: ofs.websiteUrl,
      updatedAt: ofs.updatedAt,
      regions: ofs.regions.map((region) => ({
        id: region.id,
        name: region.name,
      })),
      departements: ofs.departements.map((departement) => ({
        id: departement.id,
        name: departement.name,
      })),
      distributors: ofs.distributors.map((distributor) => ({
        id: distributor.id,
        name: distributor.name,
      })),
    };
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Get(':id/eligibility-simulations')
  public async eligibilitySimulations(
    @Param('id') id: string,
    @Query() pagination: PaginationDTO,
    @Req() req: Request,
  ) {
    const user = req.user as UserEntity;
    const ofs = await this.findAccessibleOfs(id, user);
    const session = req.session as typeof req.session & {
      previousLoginAt?: string | null;
    };

    return this.findPortalContactLinesUsecase.execute(
      {
        page: pagination.page || 1,
        pageSize: pagination.pageSize || 20,
      },
      {
        departementIds: ofs.departements.map((departement) => departement.id),
        regionIds: ofs.regions.map((region) => region.id),
        compareDate: session.previousLoginAt
          ? new Date(session.previousLoginAt)
          : null,
      },
    );
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() body: PortalUpdateOfsDto,
    @Req() req: Request,
  ) {
    const ofs = await this.findAccessibleOfs(id, req.user as UserEntity);

    ofs.name = body.name.trim();
    ofs.email = body.email || null;
    ofs.phone = body.phone || null;
    ofs.websiteUrl = body.websiteUrl || null;

    const updated = await this.ofsRepository.save(ofs);

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      websiteUrl: updated.websiteUrl,
      updatedAt: updated.updatedAt,
      regions: updated.regions.map((region) => ({
        id: region.id,
        name: region.name,
      })),
      departements: updated.departements.map((departement) => ({
        id: departement.id,
        name: departement.name,
      })),
      distributors: updated.distributors.map((distributor) => ({
        id: distributor.id,
        name: distributor.name,
      })),
    };
  }

  private async findAccessibleOfs(
    id: string,
    user: UserEntity,
  ): Promise<OfsEntity> {
    const ofs = await this.ofsRepository.findOne({
      where: { id },
      relations: ['regions', 'departements', 'distributors'],
    });

    if (!ofs) {
      throw new NotFoundException();
    }

    if (user.roles.includes(UserRole.ADMIN)) {
      return ofs;
    }

    if (!user.ofss.some((accessibleOfs) => accessibleOfs.id === id)) {
      throw new NotFoundException();
    }

    return ofs;
  }
}

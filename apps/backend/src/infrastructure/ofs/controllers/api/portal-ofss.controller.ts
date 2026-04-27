import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { UserRole } from 'src/domain/user/user-role.enum';
import { PortalApiAuthenticatedGuard } from 'src/infrastructure/auth/guards/portal-api-authenticated.guard';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';
import { FindPortalContactLinesUsecase } from 'src/application/eligibility-simulation/usecases/find-portal-contact-lines.usecase';
import { ExportPortalContactLinesUsecase } from 'src/application/eligibility-simulation/usecases/export-portal-contact-lines.usecase';
import { PortalUpdateOfsDto } from '../../dtos/portal-update.dto';
import { OfsEntity } from '../../ofs.entity';

@ApiExcludeController()
@Controller('/api/portal/ofss')
export class PortalOfssController {
  constructor(
    @InjectRepository(OfsEntity)
    private readonly ofsRepository: Repository<OfsEntity>,
    private readonly findPortalContactLinesUsecase: FindPortalContactLinesUsecase,
    private readonly exportPortalContactLinesUsecase: ExportPortalContactLinesUsecase,
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
  @Get(':id/eligibility-simulations/export')
  public async exportEligibilitySimulations(
    @Param('id') id: string,
    @Query('startDate') startDate: string | undefined,
    @Query('endDate') endDate: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as UserEntity;
    const ofs = await this.findAccessibleOfs(id, user);
    const validatedDates = this.validateExportDates(startDate, endDate);
    const lines = await this.exportPortalContactLinesUsecase.execute({
      departementIds: ofs.departements.map((departement) => departement.id),
      regionIds: ofs.regions.map((region) => region.id),
      ...validatedDates,
    });
    const csv = this.buildCsv(lines);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="simulations-${ofs.id}-${validatedDates.startDate}-${validatedDates.endDate}.csv"`,
    );

    return res.send(Buffer.from(csv, 'utf-8'));
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

  private validateExportDates(startDate?: string, endDate?: string) {
    if (!startDate || !endDate) {
      throw new BadRequestException(
        'Les dates de début et de fin sont obligatoires.',
      );
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(startDate) || !datePattern.test(endDate)) {
      throw new BadRequestException('Le format des dates est invalide.');
    }

    const parsedStartDate = new Date(`${startDate}T00:00:00.000Z`);
    const parsedEndDate = new Date(`${endDate}T00:00:00.000Z`);

    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime())
    ) {
      throw new BadRequestException('Le format des dates est invalide.');
    }

    if (startDate > endDate) {
      throw new BadRequestException(
        'La date de début doit être antérieure ou égale à la date de fin.',
      );
    }

    return { startDate, endDate };
  }

  private buildCsv(lines: Awaited<ReturnType<ExportPortalContactLinesUsecase['execute']>>) {
    const rows = [
      [
        'date',
        'contact',
        'email',
        'telephone',
        'ville',
        'departement',
        'foyer',
        'handicap',
        'projet',
        'typeLogement',
        'apport',
        'revenusImposables',
        'ressources',
      ],
      ...lines.map((line) => [
        line.submittedAt.toISOString(),
        line.fullName || 'Contact sans nom',
        line.email || '',
        line.phone || '',
        line.city || '',
        line.departementCode || '',
        line.householdSize?.toString() || '',
        line.hasDisability === null ? '' : line.hasDisability ? 'Oui' : 'Non',
        line.propertySituation || '',
        line.housingType || '',
        line.contribution?.toString() || '',
        line.taxableIncome?.toString() || '',
        line.resources?.toString() || '',
      ]),
    ];

    return `${rows
      .map((row) => row.map((cell) => this.escapeCsvValue(cell)).join(','))
      .join('\n')}\n`;
  }

  private escapeCsvValue(value: string) {
    if (/[",\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
  }
}

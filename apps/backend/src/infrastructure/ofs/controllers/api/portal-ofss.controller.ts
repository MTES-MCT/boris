import { PortalEligibilitySimulationContactResult } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { PortalContactLineView } from 'src/application/eligibility-simulation/views/portal-contact-line.view';
import {
  AuditService,
  AuditEventType,
} from 'src/infrastructure/audit/audit.service';
import {
  auditedSave,
  auditDenied,
} from 'src/infrastructure/audit/audited-write';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Workbook } from 'exceljs';
import { Repository } from 'typeorm';
import { UserRole } from 'src/domain/user/user-role.enum';
import { PortalApiAuthenticatedGuard } from 'src/infrastructure/auth/guards/portal-api-authenticated.guard';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import {
  DistributorPortalContactFiltersDto,
  ExportPortalContactFiltersDto,
  PortalContactFiltersDto,
} from '../../dtos/portal-contact-filters.dto';
import { FindPortalContactLinesUsecase } from 'src/application/eligibility-simulation/usecases/find-portal-contact-lines.usecase';
import { ExportPortalContactLinesUsecase } from 'src/application/eligibility-simulation/usecases/export-portal-contact-lines.usecase';
import { PortalUpdateOfsDto } from '../../dtos/portal-update.dto';
import { OfsEntity } from '../../ofs.entity';
import { EligibilitySimulationRepository } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.repository';
import { OfsEligibilitySimulationEntity } from '../../ofs-eligibility-simulation.entity';
import { UpdatePortalSimulationMetadataDto } from '../../dtos/update-portal-simulation-metadata.dto';
import {
  CommercialTransmissionEntity,
  CommercialTransmissionScopeType,
} from '../../commercial-transmission.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { DistributorEligibilitySimulationEntity } from '../../distributor-eligibility-simulation.entity';
import {
  CreateCommercialTransmissionDto,
  UpdateCommercialTransmissionDto,
} from '../../dtos/commercial-transmission.dto';

type ExportContactLine = Omit<PortalContactLineView, 'isNew' | 'ofs'>;

@ApiExcludeController()
@Controller('/api/portal/ofss')
export class PortalOfssController {
  constructor(
    @InjectRepository(OfsEntity)
    private readonly ofsRepository: Repository<OfsEntity>,
    @InjectRepository(OfsEligibilitySimulationEntity)
    private readonly ofsEligibilitySimulationRepository: Repository<OfsEligibilitySimulationEntity>,
    @InjectRepository(CommercialTransmissionEntity)
    private readonly commercialTransmissionRepository: Repository<CommercialTransmissionEntity>,
    @InjectRepository(DistributorEntity)
    private readonly distributorRepository: Repository<DistributorEntity>,
    @InjectRepository(DistributorEligibilitySimulationEntity)
    private readonly distributorEligibilitySimulationRepository: Repository<DistributorEligibilitySimulationEntity>,
    private readonly findPortalContactLinesUsecase: FindPortalContactLinesUsecase,
    private readonly exportPortalContactLinesUsecase: ExportPortalContactLinesUsecase,
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepository,
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
  @Get(':id/commercial-transmissions')
  public async commercialTransmissions(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const ofs = await this.findAccessibleOfs(id, req.user as UserEntity);
    const transmissions = await this.commercialTransmissionRepository.find({
      where: { ofsId: ofs.id },
      relations: ['distributor'],
      order: { updatedAt: 'DESC' },
    });

    return transmissions.map((transmission) =>
      this.serializeTransmission(transmission),
    );
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Post(':id/commercial-transmissions')
  public async createCommercialTransmission(
    @Param('id') id: string,
    @Body()
    body: CreateCommercialTransmissionDto,
    @Req() req: Request,
  ) {
    const ofs = await this.findAccessibleOfs(id, req.user as UserEntity);
    const distributor = body.distributorId
      ? await this.distributorRepository.findOneBy({ id: body.distributorId })
      : null;

    if (!distributor) {
      throw new BadRequestException('Commercialisateur invalide.');
    }

    if (!ofs.distributors.some((item) => item.id === distributor.id)) {
      throw new BadRequestException(
        "Ce commercialisateur n'est pas rattaché à cet OFS.",
      );
    }

    const existing = await this.commercialTransmissionRepository.findOne({
      where: { ofsId: ofs.id, distributorId: distributor.id },
    });

    if (existing) {
      throw new BadRequestException('Cette transmission existe déjà.');
    }

    const transmission = this.commercialTransmissionRepository.create({
      ofsId: ofs.id,
      distributorId: distributor.id,
      distributor,
      isActive: body.isActive ?? true,
      ...this.resolveTransmissionScope(body),
    });

    return this.serializeTransmission(
      await auditedSave(this.commercialTransmissionRepository, transmission),
    );
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Put(':id/commercial-transmissions/:transmissionId')
  public async updateCommercialTransmission(
    @Param('id') id: string,
    @Param('transmissionId') transmissionId: string,
    @Body()
    body: UpdateCommercialTransmissionDto,
    @Req() req: Request,
  ) {
    const ofs = await this.findAccessibleOfs(id, req.user as UserEntity);
    const transmission = await this.commercialTransmissionRepository.findOne({
      where: { id: transmissionId, ofsId: ofs.id },
      relations: ['distributor'],
    });

    if (!transmission) {
      await auditDenied(
        this.ofsRepository,
        'TRANSMISSION_SCOPE_DENIED',
        transmissionId,
        'commercial_transmission',
      );
      throw new NotFoundException();
    }

    Object.assign(transmission, this.resolveTransmissionScope(body));

    if (typeof body.isActive === 'boolean') {
      transmission.isActive = body.isActive;
    }

    return this.serializeTransmission(
      await auditedSave(this.commercialTransmissionRepository, transmission),
    );
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Get('/commercialisateur/ofss')
  public async distributorOfss(@Req() req: Request) {
    const user = req.user as UserEntity;
    const distributorId = (await this.requireDistributor(user)).id;
    const transmissions = await this.commercialTransmissionRepository.find({
      where: { distributorId, isActive: true },
      relations: ['ofs'],
      order: { updatedAt: 'DESC' },
    });

    return transmissions.map((transmission) => ({
      transmissionId: transmission.id,
      ofs: {
        id: transmission.ofs.id,
        name: transmission.ofs.name,
        email: transmission.ofs.email,
        phone: transmission.ofs.phone,
        websiteUrl: transmission.ofs.websiteUrl,
      },
      scopeType: transmission.scopeType,
      inseeCodes: transmission.inseeCodes,
      departementCodes: transmission.departementCodes,
    }));
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Get('/commercialisateur/eligibility-simulations')
  public async distributorEligibilitySimulations(
    @Query() filters: DistributorPortalContactFiltersDto,
    @Req() req: Request,
  ) {
    const distributorId = (
      await this.requireDistributor(req.user as UserEntity)
    ).id;

    const result = await this.findDistributorPortalContactLines(
      {
        page: filters.page || 1,
        pageSize: filters.pageSize || 20,
      },
      { distributorId, ofsId: filters.ofsId },
    );
    await this.auditContacts(result.items, 'contacts.released', {
      distributorId,
      ofsId: filters.ofsId,
    });
    return result;
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Get('/commercialisateur/eligibility-simulations/export')
  public async exportDistributorEligibilitySimulations(
    @Query('startDate') startDate: string | undefined,
    @Query('endDate') endDate: string | undefined,
    @Query('ofsId') ofsId: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const distributorId = (
      await this.requireDistributor(req.user as UserEntity)
    ).id;
    const validatedDates = this.validateExportDates(startDate, endDate);
    const audit = new AuditService(this.ofsRepository.manager.connection);
    await audit.record({
      type: 'contacts.export_requested',
      targetType: 'contacts',
      ofsId,
      distributorId,
      metadata: { format: 'csv', ...validatedDates },
    });
    try {
      const lines =
        await this.eligibilitySimulationRepository.findAllPortalContactsByDistributorScope(
          { distributorId, ofsId, ...validatedDates },
        );
      const csv = this.buildCsv(
        lines.map((line) => this.toPortalContactLineForCsv(line)),
      );

      await this.auditContacts(
        lines,
        'contacts.export_released',
        { distributorId, ofsId },
        'csv',
        validatedDates,
      );

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="transmissions-commerciales-${validatedDates.startDate}-${validatedDates.endDate}.csv"`,
      );

      return res.send(Buffer.from(csv, 'utf-8'));
    } catch (error) {
      await audit.attempt({
        type: 'contacts.export_failed',
        outcome: 'failed',
        targetType: 'contacts',
        ofsId,
        distributorId,
        reasonCode: 'EXPORT_FAILED',
        metadata: { format: 'csv' },
      });
      throw error;
    }
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Put('/commercialisateur/eligibility-simulations/:simulationId/metadata')
  public async updateDistributorEligibilitySimulationMetadata(
    @Param('simulationId') simulationId: string,
    @Body() body: UpdatePortalSimulationMetadataDto,
    @Req() req: Request,
  ) {
    const distributorId = (
      await this.requireDistributor(req.user as UserEntity)
    ).id;
    const isAccessible =
      await this.eligibilitySimulationRepository.hasPortalContactInDistributorScope(
        simulationId,
        { distributorId },
      );

    if (!isAccessible) {
      await auditDenied(
        this.ofsRepository,
        'CONTACT_SCOPE_DENIED',
        simulationId,
        'eligibility_simulation',
      );
      throw new NotFoundException();
    }

    let metadata =
      await this.distributorEligibilitySimulationRepository.findOne({
        where: { distributorId, eligibilitySimulationId: simulationId },
      });

    if (!metadata) {
      metadata = this.distributorEligibilitySimulationRepository.create({
        distributorId,
        eligibilitySimulationId: simulationId,
      });
    }

    metadata.action = body.action ?? null;
    metadata.status = body.status ?? null;

    const saved = await auditedSave(
      this.distributorEligibilitySimulationRepository,
      metadata,
    );

    return {
      simulationId: saved.eligibilitySimulationId,
      action: saved.action,
      status: saved.status,
    };
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
    @Query() pagination: PortalContactFiltersDto,
    @Req() req: Request,
  ) {
    const user = req.user as UserEntity;
    const ofs = await this.findAccessibleOfs(id, user);
    const session = req.session as typeof req.session & {
      previousLoginAt?: string | null;
    };

    const result = await this.findPortalContactLinesUsecase.execute(
      {
        page: pagination.page || 1,
        pageSize: pagination.pageSize || 20,
      },
      {
        ofsId: ofs.id,
        departementIds: ofs.departements.map((departement) => departement.id),
        location: pagination.location,
        contact: pagination.contact,
        compareDate: session.previousLoginAt
          ? new Date(session.previousLoginAt)
          : null,
      },
    );
    await this.auditContacts(result.items, 'contacts.released', {
      ofsId: ofs.id,
    });
    return result;
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Get(':id/eligibility-simulations/export')
  public async exportEligibilitySimulations(
    @Param('id') id: string,
    @Query('startDate') startDate: string | undefined,
    @Query('endDate') endDate: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
    @Query() filters: ExportPortalContactFiltersDto = {},
  ) {
    const user = req.user as UserEntity;
    const ofs = await this.findAccessibleOfs(id, user);
    const validatedDates = this.validateExportDates(startDate, endDate);
    const audit = new AuditService(this.ofsRepository.manager.connection);
    await audit.record({
      type: 'contacts.export_requested',
      targetType: 'contacts',
      ofsId: ofs.id,
      metadata: { format: filters.format || 'csv', ...validatedDates },
    });
    try {
      const lines = await this.exportPortalContactLinesUsecase.execute({
        ofsId: ofs.id,
        departementIds: ofs.departements.map((departement) => departement.id),
        location: filters.location,
        contact: filters.contact,
        ...validatedDates,
      });
      const format = filters.format || 'csv';
      const filename = `simulations-${ofs.id}-${validatedDates.startDate}-${validatedDates.endDate}.${format}`;
      const content =
        format === 'xlsx'
          ? await this.buildExcel(lines)
          : Buffer.from(this.buildCsv(lines), 'utf-8');

      await this.auditContacts(
        lines,
        'contacts.export_released',
        { ofsId: ofs.id },
        format,
        validatedDates,
      );

      res.setHeader(
        'Content-Type',
        format === 'xlsx'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv; charset=utf-8',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );

      return res.send(content);
    } catch (error) {
      await audit.attempt({
        type: 'contacts.export_failed',
        outcome: 'failed',
        targetType: 'contacts',
        ofsId: ofs.id,
        reasonCode: 'EXPORT_FAILED',
        metadata: { format: filters.format || 'csv' },
      });
      throw error;
    }
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Put(':id/eligibility-simulations/:simulationId/metadata')
  public async updateEligibilitySimulationMetadata(
    @Param('id') id: string,
    @Param('simulationId') simulationId: string,
    @Body() body: UpdatePortalSimulationMetadataDto,
    @Req() req: Request,
  ) {
    const user = req.user as UserEntity;
    const ofs = await this.findAccessibleOfs(id, user);
    const filters = {
      ofsId: ofs.id,
      departementIds: ofs.departements.map((departement) => departement.id),
    };

    const isAccessible =
      await this.eligibilitySimulationRepository.hasPortalContactInOfsScope(
        simulationId,
        filters,
      );

    if (!isAccessible) {
      await auditDenied(
        this.ofsRepository,
        'CONTACT_SCOPE_DENIED',
        simulationId,
        'eligibility_simulation',
      );
      throw new NotFoundException();
    }

    let metadata = await this.ofsEligibilitySimulationRepository.findOne({
      where: {
        ofsId: ofs.id,
        eligibilitySimulationId: simulationId,
      },
    });

    if (!metadata) {
      metadata = this.ofsEligibilitySimulationRepository.create({
        ofsId: ofs.id,
        eligibilitySimulationId: simulationId,
      });
    }

    metadata.action = body.action ?? null;
    metadata.status = body.status ?? null;

    const saved = await auditedSave(
      this.ofsEligibilitySimulationRepository,
      metadata,
    );

    return {
      simulationId: saved.eligibilitySimulationId,
      action: saved.action,
      status: saved.status,
    };
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

    const updated = await auditedSave(this.ofsRepository, ofs);

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

  private async auditContacts(
    lines: {
      locationId: string;
      simulationId: string;
      ofsId?: string | null;
      ofs?: { id: string } | null;
    }[],
    type: AuditEventType,
    scope: { ofsId?: string; distributorId?: string },
    format?: string,
    dates?: { startDate: string; endDate: string },
  ) {
    await new AuditService(this.ofsRepository.manager.connection).record({
      type,
      targetType: 'contacts',
      ...scope,
      metadata: {
        count: lines.length,
        ...(format ? { format } : {}),
        ...dates,
      },
      resources: lines.map((line) => ({
        resourceType: 'contact_line',
        resourceId: line.locationId,
        simulationId: line.simulationId,
        ofsId: line.ofsId || line.ofs?.id || scope.ofsId,
        distributorId: scope.distributorId,
      })),
    });
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
      await auditDenied(this.ofsRepository, 'OFS_SCOPE_DENIED', id);
      throw new NotFoundException();
    }

    return ofs;
  }

  private async requireDistributor(
    user: UserEntity,
  ): Promise<DistributorEntity> {
    if (!user.roles.includes(UserRole.DISTRIBUTOR) || !user.distributor) {
      await auditDenied(this.ofsRepository, 'DISTRIBUTOR_ROLE_REQUIRED');
      throw new NotFoundException();
    }

    return user.distributor;
  }

  private async findDistributorPortalContactLines(
    pagination: { page: number; pageSize: number },
    filters: { distributorId: string; ofsId?: string },
  ) {
    const [items, total] =
      await this.eligibilitySimulationRepository.findPortalContactsByDistributorScope(
        pagination,
        filters,
      );

    return {
      items: items.map((line) => this.toPortalContactLineForCsv(line)),
      totalCount: total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      pagesCount: Math.ceil(total / pagination.pageSize),
      hasPreviousPage: pagination.page > 1,
      hasNextPage: pagination.page * pagination.pageSize < total,
    };
  }

  private toPortalContactLineForCsv(
    line: PortalEligibilitySimulationContactResult,
  ) {
    return {
      ...line,
      submittedAt: new Date(line.submittedAt),
      transmittedDistributors: line.transmittedDistributors || [],
      ofs: line.ofsId
        ? {
            id: line.ofsId,
            name: line.ofsName,
            email: line.ofsEmail || null,
            phone: line.ofsPhone || null,
            websiteUrl: line.ofsWebsiteUrl || null,
          }
        : null,
    };
  }

  private resolveTransmissionScope(body: {
    scopeType?: CommercialTransmissionScopeType;
    inseeCodes?: string[];
    departementCodes?: string[];
  }) {
    const scopeType =
      body.scopeType === CommercialTransmissionScopeType.GEOGRAPHIC
        ? CommercialTransmissionScopeType.GEOGRAPHIC
        : CommercialTransmissionScopeType.ALL;
    const inseeCodes = this.normalizeCodes(body.inseeCodes);
    const departementCodes = this.normalizeCodes(body.departementCodes);

    if (
      scopeType === CommercialTransmissionScopeType.GEOGRAPHIC &&
      inseeCodes.length === 0 &&
      departementCodes.length === 0
    ) {
      throw new BadRequestException('Le périmètre géographique est vide.');
    }

    return {
      scopeType,
      inseeCodes:
        scopeType === CommercialTransmissionScopeType.GEOGRAPHIC
          ? inseeCodes
          : [],
      departementCodes:
        scopeType === CommercialTransmissionScopeType.GEOGRAPHIC
          ? departementCodes
          : [],
    };
  }

  private normalizeCodes(values?: string[]) {
    return Array.from(
      new Set((values || []).map((value) => value.trim()).filter(Boolean)),
    );
  }

  private serializeTransmission(transmission: CommercialTransmissionEntity) {
    return {
      id: transmission.id,
      ofsId: transmission.ofsId,
      distributor: {
        id: transmission.distributor.id,
        name: transmission.distributor.name,
      },
      isActive: transmission.isActive,
      scopeType: transmission.scopeType,
      inseeCodes: transmission.inseeCodes,
      departementCodes: transmission.departementCodes,
      updatedAt: transmission.updatedAt,
    };
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

  private buildExportRows(lines: ExportContactLine[]) {
    return [
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
  }

  private async buildExcel(lines: ExportContactLine[]) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Simulations');
    worksheet.addRows(this.buildExportRows(lines));

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  private buildCsv(lines: ExportContactLine[]) {
    return `${this.buildExportRows(lines)
      .map((row) => row.map((cell) => this.escapeCsvValue(cell)).join(','))
      .join('\n')}\n`;
  }

  private escapeCsvValue(value: string) {
    const spreadsheetSafeValue = /^[=+\-@\t\r]/.test(value)
      ? `'${value}`
      : value;

    if (/[",\r\n]/.test(spreadsheetSafeValue)) {
      return `"${spreadsheetSafeValue.replace(/"/g, '""')}"`;
    }

    return spreadsheetSafeValue;
  }
}

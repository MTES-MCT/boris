import {
  BadRequestException,
  Controller,
  Get,
  Header,
  NotFoundException,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { IsOptional, IsUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { UserRole } from 'src/domain/user/user-role.enum';
import { Pagination } from 'src/application/common/pagination';
import { PaginationDTO } from '../common/dtos/pagination.dto';
import { EligibilitySimulationRepository } from '../eligibility-simulation/eligibility-simulation.repository';
import { OfsEntity } from '../ofs/ofs.entity';
import { AuditService } from '../audit/audit.service';
import { ApiKeysService } from './api-keys.service';
import { LeadsApiKeyGuard, LeadsApiRequest } from './leads-api-key.guard';

export class ListLeadsDto extends PaginationDTO {
  @IsOptional()
  @IsUUID()
  ofsId?: string;
}

@ApiTags('Leads API v1')
@ApiBearerAuth('Leads API key')
@Controller('/api/v1/leads')
@UseGuards(LeadsApiKeyGuard)
export class LeadsController {
  constructor(
    private readonly contacts: EligibilitySimulationRepository,
    @InjectRepository(OfsEntity) private readonly ofss: Repository<OfsEntity>,
    private readonly keys: ApiKeysService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'List authorized contact lines (read-only)' })
  async list(@Req() request: LeadsApiRequest, @Query() query: ListLeadsDto) {
    const key = request.leadsApiKey;
    const user = key.user;
    const pagination = {
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 150,
    };
    let scope:
      | { distributorId: string; ofsId?: string }
      | { ofsId: string; departementIds: string[] };
    if (user.roles.includes(UserRole.DISTRIBUTOR)) {
      if (!user.distributor) throw new NotFoundException();
      scope = { distributorId: user.distributor.id, ofsId: query.ofsId };
    } else {
      if (!query.ofsId)
        throw new BadRequestException(
          'ofsId is required for OFS and admin accounts.',
        );
      if (
        !user.roles.includes(UserRole.ADMIN) &&
        !user.ofss.some((ofs) => ofs.id === query.ofsId)
      )
        throw new NotFoundException();
      const ofs = await this.ofss.findOne({
        where: { id: query.ofsId },
        relations: ['departements'],
      });
      if (!ofs) throw new NotFoundException();
      scope = {
        ofsId: ofs.id,
        departementIds: ofs.departements.map((departement) => departement.id),
      };
    }
    const [lines, count] = await this.contacts.findApiContactLines(
      pagination,
      scope,
    );
    // Explicit fields keep internal query additions out of the public contract.
    const items = lines.map((line) => ({
      simulationId: line.simulationId,
      locationId: line.locationId,
      ofsId: line.ofsId || query.ofsId!,
      submittedAt: new Date(line.submittedAt).toISOString(),
      fullName: line.fullName,
      email: line.email,
      phone: line.phone,
      city: line.city,
      inseeCode: line.inseeCode,
      departementCode: line.departementCode,
      householdSize: line.householdSize,
      hasDisability: line.hasDisability,
      contribution: line.contribution,
      taxableIncome: line.taxableIncome,
      resources: line.resources,
      propertySituation: line.propertySituation,
      housingType: line.housingType,
      action: line.action,
      status: line.status,
    }));
    await this.audit.record({
      type: 'contacts.released',
      targetType: 'api_key',
      targetId: key.id,
      actor: {
        kind: 'user',
        id: user.id,
        roles: user.roles,
        ref: `api_key:${key.id}`,
      },
      ofsId: query.ofsId,
      ...('distributorId' in scope
        ? { distributorId: scope.distributorId }
        : {}),
      metadata: { count: items.length },
      resources: items.map((line) => ({
        resourceType: 'contact_line',
        resourceId: line.locationId,
        simulationId: line.simulationId,
        ofsId: line.ofsId,
      })),
    });
    await this.keys.markUsed(key.id);
    return new Pagination(items, count, pagination);
  }
}

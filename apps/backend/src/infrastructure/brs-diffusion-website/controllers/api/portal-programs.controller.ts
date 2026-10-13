import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { UserRole } from 'src/domain/user/user-role.enum';
import { PortalApiAuthenticatedGuard } from 'src/infrastructure/auth/guards/portal-api-authenticated.guard';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { CreateBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/create.usecase';
import { UpdateBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/update.usecase';
import { BrsDiffusionWebsiteEntity } from '../../brs-diffusion-website.entity';
import { PortalProgramDto } from '../../dtos/portal-program.dto';

@ApiExcludeController()
@UseGuards(PortalApiAuthenticatedGuard)
@Controller('/api/portal/ofss/:ofsId/programs')
export class PortalProgramsController {
  constructor(
    @InjectRepository(OfsEntity)
    private readonly ofsRepository: Repository<OfsEntity>,
    @InjectRepository(BrsDiffusionWebsiteEntity)
    private readonly programsRepository: Repository<BrsDiffusionWebsiteEntity>,
    private readonly createProgram: CreateBrsDiffusionWebsiteUsecase,
    private readonly updateProgram: UpdateBrsDiffusionWebsiteUsecase,
  ) {}

  @Get()
  public async list(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Req() req: Request,
  ) {
    const ofs = await this.findOfs(ofsId, req.user as UserEntity);
    const programs = await this.programsRepository.find({
      where: { ofs: { id: ofsId }, isDeleted: false },
      relations: ['distributor'],
      order: { createdAt: 'DESC' },
    });
    return {
      ofs: {
        id: ofs.id,
        name: ofs.name,
        distributors: ofs.distributors.map(({ id, name }) => ({ id, name })),
      },
      programs: programs.map((program) => this.serialize(program)),
    };
  }

  @Get(':id')
  public async detail(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    await this.findOfs(ofsId, req.user as UserEntity);
    return this.serialize(await this.findProgram(ofsId, id));
  }

  @Post()
  public async create(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Body() body: PortalProgramDto,
    @Req() req: Request,
  ) {
    const ofs = await this.findOfs(ofsId, req.user as UserEntity);
    return this.createProgram.execute(this.programParams(ofs, body));
  }

  @Put(':id')
  public async update(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: PortalProgramDto,
    @Req() req: Request,
  ) {
    const ofs = await this.findOfs(ofsId, req.user as UserEntity);
    await this.findProgram(ofsId, id);
    return this.updateProgram.execute({ ...this.programParams(ofs, body), id });
  }

  @Delete(':id')
  public async delete(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    await this.findOfs(ofsId, req.user as UserEntity);
    await this.findProgram(ofsId, id);
    await this.programsRepository.update(
      { id, ofs: { id: ofsId }, isDeleted: false },
      { isDeleted: true },
    );
    return { success: true };
  }

  private async findOfs(id: string, user: UserEntity) {
    if (
      !user.roles.includes(UserRole.ADMIN) &&
      (!user.roles.includes(UserRole.OFS) ||
        !user.ofss.some((ofs) => ofs.id === id))
    ) {
      throw new NotFoundException();
    }
    const ofs = await this.ofsRepository.findOne({
      where: { id },
      relations: ['distributors'],
    });
    if (!ofs) throw new NotFoundException();
    return ofs;
  }

  private async findProgram(ofsId: string, id: string) {
    const program = await this.programsRepository.findOne({
      where: { id, ofs: { id: ofsId }, isDeleted: false },
      relations: ['distributor'],
    });
    if (!program) throw new NotFoundException();
    return program;
  }

  private programParams(ofs: OfsEntity, body: PortalProgramDto) {
    const distributor = body.distributorId
      ? ofs.distributors.find((item) => item.id === body.distributorId)
      : null;
    if (body.distributorId && !distributor)
      throw new BadRequestException(
        'Ce commercialisateur n’est pas rattaché à cet OFS.',
      );
    return {
      programName: body.programName,
      source: body.source,
      address: body.address,
      city: body.city,
      inseeCode: body.inseeCode || undefined,
      deliveryMonth: body.deliveryMonth || undefined,
      housingType: body.housingType,
      ofsId: ofs.id,
      ofsName: ofs.name,
      distributorId: distributor?.id || null,
      distributorName: distributor?.name || null,
    };
  }

  private serialize(program: BrsDiffusionWebsiteEntity) {
    return {
      id: program.id,
      programName: program.programName,
      source: program.source,
      address: program.address,
      city: program.city,
      zipcode: program.zipcode,
      inseeCode: program.inseeCode,
      deliveryMonth: program.deliveryMonth,
      housingType: program.housingType,
      distributor: program.distributor
        ? { id: program.distributor.id, name: program.distributor.name }
        : null,
    };
  }
}

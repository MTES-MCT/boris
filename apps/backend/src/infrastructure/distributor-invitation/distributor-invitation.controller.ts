import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request } from 'express';
import { hashResetToken } from 'src/application/user/utils/hash-reset-token';
import { PortalApiAuthenticatedGuard } from '../auth/guards/portal-api-authenticated.guard';
import { AuthRateLimitService } from '../auth/auth-rate-limit.service';
import { UserEntity } from '../user/user.entity';
import { DistributorInvitationService } from './distributor-invitation.service';
import {
  AcceptDistributorInvitationDto,
  InviteDistributorDto,
  LinkDistributorDto,
} from './distributor-invitation.dto';

@ApiExcludeController()
@UseGuards(PortalApiAuthenticatedGuard)
@Controller('/api/portal/ofss/:ofsId/distributors')
export class PortalDistributorInvitationsController {
  constructor(
    private readonly invitations: DistributorInvitationService,
    private readonly rateLimit: AuthRateLimitService,
  ) {}

  @Get()
  async linkedDistributors(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Req() req: Request,
  ) {
    await this.invitations.accessibleOfs(ofsId, req.user as UserEntity);
    return this.invitations.linkedDistributors(ofsId);
  }

  @Get('/search')
  async search(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Query('name') name: string,
    @Req() req: Request,
  ) {
    await this.invitations.accessibleOfs(ofsId, req.user as UserEntity);
    return this.invitations.search(typeof name === 'string' ? name : '');
  }

  @Get('/invitations')
  async list(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Req() req: Request,
  ) {
    await this.invitations.accessibleOfs(ofsId, req.user as UserEntity);
    return this.invitations.list(ofsId);
  }

  @Post('/link')
  async link(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Body() body: LinkDistributorDto,
    @Req() req: Request,
  ) {
    await this.invitations.accessibleOfs(ofsId, req.user as UserEntity);
    return this.invitations.link(ofsId, body.distributorId);
  }

  @Post('/invitations')
  async invite(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Body() body: InviteDistributorDto,
    @Req() req: Request,
  ) {
    const ofs = await this.invitations.accessibleOfs(
      ofsId,
      req.user as UserEntity,
    );
    await this.rateLimit.consume(
      `distributor-invite:${ofsId}`,
      30,
      60 * 60 * 1000,
    );
    return this.invitations.invite(ofs, body);
  }

  @Post('/invitations/:id/resend')
  async resend(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    const ofs = await this.invitations.accessibleOfs(
      ofsId,
      req.user as UserEntity,
    );
    await this.rateLimit.consume(
      `distributor-invite:${ofsId}`,
      30,
      60 * 60 * 1000,
    );
    return this.invitations.manage(ofs, id, 'resend');
  }

  @Post('/invitations/:id/cancel')
  async cancel(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    const ofs = await this.invitations.accessibleOfs(
      ofsId,
      req.user as UserEntity,
    );
    return this.invitations.manage(ofs, id, 'cancel');
  }
}

@ApiExcludeController()
@Controller('/api/portal/distributor-invitations')
export class AcceptDistributorInvitationController {
  constructor(
    private readonly invitations: DistributorInvitationService,
    private readonly rateLimit: AuthRateLimitService,
  ) {}

  @Post('/inspect')
  @Header('Cache-Control', 'no-store')
  async inspect(@Body() body: AcceptDistributorInvitationDto) {
    await this.rateLimit.consume(
      `distributor-invitation-inspect:${hashResetToken(body.token)}`,
      60,
      60 * 60 * 1000,
    );
    return this.invitations.inspect(body.token);
  }

  @Post('/accept')
  async accept(@Body() body: AcceptDistributorInvitationDto) {
    await this.rateLimit.consume(
      `distributor-invitation-accept:${hashResetToken(body.token)}`,
      20,
      60 * 60 * 1000,
    );
    return this.invitations.accept(body);
  }
}

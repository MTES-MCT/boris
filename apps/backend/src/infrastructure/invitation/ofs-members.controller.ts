import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request } from 'express';
import { UserRole } from 'src/domain/user/user-role.enum';
import { hashResetToken } from 'src/application/user/utils/hash-reset-token';
import { PortalApiAuthenticatedGuard } from '../auth/guards/portal-api-authenticated.guard';
import { AuthRateLimitService } from '../auth/auth-rate-limit.service';
import { UserEntity } from '../user/user.entity';
import { InvitationService } from './invitation.service';
import { OfsMembersService } from './ofs-members.service';
import {
  AcceptOfsInvitationDto,
  AccountNameDto,
  InspectOfsInvitationDto,
  InviteOfsMemberDto,
} from './ofs-invitation.dto';

@ApiExcludeController()
@UseGuards(PortalApiAuthenticatedGuard)
@Controller('/api/portal/ofss/:ofsId/members')
export class OfsMembersController {
  constructor(
    private readonly members: OfsMembersService,
    private readonly invitations: InvitationService,
    private readonly rateLimit: AuthRateLimitService,
  ) {}

  @Get()
  async list(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Req() req: Request,
  ) {
    await this.invitations.accessibleOfs(ofsId, req.user as UserEntity);
    return {
      members: await this.members.members(ofsId),
      invitations: await this.invitations.list(ofsId, UserRole.OFS),
    };
  }
  @Post('/invitations')
  async invite(
    @Param('ofsId', ParseUUIDPipe) ofsId: string,
    @Body() body: InviteOfsMemberDto,
    @Req() req: Request,
  ) {
    const ofs = await this.invitations.accessibleOfs(
      ofsId,
      req.user as UserEntity,
    );
    await this.rateLimit.consume(`ofs-invite:${ofsId}`, 30, 60 * 60 * 1000);
    return this.members.invite(ofs, body.email);
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
    await this.rateLimit.consume(`ofs-invite:${ofsId}`, 30, 60 * 60 * 1000);
    return this.members.manage(ofs, id, 'resend');
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
    return this.members.manage(ofs, id, 'cancel');
  }
}
@ApiExcludeController()
@Controller('/api/portal/ofs-invitations')
export class AcceptOfsInvitationController {
  constructor(
    private readonly members: OfsMembersService,
    private readonly rateLimit: AuthRateLimitService,
  ) {}
  @Post('/inspect')
  @Header('Cache-Control', 'no-store')
  async inspect(@Body() body: InspectOfsInvitationDto) {
    await this.rateLimit.consume(
      `ofs-invitation-inspect:${hashResetToken(body.token)}`,
      60,
      60 * 60 * 1000,
    );
    return this.members.inspect(body.token);
  }
  @Post('/accept')
  async accept(@Body() body: AcceptOfsInvitationDto) {
    await this.rateLimit.consume(
      `ofs-invitation-accept:${hashResetToken(body.token)}`,
      20,
      60 * 60 * 1000,
    );
    return this.members.accept(body);
  }
}
@ApiExcludeController()
@UseGuards(PortalApiAuthenticatedGuard)
@Controller('/api/portal/account-name')
export class AccountNameController {
  constructor(private readonly members: OfsMembersService) {}
  @Get()
  get(@Req() req: Request) {
    const user = req.user as UserEntity;
    return { firstName: user.firstName, lastName: user.lastName };
  }
  @Post()
  update(@Body() body: AccountNameDto, @Req() req: Request) {
    return this.members.updateName(
      (req.user as UserEntity).id,
      body.firstName,
      body.lastName,
    );
  }
}

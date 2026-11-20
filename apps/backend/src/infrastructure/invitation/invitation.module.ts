import { InvitationService } from './invitation.service';
import { OfsMembersService } from './ofs-members.service';
import {
  OfsMembersController,
  AcceptOfsInvitationController,
  AccountNameController,
} from './ofs-members.controller';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MailerModule } from '../mailer/mailer.module';
import { RateLimitModule } from '../auth/rate-limit.module';
import { PortalApiAuthenticatedGuard } from '../auth/guards/portal-api-authenticated.guard';
import { DistributorInvitationService } from '../distributor-invitation/distributor-invitation.service';
import {
  AcceptDistributorInvitationController,
  PortalDistributorInvitationsController,
} from '../distributor-invitation/distributor-invitation.controller';

@Module({
  imports: [UserModule, MailerModule, RateLimitModule],
  controllers: [
    OfsMembersController,
    AcceptOfsInvitationController,
    AccountNameController,
    PortalDistributorInvitationsController,
    AcceptDistributorInvitationController,
  ],
  providers: [
    InvitationService,
    OfsMembersService,
    DistributorInvitationService,
    PortalApiAuthenticatedGuard,
  ],
})
export class InvitationModule {}

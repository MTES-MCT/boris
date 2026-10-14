import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MailerModule } from '../mailer/mailer.module';
import { RateLimitModule } from '../auth/rate-limit.module';
import { PortalApiAuthenticatedGuard } from '../auth/guards/portal-api-authenticated.guard';
import { DistributorInvitationService } from './distributor-invitation.service';
import {
  AcceptDistributorInvitationController,
  PortalDistributorInvitationsController,
} from './distributor-invitation.controller';

@Module({
  imports: [UserModule, MailerModule, RateLimitModule],
  controllers: [
    PortalDistributorInvitationsController,
    AcceptDistributorInvitationController,
  ],
  providers: [DistributorInvitationService, PortalApiAuthenticatedGuard],
})
export class DistributorInvitationModule {}

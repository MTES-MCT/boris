import { Module } from '@nestjs/common';
import { LeadNotificationEnqueuer } from './lead-notification.enqueuer';

@Module({
  providers: [LeadNotificationEnqueuer],
  exports: [LeadNotificationEnqueuer],
})
export class LeadNotificationQueueModule {}

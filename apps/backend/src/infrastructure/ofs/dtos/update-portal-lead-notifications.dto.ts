import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PortalLeadNotificationFrequency } from '../portal-lead-notification-preference.entity';

export const portalLeadNotificationFrequencies = [
  'none',
  PortalLeadNotificationFrequency.DAILY,
  PortalLeadNotificationFrequency.WEEKLY,
] as const;

export type LeadNotificationFrequencyFormValue =
  (typeof portalLeadNotificationFrequencies)[number];

export class PortalLeadNotificationDto {
  @IsUUID()
  public ofsId: string;

  @IsIn(portalLeadNotificationFrequencies)
  public frequency: LeadNotificationFrequencyFormValue;
}

export class UpdatePortalLeadNotificationsDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortalLeadNotificationDto)
  public notifications?: PortalLeadNotificationDto[];
}

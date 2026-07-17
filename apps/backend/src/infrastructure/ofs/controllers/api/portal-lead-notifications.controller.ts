import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { In, Repository } from 'typeorm';
import { UserRole } from 'src/domain/user/user-role.enum';
import { PortalApiAuthenticatedGuard } from 'src/infrastructure/auth/guards/portal-api-authenticated.guard';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import {
  PortalLeadNotificationFrequency,
  PortalLeadNotificationPreferenceEntity,
} from '../../portal-lead-notification-preference.entity';

type LeadNotificationFrequencyFormValue =
  | PortalLeadNotificationFrequency
  | 'none';

@ApiExcludeController()
@Controller('/api/portal/lead-notifications')
export class PortalLeadNotificationsController {
  constructor(
    @InjectRepository(PortalLeadNotificationPreferenceEntity)
    private readonly preferenceRepository: Repository<PortalLeadNotificationPreferenceEntity>,
  ) {}

  @UseGuards(PortalApiAuthenticatedGuard)
  @Get()
  public async list(@Req() req: Request) {
    const user = req.user as UserEntity;
    const ofss = this.getConfigurableOfss(user);

    if (ofss.length === 0) {
      return [];
    }

    const preferences = await this.preferenceRepository.find({
      where: {
        userId: user.id,
        ofsId: In(ofss.map((ofs) => ofs.id)),
      },
    });

    return ofss.map((ofs) => ({
      ofs: {
        id: ofs.id,
        name: ofs.name,
      },
      frequency:
        preferences.find((preference) => preference.ofsId === ofs.id)
          ?.frequency || 'none',
    }));
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Put()
  public async update(
    @Body()
    body: {
      notifications?: {
        ofsId?: string;
        frequency?: LeadNotificationFrequencyFormValue;
      }[];
    },
    @Req() req: Request,
  ) {
    const user = req.user as UserEntity;
    const ofss = this.getConfigurableOfss(user);
    const accessibleOfsIds = new Set(ofss.map((ofs) => ofs.id));
    const notifications = body.notifications || [];

    for (const notification of notifications) {
      if (!notification.ofsId || !accessibleOfsIds.has(notification.ofsId)) {
        throw new BadRequestException('OFS invalide.');
      }

      if (!this.isValidFrequency(notification.frequency)) {
        throw new BadRequestException('Fréquence invalide.');
      }
    }

    await Promise.all(
      notifications.map(async (notification) => {
        const frequency = notification.frequency;

        if (frequency === 'none') {
          await this.preferenceRepository.delete({
            userId: user.id,
            ofsId: notification.ofsId,
          });
          return;
        }

        if (
          frequency !== PortalLeadNotificationFrequency.DAILY &&
          frequency !== PortalLeadNotificationFrequency.WEEKLY
        ) {
          return;
        }

        let preference = await this.preferenceRepository.findOne({
          where: {
            userId: user.id,
            ofsId: notification.ofsId,
          },
        });

        if (!preference) {
          preference = this.preferenceRepository.create({
            userId: user.id,
            ofsId: notification.ofsId,
          });
        }

        preference.frequency = frequency;
        await this.preferenceRepository.save(preference);
      }),
    );

    return this.list(req);
  }

  private getConfigurableOfss(user: UserEntity) {
    if (!user.roles.includes(UserRole.OFS)) {
      return [];
    }

    return user.ofss
      .slice()
      .sort((left, right) => left.name.localeCompare(right.name, 'fr'));
  }

  private isValidFrequency(
    value: LeadNotificationFrequencyFormValue | undefined,
  ): value is LeadNotificationFrequencyFormValue {
    return (
      value === 'none' ||
      value === PortalLeadNotificationFrequency.DAILY ||
      value === PortalLeadNotificationFrequency.WEEKLY
    );
  }
}

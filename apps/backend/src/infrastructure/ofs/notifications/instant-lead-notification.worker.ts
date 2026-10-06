import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  BeforeApplicationShutdown,
} from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { DataSource, QueryRunner } from 'typeorm';
import { MailerServiceInterface } from 'src/domain/mailer/mailer.service.interface';
import { InstantLeadNotificationStore } from './instant-lead-notification.store';

interface NotificationConnection {
  on(event: string, listener: () => void): void;
  removeListener(event: string, listener: () => void): void;
}

@Injectable()
export class InstantLeadNotificationWorker
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  private readonly logger = new Logger(InstantLeadNotificationWorker.name);
  private listener?: QueryRunner;
  private connection?: NotificationConnection;
  private connecting = false;
  private running = false;
  private requested = false;
  private stopping = false;
  private drained?: () => void;
  private readonly notified = () => {
    void this.execute();
  };
  private readonly disconnected = () => {
    this.logger.warn(
      'Lead notification listener disconnected; recovery will reconnect',
    );
    void this.closeListener();
  };

  constructor(
    private readonly dataSource: DataSource,
    private readonly store: InstantLeadNotificationStore,
    @Inject('MailerServiceInterface')
    private readonly mailer: MailerServiceInterface,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    if (!this.enabled()) return;
    await this.connectListener();
    // Pending emails must not delay the HTTP server from starting.
    void this.execute();
  }

  @Interval(15_000)
  public async recover(): Promise<void> {
    if (!this.enabled() || this.stopping) return;
    await this.connectListener();
    await this.execute();
  }

  public async beforeApplicationShutdown(): Promise<void> {
    this.stopping = true;
    await this.closeListener();
    if (this.running) {
      await new Promise<void>((resolve) => {
        this.drained = resolve;
      });
    }
  }

  private enabled(): boolean {
    return process.env.OFS_PORTAL_INSTANT_NOTIFICATIONS === 'enabled';
  }

  private async connectListener(): Promise<void> {
    if (this.listener || this.connecting || this.stopping) return;
    this.connecting = true;
    const runner = this.dataSource.createQueryRunner();
    try {
      this.connection = (await runner.connect()) as NotificationConnection;
      this.listener = runner;
      this.connection.on('notification', this.notified);
      this.connection.on('error', this.disconnected);
      this.connection.on('end', this.disconnected);
      await runner.query('LISTEN portal_lead_notifications');
      if (this.stopping) await this.closeListener();
    } catch {
      this.logger.error(
        'Could not listen for lead notifications; periodic recovery remains active',
      );
      if (this.listener === runner) await this.closeListener();
      else await runner.release();
    } finally {
      this.connecting = false;
    }
  }

  private async closeListener(): Promise<void> {
    const runner = this.listener;
    const connection = this.connection;
    this.listener = undefined;
    this.connection = undefined;
    if (runner) {
      try {
        // Remove the subscription before returning this connection to the pool.
        await runner.query('UNLISTEN portal_lead_notifications');
      } catch {
        /* A disconnected client cannot unlisten. */
      }
      connection?.removeListener('notification', this.notified);
      connection?.removeListener('error', this.disconnected);
      connection?.removeListener('end', this.disconnected);
      await runner.release();
    }
  }

  public async execute(): Promise<void> {
    if (!this.enabled() || this.stopping) return;
    const templateId = Number(
      process.env.OFS_PORTAL_LEAD_NOTIFICATION_TEMPLATE_ID,
    );
    const portalUrl = process.env.OFS_PORTAL_URL;
    if (!Number.isInteger(templateId) || templateId <= 0 || !portalUrl) return;
    this.requested = true;
    if (this.running) return;
    this.running = true;
    try {
      do {
        this.requested = false;
        for (
          let processed = 0;
          processed < 100 && !this.stopping;
          processed++
        ) {
          const event = await this.store.claimEvent();
          if (event) {
            try {
              await this.store.resolveEvent(event);
            } catch {
              await this.store.retryEvent(event);
              this.logger.error(
                `Lead notification event ${event.id} failed (attempt ${event.attempts})`,
              );
            }
          }
          const delivery = await this.store.claim();
          if (!delivery) {
            if (!event) break;
            continue;
          }
          try {
            const recipient = await this.store.findRecipient(delivery.id);
            if (!recipient) {
              await this.store.complete(delivery, 'cancelled');
              continue;
            }
            await this.mailer.sendEmail(
              [
                {
                  email: recipient.email,
                  name: recipient.email,
                  params: {
                    count: 1,
                    ofsName: recipient.ofsName,
                    dashboardUrl: `${portalUrl.replace(/\/$/, '')}/ofs/${recipient.ofsId}`,
                  },
                },
              ],
              `Vous avez 1 nouvelle piste pour ${recipient.ofsName}`,
              templateId,
            );
            await this.store.complete(delivery, 'sent');
          } catch {
            await this.store.retry(delivery);
            this.logger.error(
              `Lead notification delivery ${delivery.id} failed (attempt ${delivery.attempts})`,
            );
          }
        }
      } while (this.requested && !this.stopping);
    } catch {
      this.logger.error(
        'Lead notification processing failed; pending deliveries will be recovered',
      );
    } finally {
      this.running = false;
      this.drained?.();
      this.drained = undefined;
    }
  }
}

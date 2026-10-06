import { DataSource } from 'typeorm';
import { InstantLeadNotificationWorker } from 'src/infrastructure/ofs/notifications/instant-lead-notification.worker';
import { InstantLeadNotificationStore } from 'src/infrastructure/ofs/notifications/instant-lead-notification.store';
import { MailerServiceInterface } from 'src/domain/mailer/mailer.service.interface';

const delivery = {
  id: 'delivery',
  eventId: 'event',
  attempts: 1,
  claimToken: 'claim',
};

describe('InstantLeadNotificationWorker', () => {
  let worker: InstantLeadNotificationWorker;
  const store = {
    claimEvent: jest.fn(),
    resolveEvent: jest.fn(),
    retryEvent: jest.fn(),
    claim: jest.fn(),
    findRecipient: jest.fn(),
    complete: jest.fn(),
    retry: jest.fn(),
  };
  const mailer = { sendEmail: jest.fn() };
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.OFS_PORTAL_INSTANT_NOTIFICATIONS = 'enabled';
    process.env.OFS_PORTAL_LEAD_NOTIFICATION_TEMPLATE_ID = '42';
    process.env.OFS_PORTAL_URL = 'https://portal.example.test/';
    worker = new InstantLeadNotificationWorker(
      {} as DataSource,
      store as unknown as InstantLeadNotificationStore,
      mailer as MailerServiceInterface,
    );
    store.claimEvent.mockResolvedValue(undefined);
    store.resolveEvent.mockResolvedValue(undefined);
    store.retryEvent.mockResolvedValue(undefined);
    store.claim.mockResolvedValueOnce(delivery).mockResolvedValue(undefined);
    store.findRecipient.mockResolvedValue({
      email: 'ofs@example.test',
      ofsId: 'ofs',
      ofsName: 'OFS test',
    });
    store.complete.mockResolvedValue(undefined);
    store.retry.mockResolvedValue(undefined);
    mailer.sendEmail.mockResolvedValue(undefined);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('resolves the simulation event before processing email deliveries', async () => {
    const event = {
      id: 'event',
      simulationId: 'simulation',
      attempts: 1,
      claimToken: 'event-claim',
    };
    store.claimEvent.mockResolvedValueOnce(event).mockResolvedValue(undefined);
    await worker.execute();
    expect(store.resolveEvent).toHaveBeenCalledWith(event);
    expect(store.resolveEvent.mock.invocationCallOrder[0]).toBeLessThan(
      store.claim.mock.invocationCallOrder[0],
    );
    expect(mailer.sendEmail).toHaveBeenCalledTimes(1);
  });

  it('retries failed OFS resolution without sending an email', async () => {
    const event = {
      id: 'event',
      simulationId: 'simulation',
      attempts: 1,
      claimToken: 'event-claim',
    };
    store.claimEvent.mockResolvedValueOnce(event).mockResolvedValue(undefined);
    store.resolveEvent.mockRejectedValue(new Error('Database unavailable'));
    store.claim.mockReset().mockResolvedValue(undefined);
    await worker.execute();
    expect(store.retryEvent).toHaveBeenCalledWith(event);
    expect(mailer.sendEmail).not.toHaveBeenCalled();
  });

  it('sends the dashboard link and marks successful deliveries', async () => {
    await worker.execute();
    expect(mailer.sendEmail).toHaveBeenCalledWith(
      [
        {
          email: 'ofs@example.test',
          name: 'ofs@example.test',
          params: {
            count: 1,
            ofsName: 'OFS test',
            dashboardUrl: 'https://portal.example.test/ofs/ofs',
          },
        },
      ],
      'Vous avez 1 nouvelle piste pour OFS test',
      42,
    );
    expect(store.complete).toHaveBeenCalledWith(delivery, 'sent');
  });

  it('cancels when current access or preferences no longer allow delivery', async () => {
    store.findRecipient.mockResolvedValue(undefined);
    await worker.execute();
    expect(mailer.sendEmail).not.toHaveBeenCalled();
    expect(store.complete).toHaveBeenCalledWith(delivery, 'cancelled');
  });

  it('queues a retry instead of recording success after a rejected email', async () => {
    mailer.sendEmail.mockRejectedValue(new Error('HTTP 503'));
    await worker.execute();
    expect(store.complete).not.toHaveBeenCalled();
    expect(store.retry).toHaveBeenCalledWith(delivery);
  });

  it('does not claim anything when disabled or unconfigured', async () => {
    delete process.env.OFS_PORTAL_INSTANT_NOTIFICATIONS;
    await worker.execute();
    process.env.OFS_PORTAL_INSTANT_NOTIFICATIONS = 'enabled';
    delete process.env.OFS_PORTAL_LEAD_NOTIFICATION_TEMPLATE_ID;
    await worker.execute();
    expect(store.claim).not.toHaveBeenCalled();
  });

  it('does not process the same queue concurrently when repeatedly woken', async () => {
    let finishSend!: () => void;
    let startedSend!: () => void;
    const started = new Promise<void>((resolve) => {
      startedSend = resolve;
    });
    mailer.sendEmail.mockImplementation(() => {
      startedSend();
      return new Promise<void>((resolve) => {
        finishSend = resolve;
      });
    });
    const processing = worker.execute();
    await started;
    await worker.execute();
    expect(mailer.sendEmail).toHaveBeenCalledTimes(1);
    finishSend();
    await processing;
    expect(store.complete).toHaveBeenCalledTimes(1);
  });
  it('starts without waiting for email and drains an in-flight send before shutdown', async () => {
    let finishSend!: () => void;
    let startedSend!: () => void;
    const started = new Promise<void>((resolve) => {
      startedSend = resolve;
    });
    mailer.sendEmail.mockImplementation(() => {
      startedSend();
      return new Promise<void>((resolve) => {
        finishSend = resolve;
      });
    });
    const connection = { on: jest.fn(), removeListener: jest.fn() };
    const runner = {
      connect: jest.fn().mockResolvedValue(connection),
      query: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
    };
    const database = { createQueryRunner: jest.fn().mockReturnValue(runner) };
    worker = new InstantLeadNotificationWorker(
      database as unknown as DataSource,
      store as unknown as InstantLeadNotificationStore,
      mailer,
    );
    await worker.onApplicationBootstrap();
    await started;
    expect(store.complete).not.toHaveBeenCalled();
    let stopped = false;
    const shutdown = worker.beforeApplicationShutdown().then(() => {
      stopped = true;
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(stopped).toBe(false);
    finishSend();
    await shutdown;
    expect(store.complete).toHaveBeenCalledWith(delivery, 'sent');
    expect(runner.query).toHaveBeenCalledWith(
      'UNLISTEN portal_lead_notifications',
    );
    expect(runner.release).toHaveBeenCalledTimes(1);
  });
});

import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { AddInstantLeadNotifications1791000000000 } from 'src/infrastructure/persistence/migrations/1791000000000-add_instant_lead_notifications';
import { LeadNotificationEnqueuer } from 'src/infrastructure/ofs/notifications/lead-notification.enqueuer';
import { InstantLeadNotificationStore } from 'src/infrastructure/ofs/notifications/instant-lead-notification.store';
import { InstantLeadNotificationWorker } from 'src/infrastructure/ofs/notifications/instant-lead-notification.worker';
import { EligibilitySimulationRepository } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.repository';
import { EligibilitySimulationEntity } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.entity';
import { LocationRepository } from 'src/infrastructure/location/location.repository';
import { LocationEntity } from 'src/infrastructure/location/location.entity';
import { LeadNotificationOptions } from 'src/domain/ofs/lead-notification-options';

// A dedicated test database is required; each run owns an isolated schema.
const databaseUrl = process.env.LEAD_NOTIFICATION_TEST_DATABASE_URL;
const describeDatabase = databaseUrl ? describe : describe.skip;

describeDatabase('Complete lead notifications (PostgreSQL)', () => {
  let database: DataSource;
  let admin: DataSource;
  let store: InstantLeadNotificationStore;
  let simulations: EligibilitySimulationRepository;
  let locations: LocationRepository;
  const enqueuer = new LeadNotificationEnqueuer();
  const schema = `lead_notifications_test_${randomUUID().replace(/-/g, '')}`;
  const simulationId = randomUUID();
  const ofsId = randomUUID();
  const otherOfsId = randomUUID();
  const userId = randomUUID();
  const departmentId = randomUUID();
  const migration = new AddInstantLeadNotifications1791000000000();

  beforeAll(async () => {
    admin = await new DataSource({
      type: 'postgres',
      url: databaseUrl,
    }).initialize();
    await admin.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await admin.query(`CREATE SCHEMA "${schema}"`);
    database = await new DataSource({
      type: 'postgres',
      url: databaseUrl,
      schema,
      entities: typeormConfig.entities,
      extra: { options: `-c search_path=${schema},public` },
    }).initialize();
    await database.synchronize();
    await database.query(`
      ALTER TYPE portal_lead_notification_preference_frequency_enum RENAME TO old_frequency;
      CREATE TYPE portal_lead_notification_preference_frequency_enum AS ENUM ('daily', 'weekly');
      ALTER TABLE portal_lead_notification_preference ALTER COLUMN frequency
        TYPE portal_lead_notification_preference_frequency_enum
        USING frequency::text::portal_lead_notification_preference_frequency_enum;
      DROP TYPE old_frequency;
    `);
    const runner = database.createQueryRunner();
    await runner.startTransaction();
    await migration.up(runner);
    await runner.commitTransaction();
    await runner.release();
    store = new InstantLeadNotificationStore(database);
    simulations = new EligibilitySimulationRepository(
      database.getRepository(EligibilitySimulationEntity),
      enqueuer,
    );
    locations = new LocationRepository(
      database.getRepository(LocationEntity),
      enqueuer,
    );
  });

  afterAll(async () => {
    if (database?.isInitialized) await database.destroy();
    if (admin?.isInitialized) {
      await admin.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
      await admin.destroy();
    }
  });

  beforeEach(async () => {
    await database.query(`TRUNCATE portal_lead_notification_delivery, portal_lead_notification_event,
      location, eligibility_simulation, portal_lead_notification_preference, user_ofs,
      ofs_departement, ofs, departement, "user" CASCADE`);
    await database.query(
      'INSERT INTO ofs (id, name) VALUES ($1, $2), ($3, $4)',
      [ofsId, 'OFS test', otherOfsId, 'Other OFS'],
    );
    await database.query(
      `INSERT INTO "user" (id, email, password, "isActive", roles)
      VALUES ($1, $2, 'test-hash', true, '{ofs}')`,
      [userId, 'ofs@example.test'],
    );
    await database.query('INSERT INTO user_ofs VALUES ($1, $2)', [
      userId,
      ofsId,
    ]);
    await database.query(
      'INSERT INTO departement (id, name, code) VALUES ($1, $2, $3)',
      [departmentId, 'Test department', '75'],
    );
    await database.query(
      'INSERT INTO ofs_departement VALUES ($1, $2), ($3, $2)',
      [ofsId, departmentId, otherOfsId],
    );
    await database.query(
      `INSERT INTO portal_lead_notification_preference ("userId", "ofsId", frequency)
      VALUES ($1, $2, 'instant')`,
      [userId, ofsId],
    );
    await simulations.save(
      Object.assign(new EligibilitySimulationEntity(), { id: simulationId }),
    );
  });

  async function saveDetails(options: LeadNotificationOptions = {}) {
    await simulations.save(
      Object.assign(new EligibilitySimulationEntity(), {
        id: simulationId,
        hasRefusedConnection: false,
        email: 'household@example.test',
        contribution: 0,
        resources: 0,
      }),
      options,
    );
  }

  async function addLocation(options: LeadNotificationOptions = {}) {
    await locations.save(
      Object.assign(new LocationEntity(), {
        eligibilitySimulation: { id: simulationId },
        departement: { id: departmentId },
      }),
      options,
    );
  }

  async function prepareLead() {
    await saveDetails();
    await addLocation();
  }

  async function submitLead() {
    await simulations.save(
      Object.assign(new EligibilitySimulationEntity(), { id: simulationId }),
      { submitLead: true },
    );
  }

  async function eventCount() {
    const rows: { count: string }[] = await database.query(
      'SELECT count(*) FROM portal_lead_notification_event',
    );
    return Number(rows[0].count);
  }

  async function deliveryCount() {
    const rows: { count: string }[] = await database.query(
      'SELECT count(*) FROM portal_lead_notification_delivery',
    );
    return Number(rows[0].count);
  }

  async function resolveNext() {
    const event = await store.claimEvent();
    if (event) await store.resolveEvent(event);
    return event;
  }

  async function readyDeliveries() {
    await prepareLead();
    await submitLead();
    await resolveNext();
  }

  it('does not queue initial creation, contact details, locations, or intermediate complete saves', async () => {
    expect(await eventCount()).toBe(0);
    await saveDetails();
    expect(await eventCount()).toBe(0);
    await addLocation();
    expect(await eventCount()).toBe(0);
    await saveDetails();
    expect(await eventCount()).toBe(0);
    await submitLead();
    expect(await eventCount()).toBe(1);
    expect(await deliveryCount()).toBe(0); // Recipient lookup belongs to the worker.
  });

  it.each(['location', 'email', 'consent', 'contribution', 'resources'])(
    'rejects a final submission missing %s instead of queueing it',
    async (missing) => {
      await prepareLead();
      switch (missing) {
        case 'location':
          await database.query('DELETE FROM location');
          break;
        case 'email':
          await database.query(
            'UPDATE eligibility_simulation SET email = NULL',
          );
          break;
        case 'consent':
          await database.query(
            'UPDATE eligibility_simulation SET "hasRefusedConnection" = true',
          );
          break;
        case 'contribution':
          await database.query(
            'UPDATE eligibility_simulation SET contribution = NULL',
          );
          break;
        case 'resources':
          await database.query(
            'UPDATE eligibility_simulation SET resources = NULL',
          );
          break;
      }
      await expect(submitLead()).rejects.toThrow('La piste doit contenir');
      expect(await eventCount()).toBe(0);
      expect(await deliveryCount()).toBe(0);
    },
  );

  it('creates one event for a simulation matching multiple OFS and resolves them in the worker', async () => {
    await database.query('INSERT INTO user_ofs VALUES ($1, $2)', [
      userId,
      otherOfsId,
    ]);
    await database.query(
      `INSERT INTO portal_lead_notification_preference ("userId", "ofsId", frequency)
      VALUES ($1, $2, 'instant')`,
      [userId, otherOfsId],
    );
    await prepareLead();
    await addLocation();
    await submitLead();
    expect(await eventCount()).toBe(1);
    expect(await deliveryCount()).toBe(0);
    await resolveNext();
    expect(await deliveryCount()).toBe(2);
    const rows: { ofsId: string }[] = await database.query(
      'SELECT "ofsId" FROM portal_lead_notification_delivery ORDER BY "ofsId"',
    );
    expect(rows.map((row) => row.ofsId).sort()).toEqual(
      [ofsId, otherOfsId].sort(),
    );
  });

  it('does not create another event or delivery after repeated submissions or location edits', async () => {
    await readyDeliveries();
    await submitLead();
    await saveDetails();
    await addLocation();
    await submitLead();
    expect(await eventCount()).toBe(1);
    expect(await store.claimEvent()).toBeUndefined();
    expect(await deliveryCount()).toBe(1);
  });

  it('queues at most one event for concurrent final submissions', async () => {
    await prepareLead();
    await Promise.all([submitLead(), submitLead()]);
    expect(await eventCount()).toBe(1);
  });

  it('does not enqueue automatically when SQL bypasses the application', async () => {
    await database.query(
      `UPDATE eligibility_simulation SET "hasRefusedConnection" = false,
      email = 'household@example.test', contribution = 1, resources = 1 WHERE id = $1`,
      [simulationId],
    );
    await database.query(
      'INSERT INTO location ("eligibilitySimulationId", "departementId") VALUES ($1, $2)',
      [simulationId, departmentId],
    );
    expect(await eventCount()).toBe(0);
    await submitLead();
    expect(await eventCount()).toBe(1);
  });

  it('resolves current subscribers in the worker, without replay after opting in later', async () => {
    await database.query(
      "UPDATE portal_lead_notification_preference SET frequency = 'daily'",
    );
    await prepareLead();
    await submitLead();
    await resolveNext();
    expect(await eventCount()).toBe(1);
    expect(await deliveryCount()).toBe(0);
    await database.query(
      "UPDATE portal_lead_notification_preference SET frequency = 'instant'",
    );
    await submitLead();
    expect(await store.claimEvent()).toBeUndefined();
    expect(await deliveryCount()).toBe(0);
  });

  it('suppresses historical Landbot simulations without putting them in the pending queue', async () => {
    await database.query(
      'UPDATE eligibility_simulation SET "isFromLandbot" = true',
    );
    await prepareLead();
    await submitLead();
    expect(await eventCount()).toBe(1);
    expect(await store.claimEvent()).toBeUndefined();
    expect(await deliveryCount()).toBe(0);
  });

  it('explicitly baselines historical imports and prevents later replay', async () => {
    await saveDetails({ suppressLeadNotifications: true });
    await addLocation({ suppressLeadNotifications: true });
    expect(await eventCount()).toBe(1);
    expect(await store.claimEvent()).toBeUndefined();
    await submitLead();
    expect(await deliveryCount()).toBe(0);
  });

  it('requires a transaction for final enqueueing', async () => {
    await expect(
      enqueuer.enqueue(database.manager, simulationId, { submitLead: true }),
    ).rejects.toThrow('contact save transaction');
  });

  it('rolls back the final data save if queue creation fails', async () => {
    await prepareLead();
    const failing = new LeadNotificationEnqueuer();
    jest
      .spyOn(failing, 'enqueue')
      .mockRejectedValue(new Error('Queue unavailable'));
    const repository = new EligibilitySimulationRepository(
      database.getRepository(EligibilitySimulationEntity),
      failing,
    );
    await expect(
      repository.save(
        Object.assign(new EligibilitySimulationEntity(), {
          id: simulationId,
          firstName: 'Not persisted',
        }),
        { submitLead: true },
      ),
    ).rejects.toThrow('Queue unavailable');
    const rows: { firstName: string | null }[] = await database.query(
      'SELECT "firstName" FROM eligibility_simulation WHERE id = $1',
      [simulationId],
    );
    expect(rows[0].firstName).toBeNull();
    expect(await eventCount()).toBe(0);
  });

  it('rolls back an explicitly enqueued event together with its transaction', async () => {
    await prepareLead();
    const runner = database.createQueryRunner();
    await runner.startTransaction();
    try {
      await enqueuer.enqueue(runner.manager, simulationId, {
        submitLead: true,
      });
      const rows: { count: string }[] = await runner.query(
        'SELECT count(*) FROM portal_lead_notification_event',
      );
      expect(Number(rows[0].count)).toBe(1);
      await runner.rollbackTransaction();
    } finally {
      await runner.release();
    }
    expect(await eventCount()).toBe(0);
  });

  it('cancels resolution if consent was withdrawn after a complete lead was submitted', async () => {
    await prepareLead();
    await submitLead();
    await database.query(
      'UPDATE eligibility_simulation SET "hasRefusedConnection" = true',
    );
    await resolveNext();
    expect(await deliveryCount()).toBe(0);
    const rows: { status: string }[] = await database.query(
      'SELECT status FROM portal_lead_notification_event',
    );
    expect(rows[0].status).toBe('cancelled');
  });

  it.each(['consent', 'preference', 'access', 'active', 'role', 'location'])(
    'rechecks %s before email delivery',
    async (change) => {
      await readyDeliveries();
      const delivery = (await store.claim())!;
      switch (change) {
        case 'consent':
          await database.query(
            'UPDATE eligibility_simulation SET "hasRefusedConnection" = true',
          );
          break;
        case 'preference':
          await database.query(
            'DELETE FROM portal_lead_notification_preference',
          );
          break;
        case 'access':
          await database.query('DELETE FROM user_ofs');
          break;
        case 'active':
          await database.query('UPDATE "user" SET "isActive" = false');
          break;
        case 'role':
          await database.query(
            `UPDATE "user" SET roles = '{commercialisateur}'`,
          );
          break;
        case 'location':
          await database.query('DELETE FROM location');
          break;
      }
      expect(await store.findRecipient(delivery.id)).toBeUndefined();
      await store.complete(delivery, 'cancelled');
      expect(await store.claim()).toBeUndefined();
    },
  );

  it('lets only one worker claim an event or delivery concurrently', async () => {
    await prepareLead();
    await submitLead();
    const events = await Promise.all([store.claimEvent(), store.claimEvent()]);
    expect(events.filter(Boolean)).toHaveLength(1);
    await store.resolveEvent(events.find(Boolean)!);
    const deliveries = await Promise.all([store.claim(), store.claim()]);
    expect(deliveries.filter(Boolean)).toHaveLength(1);
  });

  it('fences an expired event claim and recovers recipient expansion without duplicates', async () => {
    await prepareLead();
    await submitLead();
    const old = (await store.claimEvent())!;
    await database.query(
      'UPDATE portal_lead_notification_event SET "lockedUntil" = now() - interval \'1 second\'',
    );
    const current = (await store.claimEvent())!;
    await store.resolveEvent(old);
    expect(await deliveryCount()).toBe(0);
    await store.resolveEvent(current);
    await store.resolveEvent(current);
    expect(await deliveryCount()).toBe(1);
  });

  it('rolls back failed recipient expansion and retries it as one event', async () => {
    await prepareLead();
    await submitLead();
    const event = (await store.claimEvent())!;
    await database.query(
      'ALTER TABLE portal_lead_notification_delivery ADD CONSTRAINT test_failure CHECK (false)',
    );
    try {
      await expect(store.resolveEvent(event)).rejects.toThrow();
      expect(await deliveryCount()).toBe(0);
      await store.retryEvent(event);
      expect(await store.claimEvent()).toBeUndefined();
    } finally {
      await database.query(
        'ALTER TABLE portal_lead_notification_delivery DROP CONSTRAINT test_failure',
      );
    }
    await database.query(
      'UPDATE portal_lead_notification_event SET "nextAttemptAt" = now()',
    );
    await resolveNext();
    expect(await deliveryCount()).toBe(1);
  });

  it('recovers expired delivery leases and ignores completion by the old worker', async () => {
    await readyDeliveries();
    const old = (await store.claim())!;
    await database.query(
      'UPDATE portal_lead_notification_delivery SET "lockedUntil" = now() - interval \'1 second\'',
    );
    const current = (await store.claim())!;
    await store.complete(old, 'sent');
    const rows: { status: string }[] = await database.query(
      'SELECT status FROM portal_lead_notification_delivery',
    );
    expect(rows[0].status).toBe('pending');
    await store.complete(current, 'sent');
    expect(await store.claim()).toBeUndefined();
  });

  it('backs off event and delivery failures and stops after ten attempts', async () => {
    await prepareLead();
    await submitLead();
    await store.retryEvent((await store.claimEvent())!);
    expect(await store.claimEvent()).toBeUndefined();
    await database.query(
      'UPDATE portal_lead_notification_event SET "nextAttemptAt" = now(), attempts = 9',
    );
    await store.retryEvent((await store.claimEvent())!);
    const failed: { status: string }[] = await database.query(
      'SELECT status FROM portal_lead_notification_event',
    );
    expect(failed[0].status).toBe('failed');
    await database.query(
      'UPDATE portal_lead_notification_event SET status = \'pending\', attempts = 0, "nextAttemptAt" = now()',
    );
    await resolveNext();
    await store.retry((await store.claim())!);
    expect(await store.claim()).toBeUndefined();
    await database.query(
      'UPDATE portal_lead_notification_delivery SET "nextAttemptAt" = now(), attempts = 9',
    );
    await store.retry((await store.claim())!);
    const deliveries: { status: string }[] = await database.query(
      'SELECT status FROM portal_lead_notification_delivery',
    );
    expect(deliveries[0].status).toBe('failed');
  });

  it.each(['notification', 'restart'])(
    'processes a submitted lead through the worker after %s',
    async (mode) => {
      const previousEnv = { ...process.env };
      process.env.OFS_PORTAL_INSTANT_NOTIFICATIONS = 'enabled';
      process.env.OFS_PORTAL_LEAD_NOTIFICATION_TEMPLATE_ID = '42';
      process.env.OFS_PORTAL_URL = 'https://portal.example.test';
      let delivered!: () => void;
      const sent = new Promise<void>((resolve) => {
        delivered = resolve;
      });
      const mailer = {
        sendEmail: jest.fn().mockImplementation(() => {
          delivered();
          return Promise.resolve();
        }),
      };
      const worker = new InstantLeadNotificationWorker(database, store, mailer);
      let timeout: ReturnType<typeof setTimeout> | undefined;
      try {
        if (mode === 'notification') await worker.onApplicationBootstrap();
        await prepareLead();
        await submitLead();
        if (mode === 'restart') await worker.onApplicationBootstrap();
        await Promise.race([
          sent,
          new Promise<void>((_, reject) => {
            timeout = setTimeout(
              () => reject(new Error('Worker did not process submitted lead')),
              3000,
            );
          }),
        ]);
        expect(mailer.sendEmail).toHaveBeenCalledTimes(1);
      } finally {
        if (timeout) clearTimeout(timeout);
        await worker.beforeApplicationShutdown();
        process.env = previousEnv;
      }
      expect(await eventCount()).toBe(1);
      const rows: { status: string }[] = await database.query(
        'SELECT status FROM portal_lead_notification_delivery',
      );
      expect(rows[0].status).toBe('sent');
    },
  );

  it('notifies only after the final-save transaction commits', async () => {
    await prepareLead();
    const runner = database.createQueryRunner();
    await runner.startTransaction();
    try {
      await enqueuer.enqueue(runner.manager, simulationId, {
        submitLead: true,
      });
      expect(await store.claimEvent()).toBeUndefined();
      await runner.commitTransaction();
      expect(await store.claimEvent()).toBeDefined();
    } finally {
      if (runner.isTransactionActive) await runner.rollbackTransaction();
      await runner.release();
    }
  });

  it('starts with empty notification tables even when complete leads already exist', async () => {
    await prepareLead();
    await submitLead();
    const runner = database.createQueryRunner();
    await runner.startTransaction();
    await migration.down(runner);
    await runner.commitTransaction();
    await runner.startTransaction();
    await migration.up(runner);
    await runner.commitTransaction();
    await runner.release();
    expect(await eventCount()).toBe(0);
    expect(await store.claimEvent()).toBeUndefined();
    expect(await deliveryCount()).toBe(0);
    await submitLead();
    expect(await eventCount()).toBe(1);
    expect(await store.claimEvent()).toBeDefined();
  });
});

# Instant OFS lead notifications

OFS accounts can select **À chaque nouvelle piste** per OFS in **Mon compte**.
Daily, weekly and disabled preferences retain their existing behavior.

## When a lead enters the queue

The public simulator sends `submitLead: true` with its final **Informations additionnelles**
submission, after collecting contact details, consent, locations and finances.
Ordinary simulation creation and intermediate form saves enqueue nothing, even if
some steps have already supplied enough fields to display the contact.

The backend validates that the submission contains an email, connection consent,
contribution, resources and at least one saved location with a department.
An incomplete final submission is rejected; it does not become a job for the worker
to ignore. The final data save and queue insert share one database transaction.
There are no notification triggers or stored procedures.

The application creates **one event per simulation**, storing its simulation ID without
looking up OFS or subscribed accounts. A unique simulation ID prevents subsequent
submissions and edits, including location edits, from creating another event.
This is a notification of the first complete lead submission, not of later edits.
API clients submitting new leads must also send `submitLead: true` at completion.

## Worker processing

The worker claims a submitted simulation event, finds its matching OFS from its saved
locations, then finds active accounts with OFS access and instant subscriptions.
It creates one email delivery per simulation/OFS/account, regardless of how many
searched locations match that OFS. OFS resolution and delivery creation run in the
worker and commit atomically with marking the event processed. Retried expansion
cannot create duplicate deliveries.

There may be zero matching recipients. The event is still marked processed, so an
account opting in later does not replay that lead. Preferences and OFS scopes are
resolved when the worker processes the event. Consent and readiness are rechecked
in case they changed after submission; withdrawn contacts are cancelled. Account
activity, role, access, preferences and contact scope are checked again before each email.

PostgreSQL `LISTEN`/`NOTIFY` wakes the worker after the final-save transaction commits.
A listener reserves one connection from the existing database pool. A 15-second recovery
check handles missed notifications, reconnections and retry deadlines; it does not
scan simulations. Events and email deliveries use `FOR UPDATE SKIP LOCKED`, two-minute
leases and claim tokens to coordinate multiple backend instances and fence stale workers.
Queued emails do not block server startup. Graceful shutdown drains the active send
before closing the database pool.

The existing Brevo lead digest template is reused with `count=1`, the OFS name and
a dashboard link. The mailer rejects unsuccessful HTTP responses and times out after
30 seconds. Both resolution failures and email failures retry with exponential delays
starting at 30 seconds and capped at one hour, stopping after ten attempts.

Delivery is at least once: a crash or timeout after Brevo accepts an email but before
its successful delivery is recorded can cause a duplicate. Queue uniqueness prevents
normal repeated-submission alerts; it cannot guarantee exactly-once external email delivery.

## Deployment

1. Apply migration `1791000000000-add_instant_lead_notifications` using the usual migration command.
2. Deploy the backend and public frontend together so the final form submits the new flag.
3. Configure `OFS_PORTAL_INSTANT_NOTIFICATIONS=enabled`, `OFS_PORTAL_URL`,
   `OFS_PORTAL_LEAD_NOTIFICATION_TEMPLATE_ID` and `BREVO_API_KEY`.
4. Restart the backend. Instant processing runs independently of `CRON_TASKS`.
5. Opt in from portal account settings. Existing preferences are not changed.

The migration starts with empty event and delivery tables. Existing contacts are not
backfilled or emailed. An existing simulation can create its first event if its final
form is explicitly submitted again after deployment. Reverting the migration removes
events, deliveries and instant preferences, while retaining daily and weekly preferences.

## Historical imports

Historical Landbot simulations (`isFromLandbot=true`) produce processed baseline events,
without entering the pending queue. The historical seed explicitly passes
`suppressLeadNotifications: true` to its saves. Other application backfills should do likewise:

```ts
await simulationRepository.save(simulation, {
  suppressLeadNotifications: true,
});
await locationRepository.save(location, { suppressLeadNotifications: true });
```

Suppression records an event once the historical lead is complete, preventing later
submission from replaying it. Direct SQL imports do not queue notifications. To baseline
complete imported contacts, call `LeadNotificationEnqueuer.enqueue` with
`suppressLeadNotifications: true` and the import transaction's entity manager.

## Failed work

Failures log event/delivery IDs and attempt counts, without household data. Inspect
terminal failures in both stages:

```sql
SELECT id, "simulationId", attempts, "lastError"
FROM portal_lead_notification_event WHERE status = 'failed';

SELECT id, "eventId", "ofsId", "userId", attempts, "lastError"
FROM portal_lead_notification_delivery WHERE status = 'failed';
```

After fixing the cause, an operator can requeue a selected failed event or delivery:

```sql
UPDATE portal_lead_notification_event
SET status = 'pending', attempts = 0, "nextAttemptAt" = now(),
    "lockedUntil" = NULL, "claimToken" = NULL
WHERE id = '<event UUID>' AND status = 'failed';

UPDATE portal_lead_notification_delivery
SET status = 'pending', attempts = 0, "nextAttemptAt" = now(),
    "lockedUntil" = NULL, "claimToken" = NULL
WHERE id = '<delivery UUID>' AND status = 'failed';
```

## Verification

PostgreSQL integration tests use real TypeORM repositories in an isolated schema.
They verify the final-submission boundary, rejection of incomplete leads, one event
for multiple matching OFS, worker fan-out, rollback, suppression, consent/access changes,
concurrent claims, expired leases, failure recovery, post-commit visibility, startup
recovery and migration apply/revert. No real emails are sent.

```sh
LEAD_NOTIFICATION_TEST_DATABASE_URL=postgres://user:password@localhost:5433/boris-test \
  npm run test -w apps/backend -- --runInBand --runTestsByPath \
  test/infrastructure/ofs/notifications/instant-lead-notifications.integration-spec.ts
```

The integration suite skips when this dedicated test URL is absent. Worker, submission
validation, use-case forwarding and mailer checks also run in the normal unit suite.

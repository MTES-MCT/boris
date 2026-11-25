# Event contracts and instrumentation

Representative stable event names below define the registry families. Payloads use explicit metadata and change-field allowlists; `event_type` is text in SQL to allow additive application releases.

| Events | Safe payload / placement |
| --- | --- |
| `auth.login_succeeded`, `auth.login_failed`, `auth.rate_limited` | Authentication method, factor/stage and internal reason code; final session establishment in `TwoFactorService`, failures at owning controller/guard |
| `auth.recovery_code_used`, `auth.logout`, `auth.sessions_revoked` | User target, revocation scope/reason; never credential material |
| `account.created`, `.activation_changed`, `.role_changed`, `.membership_changed`, `.email_changed`, `.profile_changed` | Exact relevant old/new role, organization IDs or allowed account fields; user use cases and OFS member service |
| `account.password_reset_requested`, `.password_reset_completed`, `.password_changed` | User target when known, delivery request outcome; no password, hash or reset URL; do not alter enumeration-safe external responses |
| `account.two_factor_enabled`, `.two_factor_disabled`, `.two_factor_reset` | Method, existing support reason/reference for reset when available; `TwoFactorService` and provisioning script |
| `invitation.created`, `.resent`, `.cancelled`, `.accepted` | Invitation ID, role, scope and effect; member/distributor invitation services. Expiry is currently time-derived: record observation once if needed, not a fictional scheduled expiry action |
| `organization.link_changed`, `commercial_transmission.created`, `.scope_changed`, `.activation_changed` | Old/new links, active flag and normalized scope; portal transmission service extracted from controller |
| `programme.created`, `.updated`, `.deleted`, `ofs.updated`, `commercialisateur.updated` | Explicit safe field differences; shared use cases so admin and portal paths are covered once |
| `contact_followup.updated`, `notification_preference.updated` | Old/new enum/status/preference values and applicable scope |
| `contacts.released` | Operation, count and resource manifest of records actually selected for the response; exclude contact/financial contents |
| `contacts.export_requested`, `.export_released`, `.export_failed` | Format, safe date/geographic filters, count, manifest and internal failure code; never free-text contact/email search terms or file contents |
| `security.access_denied`, `security.request_rejected` | Route template, action and safe reason (including tenant boundary rejection); never raw token-bearing URLs |
| `notification.delivery_attempted`, `.delivery_accepted`, `.delivery_failed` | Job/operator identity, affected resource IDs and provider-safe outcome; queue insertion does not mean delivery |

One save may produce several semantic permission-change events with a shared operation ID. Emit no successful change event for a no-op, but still record security-relevant denied attempts. Do not duplicate business events between controller and use case. A recovery code can be consumed before session establishment fails: its use event belongs to its consumption transaction, independently of final login success.

For `contacts.released` and exports, build the manifest from the same selected rows used to serialize the response, including locations nested inside grouped simulations. Do not run a second filter query to reconstruct it. No personal-data response bytes are sent until the audit event and all manifest rows commit. Empty authorized results record count zero. Response release is not proof of human reading or completed download.

Concrete existing entry points: `portal-auth.controller.ts`, `guards/local.guard.ts`, `two-factor.service.ts`, `session/user-session.service.ts`, `auth/provision-two-factor.ts`, `application/user/usecases/*`, `invitation/ofs-members.service.ts`, `distributor-invitation/distributor-invitation.service.ts`, `ofs/controllers/api/portal-ofss.controller.ts`, `brs-diffusion-website/controllers/api/portal-programs.controller.ts`, the matching admin controllers/use cases, and notification worker/store. Register new entities in runtime `typeorm.config.ts`; CLI discovery already loads compiled entity files.
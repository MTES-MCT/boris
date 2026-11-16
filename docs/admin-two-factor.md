# Admin two-factor authentication

Admins must complete email/password login followed by an authenticator code or
single-use recovery code on both the administration and the OFS portal. Admins
without a provisioned secret cannot log in. Existing password-only admin sessions
lose access when this feature is deployed. Unenrolled OFS and commercialisateur
accounts continue to use their existing password login.

## Deployment and initial provisioning

1. Generate a dedicated encryption key:

   ```sh
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Configure `TWO_FACTOR_ENCRYPTION_KEY` on the backend and wherever provisioning
   runs. Keep this key in deployment secrets, separate from database backups.
   Preserve a secure backup of the key: replacing or losing it makes existing
   authenticator secrets unreadable. Do not reuse `SESSION_SECRET`.
3. Build the backend and apply migrations using the project's normal deployment
   process (`npm run build --workspace=@boris/backend`, then
   `npm run migration:migrate --workspace=@boris/backend`).
4. Provision each existing admin from the repository root, against the intended
   database with the same encryption key as the backend:

   ```sh
   npm run two-factor:provision --workspace=@boris/backend -- admin@example.fr
   ```

   The command prints the Base32 setup key, an `otpauth://` URI, and ten recovery
   codes. Transfer these privately to that admin. In Google Authenticator or an
   equivalent app, add a time-based account using the setup key. Store recovery
   codes separately from the authenticator. Codes are printed only during
   provisioning and cannot be retrieved afterward. Avoid captured/shared terminal
   logs. Provisioning invalidates existing sessions for that account.

5. Verify a login through both applications. Plan for admins to be blocked between
   deployment and provisioning; alternatively apply the migration and provision
   accounts before switching traffic to the new backend.

## Lost authenticator or compromised credentials

After verifying the admin's identity through your operational process, replace
their secret and all recovery codes:

```sh
npm run two-factor:provision --workspace=@boris/backend -- admin@example.fr --reset
```

The old authenticator, unused recovery codes, authenticated sessions and pending
logins are invalidated. Share the new credentials privately. A password reset
does not disable or bypass 2FA. Newly created/promoted admins also need provisioning.

## Security and future enrollment

- Authenticator secrets use AES-256-GCM, with a fresh nonce and the user ID as
  authenticated data. Secret, recovery-hash and replay-counter columns are excluded
  from ordinary TypeORM reads. Recovery codes contain 128 random bits each and are
  stored only as SHA-256 hashes.
- TOTP uses SHA-1, six digits and 30-second periods, with one period of clock skew
  in either direction. Keep server clocks synchronized. Accepted steps cannot be
  reused or followed by an older step; recovery codes are consumed once. Both
  updates use a database row lock to prevent concurrent reuse.
- Password validation creates a pending session lasting five minutes, without
  granting access. Completing verification rotates the session and binds its proof
  to both the user and the current credential version. Login timestamps update
  only after complete authentication.
- Verification allows five attempts per account and twenty per IP per fifteen
  minutes. Successful verification clears those counters; starting another
  password login does not. Password login retains its existing limits.
- Enrollment UI, QR rendering, recovery-code regeneration UI, and OFS opt-in
  suggestions are deferred. The policy already requires 2FA for admins or enrolled
  accounts, so future OFS enrollment can reuse verification. Enrollment must show
  a QR code/manual key, verify a generated code before activation, and display
  recovery codes once. The CLI currently provisions only active admins.

The TOTP implementation is checked against the published SHA-1 test vectors in
[RFC 6238](https://www.rfc-editor.org/rfc/rfc6238.html#appendix-B).

The database regression suite requires an explicit `TWO_FACTOR_TEST_DATABASE_URL`.
It creates and removes its own schema and exercises migration reversal, concurrent
code consumption, session revocation, stale saves and the real provisioning CLI:

```sh
TWO_FACTOR_TEST_DATABASE_URL=postgres://user:password@localhost:5433/boris-test npm test --workspace=@boris/backend -- --runInBand --runTestsByPath test/infrastructure/auth/two-factor-persistence.integration-spec.ts
```

# Admin two-factor authentication

Admins must complete email/password login followed by an authenticator code or
single-use recovery code on both the administration and the OFS portal. Admins
without a provisioned secret complete enrollment in the OFS portal after their
password is verified; they cannot access portal data until an OTP is confirmed.
The administration login directs unconfigured admins to use the OFS portal. Existing password-only admin sessions
lose access when this feature is deployed. Unenrolled OFS and commercialisateur
accounts continue to use their existing password login.

## Temporary bypass and gradual rollout

To temporarily skip 2FA in both applications, set this variable on the backend and restart it:

```dotenv
TWO_FACTOR_DISABLED=true
```

This works in every environment, including production. Password authentication and
role checks still apply. The bypass is off by default. While enabled, admins do not
need a provisioned secret or an encryption key to log in.

For a gradual rollout, deploy with the bypass enabled, configure the encryption
key, and provision each admin. Once everyone is ready, set
`TWO_FACTOR_DISABLED=false` (or remove the variable) and restart the backend.
Password-only admin sessions then lose access and admins must complete a new login
with 2FA. While the bypass is enabled, users can enroll from Mon compte themselves.

## Enrollment in the OFS portal

All portal roles (admin, compte OFS and compte commercialisateur) can configure
2FA under **Mon compte → Double authentification**. Unenrolled admins are directed
to the same setup screen after password login on the portal. Other roles opt in.

1. Confirm the current password.
2. Scan the locally generated QR code with an authenticator or password manager,
   or copy the Base32 setup key and choose time-based codes (TOTP).
3. Enter a six-digit OTP to activate 2FA. The pending key expires after five
   minutes, is stored encrypted in the server session, and survives reloads.
   Cancelling does not activate 2FA.
4. Copy or download the ten recovery codes and confirm they have been saved.
   Codes are shown only in the successful activation response, never retrieved
   later. Reloading or leaving this screen discards the displayed codes.

Setup requires `TWO_FACTOR_ENCRYPTION_KEY` even while the temporary login bypass
is enabled. Activation rotates the current session, binds it to the credential
version and invalidates other password-only sessions once the bypass is disabled.
The first OTP is consumed during setup and cannot be reused for login. Setup cannot
replace an existing authenticator; lost access still requires the operational
reset below. OFS and commercialisateur accounts can disable 2FA under Mon compte
by confirming their current password and a fresh authenticator OTP. Disabling
atomically deletes the authenticator, recovery codes and all account sessions,
then requires a new password login. Admins cannot disable 2FA; the API enforces
this even while the global login bypass is enabled. Resetting a password also revokes pending enrollment logins.

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
4. Admins can enroll through the OFS portal. For operational CLI provisioning,
   run from the repository root against the intended database with the same
   encryption key as the backend:

   ```sh
   npm run two-factor:provision --workspace=@boris/backend -- admin@example.fr
   ```

   The command prints the Base32 setup key, an `otpauth://` URI, and ten recovery
   codes. Transfer these privately to that admin. In Google Authenticator or an
   equivalent app, add a time-based account using the setup key. Store recovery
   codes separately from the authenticator. Codes are printed only during
   provisioning and cannot be retrieved afterward. Avoid captured/shared terminal
   logs. Provisioning invalidates existing sessions for that account.

5. Verify a login through both applications after disabling the temporary bypass.
   Without the bypass, unconfigured admins must enroll through the OFS portal
   before accessing either application. The CLI remains available for operational
   provisioning and resets.

## Lost authenticator or compromised credentials

After verifying the admin's identity through your operational process, replace
their secret and all recovery codes:

```sh
npm run two-factor:provision --workspace=@boris/backend -- admin@example.fr --reset
```

The old authenticator, unused recovery codes, authenticated sessions and pending
logins are invalidated. Share the new credentials privately. A password reset
does not disable or bypass 2FA. Newly created/promoted admins can enroll through the OFS portal.

## Security

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
- Enrollment is available through the OFS portal for all three roles. Recovery-code
  regeneration remains deferred. Disabling is restricted to non-admin accounts. The CLI provisions
  active admins for operational recovery.

The TOTP implementation is checked against the published SHA-1 test vectors in
[RFC 6238](https://www.rfc-editor.org/rfc/rfc6238.html#appendix-B).

The database regression suite requires an explicit `TWO_FACTOR_TEST_DATABASE_URL`.
It creates and removes its own schema and exercises migration reversal, concurrent
code consumption, session revocation, stale saves and the real provisioning CLI:

```sh
TWO_FACTOR_TEST_DATABASE_URL=postgres://user:password@localhost:5433/boris-test npm test --workspace=@boris/backend -- --runInBand --runTestsByPath test/infrastructure/auth/two-factor-persistence.integration-spec.ts
```

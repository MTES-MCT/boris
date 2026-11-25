import { recordAudit } from '../audit/audit.service';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { typeormConfig } from '../persistence/typeorm.config';
import { UserEntity } from '../user/user.entity';
import { UserRole } from 'src/domain/user/user-role.enum';
import { normalizeEmail } from 'src/application/user/utils/normalize-email';
import {
  encryptTotpSecret,
  generateRecoveryCodes,
  generateTotpSecret,
  hashRecoveryCode,
} from './two-factor-crypto';

async function run() {
  const [email, flag, ...extra] = process.argv.slice(2);
  if (!email || (flag && flag !== '--reset') || extra.length) {
    throw new Error(
      'Usage: npm run two-factor:provision --workspace=@boris/backend -- admin@example.fr [--reset]',
    );
  }
  const secret = generateTotpSecret();
  const recoveryCodes = generateRecoveryCodes();
  const dataSource = new DataSource(typeormConfig);
  await dataSource.initialize();
  try {
    const user = await dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(UserEntity);
      const user = await repository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: normalizeEmail(email) })
        .setLock('pessimistic_write')
        .getOne();
      if (!user?.isActive || !user.roles.includes(UserRole.ADMIN)) {
        throw new Error('An active admin account with this email is required');
      }
      if (user.twoFactorVersion && flag !== '--reset') {
        throw new Error(
          '2FA is already configured. Use --reset to replace the secret and recovery codes',
        );
      }
      await manager.query(
        `UPDATE "user" SET
        "twoFactorVersion" = $2, "twoFactorSecret" = $3,
        "twoFactorRecoveryCodes" = $4::jsonb, "twoFactorLastUsedStep" = NULL,
        "updatedAt" = NOW() WHERE id = $1`,
        [
          user.id,
          randomUUID(),
          encryptTotpSecret(secret, user.id),
          JSON.stringify(recoveryCodes.map(hashRecoveryCode)),
        ],
      );
      await manager.query(
        `DELETE FROM "session"
        WHERE json::jsonb #>> '{passport,user}' = $1
           OR json::jsonb #>> '{pendingTwoFactor,userId}' = $1
           OR json::jsonb #>> '{pendingTwoFactorEnrollmentLogin,userId}' = $1`,
        [user.id],
      );
      await recordAudit(manager, {
        type:
          flag === '--reset'
            ? 'account.two_factor_reset'
            : 'account.two_factor_enabled',
        targetType: 'account',
        targetId: user.id,
        actor: {
          kind: 'operator',
          ref: process.env.USER || 'two-factor:provision',
        },
      });
      return user;
    });

    const label = encodeURIComponent(`BoRiS:${user.email}`);
    const uri = `otpauth://totp/${label}?secret=${secret}&issuer=BoRiS&algorithm=SHA1&digits=6&period=30`;
    console.log(
      `2FA configured for ${user.email}. Previous sessions and recovery codes are invalidated.`,
    );
    console.log(`Setup key: ${secret}\nAuthenticator URI: ${uri}`);
    console.log(
      `Recovery codes (save securely; shown only now):\n${recoveryCodes.join('\n')}`,
    );
  } finally {
    await dataSource.destroy();
  }
}

void run().catch((error: unknown) => {
  // Never log query errors: their parameters can include credentials.
  console.error(
    error instanceof Error && !('query' in error)
      ? error.message
      : '2FA provisioning failed',
  );
  process.exitCode = 1;
});

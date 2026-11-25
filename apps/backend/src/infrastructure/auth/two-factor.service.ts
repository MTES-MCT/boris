import { AuditService, recordAudit } from '../audit/audit.service';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { randomUUID } from 'crypto';
import { UserRole } from 'src/domain/user/user-role.enum';
import { DataSource } from 'typeorm';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { UserEntity } from '../user/user.entity';
import { regenerateSession } from '../session/regenerate-session';
import { AuthRateLimitService } from './auth-rate-limit.service';
import {
  decryptTotpSecret,
  encryptTotpSecret,
  generateTotpSecret,
  generateRecoveryCodes,
  hashRecoveryCode,
  matchingTotpStep,
} from './two-factor-crypto';
import { hasCompletedTwoFactor, requiresTwoFactor } from './two-factor-session';

@Injectable()
export class TwoFactorService {
  private readonly logger = new Logger(TwoFactorService.name);
  constructor(
    private readonly dataSource: DataSource,
    private readonly rateLimit: AuthRateLimitService,
    @Inject('UserRepositoryInterface')
    private readonly users: UserRepositoryInterface,
  ) {}

  public async start(
    req: Request,
    user: UserEntity,
    allowEnrollment = false,
  ): Promise<boolean> {
    delete req.session.pendingTwoFactor;
    delete req.session.pendingTwoFactorEnrollmentLogin;
    delete req.session.twoFactorEnrollment;
    delete req.session.twoFactorVerified;
    await regenerateSession(req);

    if (requiresTwoFactor(user)) {
      if (!user.twoFactorVersion) {
        if (!allowEnrollment)
          throw new ForbiddenException('TWO_FACTOR_NOT_CONFIGURED');
        req.session.pendingTwoFactorEnrollmentLogin = {
          userId: user.id,
          expiresAt: Date.now() + 5 * 60_000,
        };
        await this.save(req);
        return true;
      }
      req.session.pendingTwoFactor = {
        userId: user.id,
        version: user.twoFactorVersion,
        expiresAt: Date.now() + 5 * 60_000,
      };
      await this.save(req);
      return true;
    }

    await this.completeLogin(req, user);
    return false;
  }

  // A password-verified admin may enroll, but cannot access any portal data yet.
  public async enrollmentUser(req: Request): Promise<UserEntity> {
    const pending = req.session.pendingTwoFactorEnrollmentLogin;
    const id = hasCompletedTwoFactor(req)
      ? (req.user as UserEntity).id
      : pending && pending.expiresAt > Date.now()
        ? pending.userId
        : undefined;
    const user = id ? await this.users.findById(id) : null;
    if (
      !user?.isActive ||
      !user.roles.some((role) =>
        [UserRole.ADMIN, UserRole.OFS, UserRole.DISTRIBUTOR].includes(role),
      ) ||
      (!hasCompletedTwoFactor(req) && user.twoFactorVersion)
    ) {
      throw new UnauthorizedException('TWO_FACTOR_EXPIRED');
    }
    return user;
  }

  public async enrollmentStatus(req: Request) {
    const user = await this.enrollmentUser(req);
    const pending = req.session.twoFactorEnrollment;
    const secret =
      !user.twoFactorVersion &&
      pending?.userId === user.id &&
      pending.expiresAt > Date.now()
        ? decryptTotpSecret(pending.secret, user.id)
        : null;
    return {
      enabled: !!user.twoFactorVersion,
      canDisable:
        !!user.twoFactorVersion && !user.roles.includes(UserRole.ADMIN),
      email: user.email,
      secret,
      uri: secret
        ? `otpauth://totp/${encodeURIComponent(`BoRiS:${user.email}`)}?secret=${secret}&issuer=BoRiS&algorithm=SHA1&digits=6&period=30`
        : null,
    };
  }

  public async beginEnrollment(req: Request) {
    const user = await this.enrollmentUser(req);
    if (user.twoFactorVersion)
      throw new BadRequestException('TWO_FACTOR_ALREADY_ENABLED');
    // Keep the same pending key on retries/reloads, and never store it in plaintext.
    const current = req.session.twoFactorEnrollment;
    if (
      !current ||
      current.userId !== user.id ||
      current.expiresAt <= Date.now()
    ) {
      req.session.twoFactorEnrollment = {
        userId: user.id,
        secret: encryptTotpSecret(generateTotpSecret(), user.id),
        expiresAt: Date.now() + 5 * 60_000,
      };
      await this.save(req);
    }
    return this.enrollmentStatus(req);
  }

  public async confirmEnrollment(req: Request, code: string) {
    const user = await this.enrollmentUser(req);
    await this.rateLimit.consume(`two-factor:user:${user.id}`, 5, 15 * 60_000);
    await this.rateLimit.consume(
      `two-factor:ip:${req.ip || 'unknown'}`,
      20,
      15 * 60_000,
    );
    const pending = req.session.twoFactorEnrollment;
    if (
      !pending ||
      pending.userId !== user.id ||
      pending.expiresAt <= Date.now()
    ) {
      throw new BadRequestException('TWO_FACTOR_ENROLLMENT_EXPIRED');
    }
    const step = matchingTotpStep(
      decryptTotpSecret(pending.secret, user.id),
      code.trim(),
    );
    if (step === null) throw new BadRequestException('TWO_FACTOR_INVALID');
    const recoveryCodes = generateRecoveryCodes();
    const version = randomUUID();
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(UserEntity);
      const current = await repository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: user.id })
        .setLock('pessimistic_write')
        .getOne();
      if (!current?.isActive || current.twoFactorVersion) {
        throw new BadRequestException('TWO_FACTOR_ALREADY_ENABLED');
      }
      await repository.update(user.id, {
        twoFactorSecret: pending.secret,
        twoFactorRecoveryCodes: recoveryCodes.map(hashRecoveryCode),
        twoFactorLastUsedStep: `${step}`,
      });
      // update:false prevents stale general saves from restoring an old version.
      await manager.query(
        'UPDATE "user" SET "twoFactorVersion" = $2 WHERE id = $1',
        [user.id, version],
      );
      await recordAudit(manager, {
        type: 'account.two_factor_enabled',
        targetType: 'account',
        targetId: user.id,
        actor: { kind: 'user', id: user.id, roles: user.roles },
      });
    });
    // Binding the session to the new version invalidates other password-only sessions.
    delete req.session.twoFactorEnrollment;
    delete req.session.pendingTwoFactorEnrollmentLogin;
    await this.completeLogin(req, user, version);
    await this.rateLimit.clear(`two-factor:user:${user.id}`);
    return { recoveryCodes };
  }

  public async cancelEnrollment(req: Request) {
    await this.enrollmentUser(req);
    delete req.session.twoFactorEnrollment;
    await this.save(req);
  }

  public async disable(req: Request, user: UserEntity, code: string) {
    if (user.roles.includes(UserRole.ADMIN)) {
      throw new ForbiddenException('TWO_FACTOR_REQUIRED_FOR_ADMIN');
    }
    await this.rateLimit.consume(`two-factor:user:${user.id}`, 5, 15 * 60_000);
    await this.rateLimit.consume(
      `two-factor:ip:${req.ip || 'unknown'}`,
      20,
      15 * 60_000,
    );
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(UserEntity);
      const current = await repository
        .createQueryBuilder('user')
        .addSelect(['user.twoFactorSecret', 'user.twoFactorLastUsedStep'])
        .where('user.id = :id', { id: user.id })
        .setLock('pessimistic_write')
        .getOne();
      // Recheck role and credential version under the lock, including during bypass.
      if (current?.roles.includes(UserRole.ADMIN)) {
        throw new ForbiddenException('TWO_FACTOR_REQUIRED_FOR_ADMIN');
      }
      if (
        !current?.isActive ||
        !current.twoFactorSecret ||
        !current.twoFactorVersion ||
        current.twoFactorVersion !== user.twoFactorVersion ||
        current.password !== user.password
      ) {
        throw new BadRequestException('TWO_FACTOR_INVALID');
      }
      const step = matchingTotpStep(
        decryptTotpSecret(current.twoFactorSecret, user.id),
        code.trim(),
      );
      if (
        step === null ||
        (current.twoFactorLastUsedStep !== null &&
          step <= Number(current.twoFactorLastUsedStep))
      ) {
        throw new BadRequestException('TWO_FACTOR_INVALID');
      }
      await repository.update(user.id, {
        twoFactorSecret: null,
        twoFactorRecoveryCodes: [],
        twoFactorLastUsedStep: null,
      });
      await manager.query(
        'UPDATE "user" SET "twoFactorVersion" = NULL WHERE id = $1',
        [user.id],
      );
      // Removing the credential version would otherwise restore access to old sessions.
      await manager.query(
        `DELETE FROM "session"
        WHERE json::jsonb #>> '{passport,user}' = $1
           OR json::jsonb #>> '{pendingTwoFactor,userId}' = $1
           OR json::jsonb #>> '{pendingTwoFactorEnrollmentLogin,userId}' = $1`,
        [user.id],
      );
      await recordAudit(manager, {
        type: 'account.two_factor_disabled',
        targetType: 'account',
        targetId: user.id,
        actor: { kind: 'user', id: user.id, roles: user.roles },
      });
    });
  }

  public pending(req: Request): boolean {
    return (
      !!req.session.pendingTwoFactor &&
      req.session.pendingTwoFactor.expiresAt > Date.now()
    );
  }

  public async verify(req: Request, input: unknown): Promise<UserEntity> {
    const pending = req.session.pendingTwoFactor;
    if (!pending || !this.pending(req)) {
      delete req.session.pendingTwoFactor;
      throw new UnauthorizedException('TWO_FACTOR_EXPIRED');
    }

    await this.rateLimit.consume(
      `two-factor:ip:${req.ip || 'unknown'}`,
      20,
      15 * 60_000,
    );
    await this.rateLimit.consume(
      `two-factor:user:${pending.userId}`,
      5,
      15 * 60_000,
    );
    if (typeof input !== 'string' || input.length > 64) {
      throw new BadRequestException('TWO_FACTOR_INVALID');
    }
    const code = input.trim();

    // Lock the account so concurrent requests cannot reuse an OTP or recovery code.
    const verified = await this.dataSource.transaction(async (manager) => {
      const user = await manager
        .getRepository(UserEntity)
        .createQueryBuilder('user')
        .addSelect([
          'user.twoFactorSecret',
          'user.twoFactorRecoveryCodes',
          'user.twoFactorLastUsedStep',
        ])
        .where('user.id = :id', { id: pending.userId })
        .setLock('pessimistic_write')
        .getOne();

      if (
        !user?.isActive ||
        !user.twoFactorSecret ||
        user.twoFactorVersion !== pending.version
      )
        return false;

      const step = matchingTotpStep(
        decryptTotpSecret(user.twoFactorSecret, user.id),
        code,
      );
      if (
        step !== null &&
        (user.twoFactorLastUsedStep === null ||
          step > Number(user.twoFactorLastUsedStep))
      ) {
        await manager
          .getRepository(UserEntity)
          .update(user.id, { twoFactorLastUsedStep: `${step}` });
        return true;
      }

      if (/^[a-fA-F0-9]{8}(-?[a-fA-F0-9]{8}){3}$/.test(code)) {
        const hash = hashRecoveryCode(code);
        if (user.twoFactorRecoveryCodes.includes(hash)) {
          await manager.getRepository(UserEntity).update(user.id, {
            twoFactorRecoveryCodes: user.twoFactorRecoveryCodes.filter(
              (stored) => stored !== hash,
            ),
          });
          await recordAudit(manager, {
            type: 'auth.recovery_code_used',
            targetType: 'account',
            targetId: user.id,
            actor: { kind: 'user', id: user.id, roles: user.roles },
          });
          return true;
        }
      }
      return false;
    });

    if (!verified) throw new BadRequestException('TWO_FACTOR_INVALID');
    const user = await this.users.findById(pending.userId);
    if (!user?.isActive || user.twoFactorVersion !== pending.version) {
      throw new UnauthorizedException('TWO_FACTOR_EXPIRED');
    }
    await this.completeLogin(req, user, pending.version);
    await this.rateLimit.clear(`two-factor:user:${pending.userId}`);
    await this.rateLimit.clear(`two-factor:ip:${req.ip || 'unknown'}`);
    return user;
  }

  private async completeLogin(
    req: Request,
    user: UserEntity,
    version?: string,
  ) {
    try {
      delete req.session.pendingTwoFactor;
      delete req.session.twoFactorVerified;
      await regenerateSession(req);
      await new Promise<void>((resolve, reject) => {
        req.logIn(user, (error) =>
          error
            ? reject(
                error instanceof Error ? error : new Error('Failed to log in'),
              )
            : resolve(),
        );
      });
      req.session.previousLoginAt = user.lastLoginAt?.toISOString() || null;
      if (version) req.session.twoFactorVerified = { userId: user.id, version };
      await this.save(req);
      await this.dataSource.transaction(async (manager) => {
        await manager
          .getRepository(UserEntity)
          .update(user.id, { lastLoginAt: new Date() });
        await recordAudit(manager, {
          type: 'auth.login_succeeded',
          targetType: 'account',
          targetId: user.id,
          actor: { kind: 'user', id: user.id, roles: user.roles },
          metadata: {
            method: version ? 'password_and_second_factor' : 'password',
          },
        });
      });
    } catch (error) {
      // Never return a usable new session when its required login audit was not persisted.
      if (req.session) {
        // Clear serialized identity even when Passport's first save failed.
        delete (req.session as typeof req.session & { passport?: unknown })
          .passport;
        delete req.session.twoFactorVerified;
        await new Promise<void>((resolve) =>
          req.logout((cleanupError) => {
            if (cleanupError)
              this.logger.error(
                'Failed to clear Passport identity after login failure',
              );
            resolve();
          }),
        );
        if (req.session)
          await new Promise<void>((resolve) =>
            req.session.destroy((cleanupError) => {
              if (cleanupError)
                this.logger.error(
                  'Failed to destroy session after login failure',
                );
              resolve();
            }),
          );
      }
      delete req.user;
      req.res?.clearCookie(process.env.SESSION_COOKIE_NAME || 'boris.sid', {
        domain: process.env.SESSION_COOKIE_DOMAIN || undefined,
        path: '/',
      });
      throw error;
    }
  }

  public async recordFailure(status: number, req?: Request): Promise<void> {
    await new AuditService(this.dataSource).attempt({
      type: 'auth.login_failed',
      outcome: 'denied',
      reasonCode: `HTTP_${status}`,
      metadata: {
        stage: 'authentication',
        status,
        ...(req
          ? {
              method: req.method,
              ...(typeof req.route?.path === 'string'
                ? { route: req.route.path.slice(0, 200) }
                : {}),
            }
          : {}),
      },
    });
  }

  private async save(req: Request) {
    await new Promise<void>((resolve, reject) => {
      req.session.save((error) =>
        error
          ? reject(
              error instanceof Error
                ? error
                : new Error('Failed to save session'),
            )
          : resolve(),
      );
    });
  }
}

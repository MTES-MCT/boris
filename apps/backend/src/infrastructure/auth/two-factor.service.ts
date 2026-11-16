import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { UserEntity } from '../user/user.entity';
import { regenerateSession } from '../session/regenerate-session';
import { AuthRateLimitService } from './auth-rate-limit.service';
import {
  decryptTotpSecret,
  hashRecoveryCode,
  matchingTotpStep,
} from './two-factor-crypto';
import { requiresTwoFactor } from './two-factor-session';

@Injectable()
export class TwoFactorService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly rateLimit: AuthRateLimitService,
    @Inject('UserRepositoryInterface')
    private readonly users: UserRepositoryInterface,
  ) {}

  public async start(req: Request, user: UserEntity): Promise<boolean> {
    delete req.session.pendingTwoFactor;
    delete req.session.twoFactorVerified;
    await regenerateSession(req);

    if (requiresTwoFactor(user)) {
      if (!user.twoFactorVersion) {
        throw new ForbiddenException('TWO_FACTOR_NOT_CONFIGURED');
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
    await this.dataSource
      .getRepository(UserEntity)
      .update(user.id, { lastLoginAt: new Date() });
    await this.save(req);
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

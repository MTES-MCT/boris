import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'node:crypto';
import { Repository } from 'typeorm';
import { UserRole } from 'src/domain/user/user-role.enum';
import { UserEntity } from '../user/user.entity';
import { AuditService, recordAudit } from '../audit/audit.service';
import { UserApiKeyEntity } from './user-api-key.entity';

export function apiKeyMetadata(key: UserApiKeyEntity) {
  return {
    id: key.id,
    name: key.name,
    prefix: key.prefix,
    createdAt: key.createdAt,
    lastUsedAt: key.lastUsedAt,
  };
}

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(UserApiKeyEntity)
    private readonly keys: Repository<UserApiKeyEntity>,
    private readonly audit: AuditService,
  ) {}

  list(userId: string) {
    return this.keys
      .find({ where: { userId }, order: { createdAt: 'DESC' } })
      .then((keys) => keys.map(apiKeyMetadata));
  }

  async create(user: UserEntity, name: string) {
    const token = `boris_live_${randomBytes(32).toString('hex')}`;
    const key = await this.keys.manager.transaction(async (manager) => {
      const saved = await manager.save(
        UserApiKeyEntity,
        manager.create(UserApiKeyEntity, {
          userId: user.id,
          name: name.trim(),
          prefix: token.slice(0, 22),
          tokenHash: this.hash(token),
          lastUsedAt: null,
        }),
      );
      await recordAudit(manager, {
        type: 'api_key.created',
        targetType: 'api_key',
        targetId: saved.id,
      });
      return saved;
    });
    return { ...apiKeyMetadata(key), token };
  }

  async remove(userId: string, id: string) {
    const result = await this.keys.delete({ id, userId });
    if (!result.affected) throw new NotFoundException();
    await this.audit.attempt({
      type: 'api_key.deleted',
      targetType: 'api_key',
      targetId: id,
    });
  }

  async authenticate(token: string) {
    if (!/^boris_live_[a-f0-9]{64}$/.test(token))
      throw new UnauthorizedException();
    const key = await this.keys.findOne({
      where: { tokenHash: this.hash(token) },
      relations: ['user', 'user.ofss', 'user.distributor'],
    });
    if (
      !key ||
      !key.user.isActive ||
      !key.user.roles.some((role) =>
        [UserRole.ADMIN, UserRole.OFS, UserRole.DISTRIBUTOR].includes(role),
      )
    )
      throw new UnauthorizedException();
    return key;
  }

  async markUsed(id: string) {
    // Updating only the timestamp cannot recreate a key deleted concurrently.
    const result = await this.keys.update({ id }, { lastUsedAt: new Date() });
    if (!result.affected) throw new UnauthorizedException();
  }

  private hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}

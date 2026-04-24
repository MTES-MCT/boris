import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { UpdateManagedUserParams } from './update-managed-user.params';
import { normalizeEmail } from '../utils/normalize-email';
import { UserRole } from 'src/domain/user/user-role.enum';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { UserSessionService } from 'src/infrastructure/session/user-session.service';
import { In } from 'typeorm';

@Injectable()
export class UpdateManagedUserUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @InjectRepository(OfsEntity)
    private readonly ofsRepository: Repository<OfsEntity>,
    private readonly userSessionService: UserSessionService,
  ) {}

  public async execute(params: UpdateManagedUserParams): Promise<void> {
    const user = await this.userRepository.findById(params.userId);

    if (!user) {
      throw new NotFoundException();
    }

    const nextEmail = normalizeEmail(params.email);
    const nextRole = this.getRole(params.role);
    const ofsIds = this.normalizeIds(params.ofsIds);

    if (params.actorUserId === user.id && nextEmail !== user.email) {
      throw new ForbiddenException();
    }

    const existingUser = await this.userRepository.findOneByEmail(nextEmail);

    if (existingUser && existingUser.id !== user.id) {
      throw new ConflictException();
    }

    if (
      params.actorUserId === user.id &&
      user.roles.includes(UserRole.ADMIN) &&
      nextRole !== UserRole.ADMIN
    ) {
      throw new ForbiddenException();
    }

    if (
      user.isActive &&
      user.roles.includes(UserRole.ADMIN) &&
      nextRole !== UserRole.ADMIN
    ) {
      const activeAdminsCount = await this.userRepository.countActiveAdmins();

      if (activeAdminsCount <= 1) {
        throw new BadRequestException();
      }
    }

    const nextOfss = await this.resolveOfss(nextRole, ofsIds);
    const nextRoles = [nextRole];
    const hadSameEmail = user.email === nextEmail;
    const hadSameRole = user.roles.length === 1 && user.roles[0] === nextRole;
    const hadSameOfss = this.sameOfsIds(
      user.ofss.map((ofs) => ofs.id),
      nextOfss.map((ofs) => ofs.id),
    );

    user.email = nextEmail;
    user.roles = nextRoles;
    user.ofss = nextOfss;

    await this.userRepository.save(user);

    if (!hadSameEmail || !hadSameRole || !hadSameOfss) {
      await this.userSessionService.destroyAllForUserId(user.id);
    }
  }

  private getRole(role: string): UserRole {
    if (role === UserRole.ADMIN || role === UserRole.OFS) {
      return role;
    }

    throw new BadRequestException();
  }

  private normalizeIds(ids?: string[]): string[] {
    return Array.from(new Set((ids || []).filter(Boolean)));
  }

  private async resolveOfss(
    role: UserRole,
    ofsIds: string[],
  ): Promise<OfsEntity[]> {
    if (role !== UserRole.OFS) {
      return [];
    }

    if (ofsIds.length === 0) {
      throw new BadRequestException();
    }

    const ofss = await this.ofsRepository.findBy({ id: In(ofsIds) });

    if (ofss.length !== ofsIds.length) {
      throw new BadRequestException();
    }

    return ofss;
  }

  private sameOfsIds(left: string[], right: string[]): boolean {
    if (left.length !== right.length) {
      return false;
    }

    const leftSorted = [...left].sort();
    const rightSorted = [...right].sort();

    return leftSorted.every((id, index) => id === rightSorted[index]);
  }
}

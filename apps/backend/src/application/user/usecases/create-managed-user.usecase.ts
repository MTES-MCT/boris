import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordHasherInterface } from 'src/domain/user/password/password-hasher.interface';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { CreateManagedUserParams } from './create-managed-user.params';
import { normalizeEmail } from '../utils/normalize-email';
import { UserRole } from 'src/domain/user/user-role.enum';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { generateTemporaryPassword } from '../utils/generate-temporary-password';
import { In } from 'typeorm';

@Injectable()
export class CreateManagedUserUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('PasswordHasherInterface')
    private readonly passwordHasher: PasswordHasherInterface,
    @InjectRepository(OfsEntity)
    private readonly ofsRepository: Repository<OfsEntity>,
  ) {}

  public async execute(params: CreateManagedUserParams): Promise<{
    user: UserEntity;
    generatedPassword: string;
  }> {
    const email = normalizeEmail(params.email);
    const role = this.getRole(params.role);
    const ofsIds = this.normalizeIds(params.ofsIds);

    const existingUser = await this.userRepository.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException();
    }

    const ofss = await this.resolveOfss(role, ofsIds);
    const generatedPassword = generateTemporaryPassword();
    const hashedPassword = await this.passwordHasher.hash(generatedPassword);

    const user = await this.userRepository.save(
      new UserEntity(email, hashedPassword, [role], true, ofss),
    );

    return { user, generatedPassword };
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
}

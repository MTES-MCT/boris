import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { SetActiveStatusParams } from './set-active-status.params';
import { UserRole } from 'src/domain/user/user-role.enum';
import { UserSessionService } from 'src/infrastructure/session/user-session.service';

@Injectable()
export class SetUserActiveStatusUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private readonly userSessionService: UserSessionService,
  ) {}

  public async execute(params: SetActiveStatusParams): Promise<void> {
    const user = await this.userRepository.findById(params.userId);

    if (!user) {
      throw new NotFoundException();
    }

    if (user.isActive === params.isActive) {
      return;
    }

    if (!params.isActive) {
      if (params.actorUserId === user.id) {
        throw new ForbiddenException();
      }

      if (user.roles.includes(UserRole.ADMIN)) {
        const activeAdminsCount = await this.userRepository.countActiveAdmins();

        if (activeAdminsCount <= 1) {
          throw new BadRequestException();
        }
      }
    }

    if (
      params.isActive &&
      user.roles.includes(UserRole.OFS) &&
      user.ofss.length === 0
    ) {
      throw new BadRequestException();
    }

    user.isActive = params.isActive;

    await this.userRepository.save(user);
    await this.userSessionService.destroyAllForUserId(user.id);
  }
}

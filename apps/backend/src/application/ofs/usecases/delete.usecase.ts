import { OfsRepositoryInterface } from 'src/domain/ofs/ofs.repository.interface';
import { DeleteOfsParams } from './delete.params';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { OfsView } from '../views/ofs.view';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';

export class DeleteOfsUsecase {
  constructor(
    @Inject('OfsRepositoryInterface')
    private readonly ofsRepository: OfsRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async execute(params: DeleteOfsParams): Promise<OfsView> {
    const { id } = params;

    const ofs = await this.ofsRepository.findById(id);

    if (!ofs) {
      throw new NotFoundException();
    }

    const [, linkedUsersCount] = await this.userRepository.findAll(
      { page: 1, pageSize: 1 },
      { ofsId: id },
    );

    if (linkedUsersCount > 0) {
      throw new BadRequestException(
        `Impossible de supprimer cet OFS car ${linkedUsersCount} utilisateur(s) y sont rattaché(s).`,
      );
    }

    await this.ofsRepository.delete(id);

    return new OfsView(
      ofs.id,
      ofs.name,
      null,
      null,
      null,
      null,
      null,
      [],
      [],
      [],
    );
  }
}

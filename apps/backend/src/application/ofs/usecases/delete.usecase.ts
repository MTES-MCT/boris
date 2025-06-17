import { OfsRepositoryInterface } from 'src/domain/ofs/ofs.repository.interface';
import { DeleteOfsParams } from './delete.params';
import { Inject, NotFoundException } from '@nestjs/common';
import { OfsView } from '../views/ofs.view';

export class DeleteOfsUsecase {
  constructor(
    @Inject('OfsRepositoryInterface')
    private readonly ofsRepository: OfsRepositoryInterface,
  ) {}

  public async execute(params: DeleteOfsParams): Promise<OfsView> {
    const { id } = params;

    const ofs = await this.ofsRepository.findById(id);

    if (!ofs) {
      throw new NotFoundException();
    }

    await this.ofsRepository.delete(id);

    return new OfsView(ofs.id, ofs.name, null, null, null, [], [], []);
  }
}

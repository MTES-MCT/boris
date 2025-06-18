import { OfsRepositoryInterface } from 'src/domain/ofs/ofs.repository.interface';
import { FindOfsByIdParams } from './findById.params';
import { OfsView } from '../views/ofs.view';
import { Inject, NotFoundException } from '@nestjs/common';

export class FindOfsByIdUsecase {
  constructor(
    @Inject('OfsRepositoryInterface')
    private readonly ofsRepository: OfsRepositoryInterface,
  ) {}

  public async execute(params: FindOfsByIdParams): Promise<OfsView> {
    const { id } = params;

    const ofs = await this.ofsRepository.findById(id);

    if (!ofs) {
      throw new NotFoundException();
    }

    return new OfsView(
      ofs.id,
      ofs.name,
      ofs.websiteUrl,
      ofs.phone,
      ofs.email,
      ofs?.departements,
      ofs?.regions,
      ofs?.distributors,
    );
  }
}

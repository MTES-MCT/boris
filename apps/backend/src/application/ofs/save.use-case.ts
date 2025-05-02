import { Inject } from '@nestjs/common';
import { OfsRepositoryInterface } from 'src/domain/ofs/ofs.repository.interface';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';

export class SaveOfsUsecase {
  constructor(
    @Inject('OfsRepositoryInterface')
    private readonly ofsRepository: OfsRepositoryInterface,
  ) {}

  public async execute(ofs: OfsEntity): Promise<OfsEntity> {
    // TODO - Checker si le nomn de l'OFS existe déjà
    // TODO - Checker l'existence des départements
    // TODO - Checker l'existence des régions
    return await this.ofsRepository.save(ofs);
  }
}

import { ConflictException, Inject } from '@nestjs/common';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';

export class SaveDepartementUsecase {
  constructor(
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
  ) {}

  public async execute(
    departement: DepartementEntity,
  ): Promise<DepartementEntity> {
    let existingDepartement = await this.departementRepository.findOneByName(
      departement.name,
    );

    if (existingDepartement) {
      throw new ConflictException();
    }

    existingDepartement = await this.departementRepository.findOneByCode(
      departement.code,
    );

    if (existingDepartement) {
      throw new ConflictException();
    }

    return await this.departementRepository.save(departement);
  }
}

import { Inject } from '@nestjs/common';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';

export class FindManyDepartementsByNamesUsecase {
  constructor(
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
  ) {}

  public async execute(names: string[]): Promise<DepartementEntity[]> {
    return await this.departementRepository.findManyByNames(names);
  }
}

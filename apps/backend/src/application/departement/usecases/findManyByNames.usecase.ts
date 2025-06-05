import { Inject } from '@nestjs/common';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { DepartementView } from '../views/departement.view';

export class FindManyDepartementsByNamesUsecase {
  constructor(
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
  ) {}

  public async execute(names: string[]): Promise<DepartementView[]> {
    const departements =
      await this.departementRepository.findManyByNames(names);

    return departements.map((departement) => {
      return new DepartementView(
        departement.id,
        departement.name,
        departement.code,
      );
    });
  }
}

import { Inject } from '@nestjs/common';
import { Pagination } from 'src/application/pagination/pagination';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { DepartementView } from '../views/departement.view';
import { PaginationProps } from 'src/domain/pagination/paginationProps';

export class FindAllDepartementsUsecase {
  constructor(
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
  ) {}

  public async execute(
    paginationProps: PaginationProps,
  ): Promise<Pagination<DepartementView>> {
    const [departements, totalCount] =
      await this.departementRepository.findAll(paginationProps);

    const items = departements.map((departement) => {
      return new DepartementView(
        departement.id,
        departement.name,
        departement.code,
      );
    });

    return new Pagination(items, totalCount, paginationProps);
  }
}

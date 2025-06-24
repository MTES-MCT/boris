import { Inject } from '@nestjs/common';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { FindAllDistributorsParams } from './findAll.params';
import { DistributorView } from '../views/distributor.view';
import { Pagination } from 'src/application/common/pagination';

export class FindAllDistributorsUsecase {
  constructor(
    @Inject('DistributorRepositoryInterface')
    private readonly distributorRepository: DistributorRepositoryInterface,
  ) {}

  public async execute(
    params: FindAllDistributorsParams,
  ): Promise<Pagination<DistributorView>> {
    const { page, pageSize } = params;

    const [distributors, totalCount] = await this.distributorRepository.findAll(
      { page, pageSize },
    );

    const items = distributors.map((distributor) => {
      return new DistributorView(
        distributor.id,
        distributor.name,
        distributor.websiteUrl,
      );
    });

    return new Pagination(items, totalCount, { page, pageSize });
  }
}

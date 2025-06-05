import { Inject } from '@nestjs/common';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { FindManyDistributorsByIdsParams } from './findManyByIds.params';
import { DistributorView } from '../views/distributor.view';

export class FindManyDistributorsByIdsUsecase {
  constructor(
    @Inject('DistributorRepositoryInterface')
    private readonly distributorRepository: DistributorRepositoryInterface,
  ) {}

  public async execute(
    params: FindManyDistributorsByIdsParams,
  ): Promise<DistributorView[]> {
    const { ids } = params;

    const distributors = await this.distributorRepository.findManyByIds(ids);

    return distributors.map((distributor) => {
      return new DistributorView(
        distributor.id,
        distributor.name,
        distributor.websiteUrl,
      );
    });
  }
}

import { Inject } from '@nestjs/common';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

export class FindManyDistributorsByIdsUsecase {
  constructor(
    @Inject('DistributorRepositoryInterface')
    private readonly distributorRepository: DistributorRepositoryInterface,
  ) {}

  public async execute(ids: string[]): Promise<DistributorEntity[]> {
    return this.distributorRepository.findManyByIds(ids);
  }
}

import { Inject } from '@nestjs/common';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

export class FindAllDistributorsUsecase {
  constructor(
    @Inject('DistributorRepositoryInterface')
    private readonly distributorRepository: DistributorRepositoryInterface,
  ) {}

  public async execute(): Promise<DistributorEntity[]> {
    return this.distributorRepository.findAll();
  }
}

import { Inject } from '@nestjs/common';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

export class SaveDistributorUsecase {
  constructor(
    @Inject('DistributorRepositoryInterface')
    private readonly distributorRepository: DistributorRepositoryInterface,
  ) {}

  public async execute(
    distributor: DistributorEntity,
  ): Promise<DistributorEntity> {
    return await this.distributorRepository.save(distributor);
  }
}

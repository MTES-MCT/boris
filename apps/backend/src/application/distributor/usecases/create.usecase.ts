import { Inject } from '@nestjs/common';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { CreateDistributorParams } from './create.params';
import { DistributorView } from '../views/distributor.view';

export class CreateDistributorUsecase {
  constructor(
    @Inject('DistributorRepositoryInterface')
    private readonly distributorRepository: DistributorRepositoryInterface,
  ) {}

  public async execute(
    params: CreateDistributorParams,
  ): Promise<DistributorView> {
    const { name, websiteUrl } = params;

    const distributor = await this.distributorRepository.save(
      new DistributorEntity(name, websiteUrl || '', []),
    );

    return new DistributorView(
      distributor.id,
      distributor.name,
      distributor.websiteUrl,
    );
  }
}

import { Inject } from '@nestjs/common';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { SaveDistributorParams } from './save.params';
import { DistributorView } from '../views/distributor.view';

export class SaveDistributorUsecase {
  constructor(
    @Inject('DistributorRepositoryInterface')
    private readonly distributorRepository: DistributorRepositoryInterface,
  ) {}

  public async execute(
    params: SaveDistributorParams,
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

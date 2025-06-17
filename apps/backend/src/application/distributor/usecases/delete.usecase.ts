import { Inject, NotFoundException } from '@nestjs/common';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { DistributorView } from '../views/distributor.view';
import { DeleteDistributorParams } from './delete.params';

export class DeleteDistributorUsecase {
  constructor(
    @Inject('DistributorRepositoryInterface')
    private readonly distributorRepository: DistributorRepositoryInterface,
  ) {}

  public async execute(
    params: DeleteDistributorParams,
  ): Promise<DistributorView> {
    const { id } = params;

    const distributor = await this.distributorRepository.findById(id);

    if (!distributor) {
      throw new NotFoundException();
    }

    await this.distributorRepository.delete(id);

    return new DistributorView(
      distributor.id,
      distributor.name,
      distributor.websiteUrl,
    );
  }
}

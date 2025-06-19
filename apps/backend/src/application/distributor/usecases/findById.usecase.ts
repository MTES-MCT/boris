import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { FindDistributorByIdParams } from './findById.params';
import { DistributorView } from '../views/distributor.view';
import { Inject, NotFoundException } from '@nestjs/common';

export class FindDistributorByIdUsecase {
  constructor(
    @Inject('DistributorRepositoryInterface')
    private readonly distributorRepository: DistributorRepositoryInterface,
  ) {}

  public async execute(
    params: FindDistributorByIdParams,
  ): Promise<DistributorView> {
    const { id } = params;

    const distributor = await this.distributorRepository.findById(id);

    if (!distributor) {
      throw new NotFoundException();
    }

    return new DistributorView(
      distributor.id,
      distributor.name,
      distributor.websiteUrl,
    );
  }
}

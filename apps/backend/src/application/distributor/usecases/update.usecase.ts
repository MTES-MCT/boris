import { Inject, NotFoundException } from '@nestjs/common';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { UpdateDistributorParams } from './update.params';
import { DistributorView } from '../views/distributor.view';

export class UpdateDistributorUsecase {
  constructor(
    @Inject('DistributorRepositoryInterface')
    private readonly distributorRepository: DistributorRepositoryInterface,
  ) {}

  public async execute(
    params: UpdateDistributorParams,
  ): Promise<DistributorView> {
    const { id, name, websiteUrl } = params;

    const distributor = await this.distributorRepository.findById(id);

    if (!distributor) {
      throw new NotFoundException('Distributor not found');
    }

    distributor.name = name;
    distributor.websiteUrl = websiteUrl;

    const updatedDistributor =
      await this.distributorRepository.save(distributor);

    return new DistributorView(
      updatedDistributor.id,
      updatedDistributor.name,
      updatedDistributor.websiteUrl,
    );
  }
}

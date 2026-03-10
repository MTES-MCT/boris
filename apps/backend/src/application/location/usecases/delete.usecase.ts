import { Inject, NotFoundException } from '@nestjs/common';
import { LocationRepositoryInterface } from 'src/domain/location/location.repository.interface';
import { DeleteLocationParams } from './delete.params';

export class DeleteLocationUsecase {
  constructor(
    @Inject('LocationRepositoryInterface')
    private readonly locationRepository: LocationRepositoryInterface,
  ) {}

  public async execute(params: DeleteLocationParams): Promise<void> {
    const { id } = params;

    const location = await this.locationRepository.findById(id);

    if (!location) {
      throw new NotFoundException();
    }

    await this.locationRepository.delete(params.id);
  }
}

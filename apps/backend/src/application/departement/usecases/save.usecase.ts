import { ConflictException, Inject } from '@nestjs/common';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { SaveDepartementParams } from './save.params';
import { DepartementView } from '../views/departement.view';

export class SaveDepartementUsecase {
  constructor(
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
  ) {}

  public async execute(
    params: SaveDepartementParams,
  ): Promise<DepartementView> {
    const { name, code } = params;

    let existingDepartement =
      await this.departementRepository.findOneByName(name);

    if (existingDepartement) {
      throw new ConflictException();
    }

    existingDepartement = await this.departementRepository.findOneByCode(code);

    if (existingDepartement) {
      throw new ConflictException();
    }

    const departement = await this.departementRepository.save(params);

    return new DepartementView(
      departement.id,
      departement.name,
      departement.code,
    );
  }
}

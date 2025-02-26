import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';

export const finistere = new DepartementEntity('Finistère', 29);
export const paris = new DepartementEntity('Paris', 75);

export const mockDepartementRepository: DepartementRepositoryInterface = {
  save: jest.fn().mockResolvedValue(finistere),
};

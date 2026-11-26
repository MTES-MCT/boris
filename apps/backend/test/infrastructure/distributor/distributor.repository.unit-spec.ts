// Persistence helpers are exercised against PostgreSQL in audit.integration-spec.ts.
// These tests keep their existing repository/controller doubles at the boundary.
jest.mock('src/infrastructure/audit/audited-write', () => ({
  auditedSave: (
    repository: { save(value: unknown): unknown },
    value: unknown,
  ) => repository.save(value),
  auditedUpdate: (
    repository: { update(...args: unknown[]): unknown },
    ...args: unknown[]
  ) => repository.update(...args),
  auditedDelete: (
    repository: { delete(value: unknown): unknown },
    value: unknown,
  ) => repository.delete(value),
  auditDenied: async () => {},
  inAuditTransaction: (manager: unknown, work: (manager: unknown) => unknown) =>
    work(manager),
}));
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { DistributorRepository } from 'src/infrastructure/distributor/distributor.repository';
import {
  distributor1,
  mockDistributorRepository,
} from 'test/mocks/integration/distributor';

describe('DistributorRepository', () => {
  let distributorRepository: DistributorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistributorRepository,
        {
          provide: getRepositoryToken(DistributorEntity),
          useValue: mockDistributorRepository,
        },
      ],
    }).compile();

    distributorRepository = module.get<DistributorRepository>(
      DistributorRepository,
    );
  });

  it('should save a distributor and return its data', async () => {
    mockDistributorRepository.save.mockResolvedValue(distributor1);

    const result = await distributorRepository.save(distributor1);

    expect(result).toMatchObject(distributor1);
    expect(mockDistributorRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.save).toHaveBeenCalledWith(distributor1);
  });

  it('should find a distributor by id', async () => {
    mockDistributorRepository.findOne.mockResolvedValue(distributor1);

    const result = await distributorRepository.findById('1234');

    expect(result).toMatchObject(distributor1);
    expect(mockDistributorRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1234' },
      relations: ['ofss'],
    });
  });

  it('should delete a distributor', async () => {
    mockDistributorRepository.delete.mockResolvedValue({ affected: 1 });

    await distributorRepository.delete('1234');

    expect(mockDistributorRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.delete).toHaveBeenCalledWith('1234');
  });
});

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

  it('should save a departement and return its data', async () => {
    mockDistributorRepository.save.mockResolvedValue(distributor1);

    const result = await distributorRepository.save(distributor1);

    expect(result).toMatchObject(distributor1);
    expect(mockDistributorRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.save).toHaveBeenCalledWith(distributor1);
  });

  it('should find a distributor by id', async () => {
    mockDistributorRepository.findOneBy.mockResolvedValue(distributor1);

    const result = await distributorRepository.findById('1234');

    expect(result).toMatchObject(distributor1);
    expect(mockDistributorRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.findOneBy).toHaveBeenCalledWith({
      id: '1234',
    });
  });

  it('should delete a distributor', async () => {
    mockDistributorRepository.delete.mockResolvedValue({ affected: 1 });

    await distributorRepository.delete('1234');

    expect(mockDistributorRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.delete).toHaveBeenCalledWith('1234');
  });
});

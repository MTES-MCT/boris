import { Test, TestingModule } from '@nestjs/testing';
import { FindDistributorByIdUsecase } from 'src/application/distributor/usecases/findById.usecase';
import { NotFoundException } from '@nestjs/common';
import {
  distributor1,
  mockDistributorRepository,
} from 'test/mocks/integration/distributor';
import { DistributorView } from 'src/application/distributor/views/distributor.view';

describe('FindDistributorByIdUsecase', () => {
  let useCase: FindDistributorByIdUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindDistributorByIdUsecase,
        {
          provide: 'DistributorRepositoryInterface',
          useValue: mockDistributorRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindDistributorByIdUsecase>(
      FindDistributorByIdUsecase,
    );
  });

  it('should find an existing distributor by id', async () => {
    mockDistributorRepository.findById.mockResolvedValue(distributor1);

    const expectedResult = new DistributorView(
      distributor1.id,
      distributor1.name,
      distributor1.websiteUrl,
    );

    const result = await useCase.execute({ id: '1234' });

    expect(result).toEqual(expectedResult);
    expect(mockDistributorRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.findById).toHaveBeenCalledWith('1234');
  });

  it('should throw NotFoundException when distributor does not exist', async () => {
    mockDistributorRepository.findById.mockResolvedValue(null);

    try {
      await useCase.execute({ id: '1234' });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(mockDistributorRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockDistributorRepository.findById).toHaveBeenCalledWith('1234');
    }
  });
});

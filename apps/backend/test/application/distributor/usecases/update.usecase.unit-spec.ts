import { Test, TestingModule } from '@nestjs/testing';
import { UpdateDistributorUsecase } from 'src/application/distributor/usecases/update.usecase';
import { NotFoundException } from '@nestjs/common';
import {
  mockDistributorRepository,
  distributor1,
} from 'test/mocks/integration/distributor';
import { DistributorView } from 'src/application/distributor/views/distributor.view';

describe('UpdateDistributorUsecase', () => {
  let useCase: UpdateDistributorUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateDistributorUsecase,
        {
          provide: 'DistributorRepositoryInterface',
          useValue: mockDistributorRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateDistributorUsecase>(UpdateDistributorUsecase);
  });

  it('should update an existing distributor and return its data', async () => {
    const updatedDistributor = {
      id: '1234',
      name: 'Updated name',
      websiteUrl: 'https://updated-website.fr',
    };

    mockDistributorRepository.findById.mockResolvedValue(distributor1);
    mockDistributorRepository.save.mockResolvedValue(updatedDistributor);

    const expectedResult = new DistributorView(
      updatedDistributor.id,
      updatedDistributor.name,
      updatedDistributor.websiteUrl,
    );

    const result = await useCase.execute({
      id: updatedDistributor.id,
      name: updatedDistributor.name,
      websiteUrl: updatedDistributor.websiteUrl,
    });

    expect(result).toEqual(expectedResult);
    expect(mockDistributorRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.findById).toHaveBeenCalledWith(
      updatedDistributor.id,
    );
    expect(mockDistributorRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDistributorRepository.save).toHaveBeenCalledWith(distributor1);
  });

  it('should throw NotFoundException when distributor does not exist', async () => {
    mockDistributorRepository.findById.mockResolvedValue(null);

    try {
      await useCase.execute({
        id: '1234',
        name: 'Updated name',
        websiteUrl: 'https://updated-website.fr',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Distributor not found');
      expect(mockDistributorRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockDistributorRepository.findById).toHaveBeenCalledWith('1234');
      expect(mockDistributorRepository.save).not.toHaveBeenCalled();
    }
  });
});

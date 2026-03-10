import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteLocationUsecase } from 'src/application/location/usecases/delete.usecase';
import {
  mockedLocation,
  mockLocationRepository,
} from 'test/mocks/integration/location';

describe('DeleteLocationUsecase', () => {
  let useCase: DeleteLocationUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteLocationUsecase,
        {
          provide: 'LocationRepositoryInterface',
          useValue: mockLocationRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteLocationUsecase>(DeleteLocationUsecase);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should delete a location when it exists', async () => {
    mockLocationRepository.findById.mockResolvedValue(mockedLocation);
    mockLocationRepository.delete.mockResolvedValue(undefined);

    await useCase.execute({ id: mockedLocation.id });

    expect(mockLocationRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockLocationRepository.findById).toHaveBeenCalledWith(
      mockedLocation.id,
    );
    expect(mockLocationRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockLocationRepository.delete).toHaveBeenCalledWith(
      mockedLocation.id,
    );
  });

  it('should throw NotFoundException when location does not exist', async () => {
    mockLocationRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'non-existent-id' })).rejects.toThrow(
      NotFoundException,
    );

    expect(mockLocationRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockLocationRepository.findById).toHaveBeenCalledWith(
      'non-existent-id',
    );
    expect(mockLocationRepository.delete).not.toHaveBeenCalled();
  });
});

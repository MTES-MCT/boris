import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocationEntity } from 'src/infrastructure/location/location.entity';
import { LocationRepository } from 'src/infrastructure/location/location.repository';
import {
  mockedLocation,
  mockLocationRepository,
} from 'test/mocks/integration/location';

describe('LocationRepository', () => {
  let locationRepository: LocationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationRepository,
        {
          provide: getRepositoryToken(LocationEntity),
          useValue: mockLocationRepository,
        },
      ],
    }).compile();

    locationRepository = module.get<LocationRepository>(LocationRepository);
  });

  it('should save a location and return its data', async () => {
    mockLocationRepository.save.mockResolvedValue(mockedLocation);

    const result = await locationRepository.save(mockedLocation);

    expect(result).toMatchObject(mockedLocation);
    expect(mockLocationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockLocationRepository.save).toHaveBeenCalledWith(mockedLocation);
  });

  it('should delete a location by id', async () => {
    mockLocationRepository.delete.mockResolvedValue(undefined);

    await locationRepository.delete(mockedLocation.id);

    expect(mockLocationRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockLocationRepository.delete).toHaveBeenCalledWith(
      mockedLocation.id,
    );
  });

  it('should find a location by id', async () => {
    mockLocationRepository.findOne.mockResolvedValue(mockedLocation);

    const result = await locationRepository.findById(mockedLocation.id);

    expect(result).toEqual(mockedLocation);
    expect(mockLocationRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockedLocation.id },
    });
  });

  it('should return null when findById finds no location', async () => {
    mockLocationRepository.findOne.mockResolvedValue(null);

    const result = await locationRepository.findById('non-existent-id');

    expect(result).toBeNull();
    expect(mockLocationRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'non-existent-id' },
    });
  });
});

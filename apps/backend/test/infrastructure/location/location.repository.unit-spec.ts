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
});

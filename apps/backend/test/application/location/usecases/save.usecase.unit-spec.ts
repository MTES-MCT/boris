import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SaveLocationUsecase } from 'src/application/location/usecases/save.usecase';
import { LocationView } from 'src/application/location/views/location.view';
import { DepartementView } from 'src/application/departement/views/departement.view';
import {
  mockedLocation,
  mockLocationRepository,
} from 'test/mocks/integration/location';
import {
  mockDepartementRepository,
  finistere,
} from 'test/mocks/integration/departement';
import {
  mockEligibilitySimulationRepository,
  mockedEligibilitySimulation,
} from 'test/mocks/integration/eligibility-simulation';

describe('SaveLocationUsecase', () => {
  let useCase: SaveLocationUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveLocationUsecase,
        {
          provide: 'LocationRepositoryInterface',
          useValue: mockLocationRepository,
        },
        {
          provide: 'DepartementRepositoryInterface',
          useValue: mockDepartementRepository,
        },
        {
          provide: 'EligibilitySimulationRepositoryInterface',
          useValue: mockEligibilitySimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<SaveLocationUsecase>(SaveLocationUsecase);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should save a location and return its data when eligibilitySimulationId is not provided', async () => {
    mockDepartementRepository.findOneByInseeCode.mockResolvedValue(finistere);
    mockLocationRepository.save.mockResolvedValue(mockedLocation);

    const params = {
      name: 'Brest',
      latitude: 48.3905,
      longitude: -4.486,
      city: 'Brest',
      citycode: '29019',
      label: 'Brest',
      municipality: 'Brest',
      postalCode: '29200',
    };

    const result = await useCase.execute(params);

    const expectedView = new LocationView(
      mockedLocation.id,
      mockedLocation.latitude,
      mockedLocation.longitude,
      mockedLocation.city,
      mockedLocation.citycode,
      mockedLocation.label,
      mockedLocation.municipality,
      mockedLocation.postalCode,
      new DepartementView(finistere.id, finistere.name, finistere.code),
    );
    expect(result).toEqual(expectedView);
    expect(mockDepartementRepository.findOneByInseeCode).toHaveBeenCalledTimes(
      1,
    );
    expect(mockDepartementRepository.findOneByInseeCode).toHaveBeenCalledWith(
      '29019',
    );
    expect(mockEligibilitySimulationRepository.findById).not.toHaveBeenCalled();
    expect(mockLocationRepository.save).toHaveBeenCalledTimes(1);
    const savedLocation = mockLocationRepository.save.mock.calls[0][0];
    expect(savedLocation.latitude).toBe(params.latitude);
    expect(savedLocation.longitude).toBe(params.longitude);
    expect(savedLocation.city).toBe(params.city);
    expect(savedLocation.citycode).toBe(params.citycode);
    expect(savedLocation.label).toBe(params.label);
    expect(savedLocation.municipality).toBe(params.municipality);
    expect(savedLocation.postalCode).toBe(params.postalCode);
    expect(savedLocation.departement).toEqual(finistere);
    expect(savedLocation.eligibilitySimulation).toBeUndefined();
  });

  it('should save a location with eligibilitySimulation when eligibilitySimulationId is provided', async () => {
    mockDepartementRepository.findOneByInseeCode.mockResolvedValue(finistere);
    mockEligibilitySimulationRepository.findById.mockResolvedValue(
      mockedEligibilitySimulation,
    );
    mockLocationRepository.save.mockResolvedValue(mockedLocation);

    const params = {
      name: 'Brest',
      latitude: 48.3905,
      longitude: -4.486,
      city: 'Brest',
      citycode: '29019',
      label: 'Brest',
      municipality: 'Brest',
      postalCode: '29200',
      eligibilitySimulationId: mockedEligibilitySimulation.id,
    };

    const result = await useCase.execute(params);

    const expectedView = new LocationView(
      mockedLocation.id,
      mockedLocation.latitude,
      mockedLocation.longitude,
      mockedLocation.city,
      mockedLocation.citycode,
      mockedLocation.label,
      mockedLocation.municipality,
      mockedLocation.postalCode,
      new DepartementView(finistere.id, finistere.name, finistere.code),
    );
    expect(result).toEqual(expectedView);
    expect(mockDepartementRepository.findOneByInseeCode).toHaveBeenCalledWith(
      '29019',
    );
    expect(mockEligibilitySimulationRepository.findById).toHaveBeenCalledTimes(
      1,
    );
    expect(mockEligibilitySimulationRepository.findById).toHaveBeenCalledWith(
      mockedEligibilitySimulation.id,
    );
    expect(mockLocationRepository.save).toHaveBeenCalledTimes(1);
    const savedLocation = mockLocationRepository.save.mock.calls[0][0];
    expect(savedLocation.eligibilitySimulation).toEqual(
      mockedEligibilitySimulation,
    );
  });

  it('should throw NotFoundException when departement is not found', async () => {
    mockDepartementRepository.findOneByInseeCode.mockResolvedValue(null);

    const params = {
      name: 'Brest',
      latitude: 48.3905,
      longitude: -4.486,
      city: 'Brest',
      citycode: '99999',
      label: 'Brest',
      municipality: 'Brest',
      postalCode: '29200',
    };

    await expect(useCase.execute(params)).rejects.toThrow(NotFoundException);
    expect(mockDepartementRepository.findOneByInseeCode).toHaveBeenCalledWith(
      '99999',
    );
    expect(mockLocationRepository.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when eligibilitySimulationId is provided but simulation not found', async () => {
    mockDepartementRepository.findOneByInseeCode.mockResolvedValue(finistere);
    mockEligibilitySimulationRepository.findById.mockResolvedValue(null);

    const params = {
      name: 'Brest',
      latitude: 48.3905,
      longitude: -4.486,
      city: 'Brest',
      citycode: '29019',
      label: 'Brest',
      municipality: 'Brest',
      postalCode: '29200',
      eligibilitySimulationId: 'non-existent-id',
    };

    await expect(useCase.execute(params)).rejects.toThrow(BadRequestException);
    expect(mockEligibilitySimulationRepository.findById).toHaveBeenCalledWith(
      'non-existent-id',
    );
    expect(mockLocationRepository.save).not.toHaveBeenCalled();
  });
});

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SaveLocationUsecase } from 'src/application/location/usecases/save.usecase';
import { UpdateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/update.usecase';
import { EligibilitySimulationView } from 'src/application/eligibility-simulation/views/eligibility-simulation.view';
import type {
  DeclarationType,
  HousingType,
  PropertySituation,
} from 'src/domain/eligibility-simulation/eligibility-simulation.interface';
import {
  mockedEligibilitySimulation,
  mockEligibilitySimulationRepository,
} from 'test/mocks/integration/eligibility-simulation';
import { mockedLocation } from 'test/mocks/integration/location';

const mockEligibilitySimulationRepositoryWithFindById = {
  ...mockEligibilitySimulationRepository,
  findById: jest.fn(),
};

const mockSaveLocationUsecase = {
  execute: jest.fn(),
};

describe('UpdateEligibilitySimulationUsecase', () => {
  let useCase: UpdateEligibilitySimulationUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateEligibilitySimulationUsecase,
        {
          provide: 'EligibilitySimulationRepositoryInterface',
          useValue: mockEligibilitySimulationRepositoryWithFindById,
        },
        {
          provide: SaveLocationUsecase,
          useValue: mockSaveLocationUsecase,
        },
      ],
    }).compile();

    useCase = module.get<UpdateEligibilitySimulationUsecase>(
      UpdateEligibilitySimulationUsecase,
    );
  });

  it('should update an existing eligibility simulation and return its data', async () => {
    const updatedData = {
      propertySituation: 'PROPRIETAIRE' as PropertySituation,
      taxableIncome: 40000,
      declarationType: 'SEUL_SOUHAIT_SEUL' as DeclarationType,
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com',
      housingType: 'T4' as HousingType,
      contribution: 15000,
      resources: 50000,
    };

    const updatedSimulation = {
      ...mockedEligibilitySimulation,
      ...updatedData,
    };

    mockEligibilitySimulationRepositoryWithFindById.findById.mockResolvedValue({
      ...mockedEligibilitySimulation,
    });
    mockEligibilitySimulationRepositoryWithFindById.save.mockResolvedValue(
      updatedSimulation,
    );

    const expectedResult = new EligibilitySimulationView({
      ...updatedSimulation,
      locations: [],
    });

    const result = await useCase.execute({
      id: mockedEligibilitySimulation.id,
      ...updatedData,
    });

    expect(result).toMatchObject(expectedResult);
    expect(
      mockEligibilitySimulationRepositoryWithFindById.findById,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockEligibilitySimulationRepositoryWithFindById.findById,
    ).toHaveBeenCalledWith(mockedEligibilitySimulation.id);
    expect(
      mockEligibilitySimulationRepositoryWithFindById.save,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockEligibilitySimulationRepositoryWithFindById.save,
    ).toHaveBeenCalledWith(updatedSimulation);
  });

  it('should update only provided fields and keep existing values for others', async () => {
    const updatedData = {
      taxableIncome: 38000,
      firstName: 'Pierre',
    };

    const updatedSimulation = {
      ...mockedEligibilitySimulation,
      ...updatedData,
    };

    mockEligibilitySimulationRepositoryWithFindById.findById.mockResolvedValue({
      ...mockedEligibilitySimulation,
    });
    mockEligibilitySimulationRepositoryWithFindById.save.mockResolvedValue(
      updatedSimulation,
    );

    const expectedResult = new EligibilitySimulationView({
      ...updatedSimulation,
      locations: [],
    });

    const result = await useCase.execute({
      id: mockedEligibilitySimulation.id,
      ...updatedData,
    });

    expect(result).toMatchObject(expectedResult);
    expect(
      mockEligibilitySimulationRepositoryWithFindById.findById,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockEligibilitySimulationRepositoryWithFindById.findById,
    ).toHaveBeenCalledWith(mockedEligibilitySimulation.id);
    expect(
      mockEligibilitySimulationRepositoryWithFindById.save,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockEligibilitySimulationRepositoryWithFindById.save,
    ).toHaveBeenCalledWith(updatedSimulation);
  });

  it('should update contact and employment fields', async () => {
    const updatedData = {
      email: 'nouveau@example.com',
      phone: '0698765432',
      employmentStatus: 'INDEPENDANT' as const,
      laposteEmployer: 'Oui',
      positionType: 'NON_CADRE' as const,
      positionContractType: 'CDD' as const,
    };

    const updatedSimulation = {
      ...mockedEligibilitySimulation,
      ...updatedData,
    };

    mockEligibilitySimulationRepositoryWithFindById.findById.mockResolvedValue({
      ...mockedEligibilitySimulation,
    });
    mockEligibilitySimulationRepositoryWithFindById.save.mockResolvedValue(
      updatedSimulation,
    );

    const expectedResult = new EligibilitySimulationView({
      ...updatedSimulation,
      locations: [],
    });

    const result = await useCase.execute({
      id: mockedEligibilitySimulation.id,
      ...updatedData,
    });

    expect(result).toMatchObject(expectedResult);
    expect(
      mockEligibilitySimulationRepositoryWithFindById.findById,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockEligibilitySimulationRepositoryWithFindById.save,
    ).toHaveBeenCalledTimes(1);
    const saveCallArg =
      mockEligibilitySimulationRepositoryWithFindById.save.mock.calls[0][0];
    expect(saveCallArg).toMatchObject(updatedData);
  });

  it('should update locations when provided and call SaveLocationUsecase for each', async () => {
    const locationParams = {
      name: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      city: 'Paris',
      citycode: '75101',
      label: 'Paris',
      municipality: 'Paris',
      postalCode: '75001',
    };

    const simulationWithLocations = {
      ...mockedEligibilitySimulation,
      locations: [{ ...mockedLocation, ...locationParams }],
    };

    mockEligibilitySimulationRepositoryWithFindById.findById
      .mockResolvedValueOnce({ ...mockedEligibilitySimulation })
      .mockResolvedValueOnce(simulationWithLocations);
    mockSaveLocationUsecase.execute.mockResolvedValue(undefined);
    mockEligibilitySimulationRepositoryWithFindById.save.mockResolvedValue(
      simulationWithLocations,
    );

    await useCase.execute({
      id: mockedEligibilitySimulation.id,
      locations: [locationParams],
    });

    expect(mockSaveLocationUsecase.execute).toHaveBeenCalledTimes(1);
    expect(mockSaveLocationUsecase.execute).toHaveBeenCalledWith({
      ...locationParams,
      eligibilitySimulationId: mockedEligibilitySimulation.id,
    });
    expect(
      mockEligibilitySimulationRepositoryWithFindById.findById,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockEligibilitySimulationRepositoryWithFindById.save,
    ).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when eligibility simulation does not exist', async () => {
    const updatedData = {
      propertySituation: 'PROPRIETAIRE' as PropertySituation,
      taxableIncome: 40000,
    };

    mockEligibilitySimulationRepositoryWithFindById.findById.mockResolvedValue(
      null,
    );

    await expect(
      useCase.execute({
        id: 'non-existent-id',
        ...updatedData,
      }),
    ).rejects.toThrow(NotFoundException);

    expect(
      mockEligibilitySimulationRepositoryWithFindById.findById,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockEligibilitySimulationRepositoryWithFindById.findById,
    ).toHaveBeenCalledWith('non-existent-id');
    expect(
      mockEligibilitySimulationRepositoryWithFindById.save,
    ).not.toHaveBeenCalled();
  });
});

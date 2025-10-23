import { Test, TestingModule } from '@nestjs/testing';
import { CreateAcquisitionSimulationUsecase } from 'src/application/acquisition-simulation/usecases/create.usecase';
import { AcquisitionSimulationView } from 'src/application/acquisition-simulation/views/acquisition-simulation.view';
import {
  mockedAcquisitionSimulation,
  mockAcquisitionSimulationRepository,
} from 'test/mocks/integration/acquisition-simulation';

describe('CreateAcquisitionSimulationUsecase', () => {
  let useCase: CreateAcquisitionSimulationUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAcquisitionSimulationUsecase,
        {
          provide: 'AcquisitionSimulationRepositoryInterface',
          useValue: mockAcquisitionSimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateAcquisitionSimulationUsecase>(
      CreateAcquisitionSimulationUsecase,
    );
  });

  it('should create a new acquisition simulation and return its data', async () => {
    mockAcquisitionSimulationRepository.save.mockResolvedValue(
      mockedAcquisitionSimulation,
    );

    const expectedResult = new AcquisitionSimulationView(
      mockedAcquisitionSimulation.id,
      mockedAcquisitionSimulation.housingPrice,
      mockedAcquisitionSimulation.brsZone,
      mockedAcquisitionSimulation.surface,
      mockedAcquisitionSimulation.housingType,
    );

    const result = await useCase.execute({
      housingPrice: 250000,
      brsZone: 'A',
      surface: 75,
      housingType: 'new',
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledWith({
      housingPrice: 250000,
      brsZone: 'A',
      surface: 75,
      housingType: 'new',
    });
  });

  it('should create an acquisition simulation with old housing type', async () => {
    const oldHousingSimulation = {
      ...mockedAcquisitionSimulation,
      housingType: 'old' as const,
    };

    mockAcquisitionSimulationRepository.save.mockResolvedValue(
      oldHousingSimulation,
    );

    const expectedResult = new AcquisitionSimulationView(
      oldHousingSimulation.id,
      oldHousingSimulation.housingPrice,
      oldHousingSimulation.brsZone,
      oldHousingSimulation.surface,
      oldHousingSimulation.housingType,
    );

    const result = await useCase.execute({
      housingPrice: 200000,
      brsZone: 'B1',
      surface: 60,
      housingType: 'old',
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledWith({
      housingPrice: 200000,
      brsZone: 'B1',
      surface: 60,
      housingType: 'old',
    });
  });

  it('should create an acquisition simulation with different BRS zones', async () => {
    const b2ZoneSimulation = {
      ...mockedAcquisitionSimulation,
      brsZone: 'B2' as const,
    };

    mockAcquisitionSimulationRepository.save.mockResolvedValue(
      b2ZoneSimulation,
    );

    const expectedResult = new AcquisitionSimulationView(
      b2ZoneSimulation.id,
      b2ZoneSimulation.housingPrice,
      b2ZoneSimulation.brsZone,
      b2ZoneSimulation.surface,
      b2ZoneSimulation.housingType,
    );

    const result = await useCase.execute({
      housingPrice: 300000,
      brsZone: 'B2',
      surface: 90,
      housingType: 'new',
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledWith({
      housingPrice: 300000,
      brsZone: 'B2',
      surface: 90,
      housingType: 'new',
    });
  });
});

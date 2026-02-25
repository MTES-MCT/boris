import { Test, TestingModule } from '@nestjs/testing';
import { CreateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/create.usecase';
import { EligibilitySimulationView } from 'src/application/eligibility-simulation/views/eligibility-simulation.view';
import {
  mockedEligibilitySimulation,
  mockEligibilitySimulationRepository,
} from 'test/mocks/integration/eligibility-simulation';

describe('CreateEligibilitySimulationUsecase', () => {
  let useCase: CreateEligibilitySimulationUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEligibilitySimulationUsecase,
        {
          provide: 'EligibilitySimulationRepositoryInterface',
          useValue: mockEligibilitySimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateEligibilitySimulationUsecase>(
      CreateEligibilitySimulationUsecase,
    );
  });

  it('should create a new eligibility simulation and return its data', async () => {
    mockEligibilitySimulationRepository.save.mockResolvedValue(
      mockedEligibilitySimulation,
    );

    const expectedResult = new EligibilitySimulationView(
      mockedEligibilitySimulation,
    );

    const result = await useCase.execute({
      householdSize: mockedEligibilitySimulation.householdSize,
      hasDisability: mockedEligibilitySimulation.hasDisability,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockEligibilitySimulationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEligibilitySimulationRepository.save).toHaveBeenCalledWith({
      householdSize: mockedEligibilitySimulation.householdSize,
      hasDisability: mockedEligibilitySimulation.hasDisability,
    });
  });

  it('should create an eligibility simulation with dependants and birthdays', async () => {
    mockEligibilitySimulationRepository.save.mockResolvedValue(
      mockedEligibilitySimulation,
    );

    const expectedResult = new EligibilitySimulationView(
      mockedEligibilitySimulation,
    );

    const result = await useCase.execute({
      householdSize: mockedEligibilitySimulation.householdSize,
      hasDisability: mockedEligibilitySimulation.hasDisability,
      dependantsAmount: mockedEligibilitySimulation.dependantsAmount,
      birthday: mockedEligibilitySimulation.birthday,
      coBuyerBirthday: mockedEligibilitySimulation.coBuyerBirthday,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockEligibilitySimulationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEligibilitySimulationRepository.save).toHaveBeenCalledWith({
      householdSize: mockedEligibilitySimulation.householdSize,
      hasDisability: mockedEligibilitySimulation.hasDisability,
      dependantsAmount: mockedEligibilitySimulation.dependantsAmount,
      birthday: mockedEligibilitySimulation.birthday,
      coBuyerBirthday: mockedEligibilitySimulation.coBuyerBirthday,
    });
  });
});

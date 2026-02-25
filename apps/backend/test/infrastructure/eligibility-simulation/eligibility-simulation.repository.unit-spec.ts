import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EligibilitySimulationEntity } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.entity';
import { EligibilitySimulationRepository } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.repository';
import {
  mockedEligibilitySimulation,
  mockEligibilitySimulationRepository,
} from 'test/mocks/integration/eligibility-simulation';

describe('EligibilitySimulationRepository', () => {
  let eligibilitySimulationRepository: EligibilitySimulationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EligibilitySimulationRepository,
        {
          provide: getRepositoryToken(EligibilitySimulationEntity),
          useValue: mockEligibilitySimulationRepository,
        },
      ],
    }).compile();

    eligibilitySimulationRepository =
      module.get<EligibilitySimulationRepository>(
        EligibilitySimulationRepository,
      );
  });

  it('should save an eligibility simulation and return its data', async () => {
    mockEligibilitySimulationRepository.save.mockResolvedValue(
      mockedEligibilitySimulation,
    );

    const result = await eligibilitySimulationRepository.save(
      mockedEligibilitySimulation,
    );

    expect(result).toMatchObject(mockedEligibilitySimulation);
    expect(mockEligibilitySimulationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEligibilitySimulationRepository.save).toHaveBeenCalledWith(
      mockedEligibilitySimulation,
    );
  });

  it('should find an eligibility simulation by id and return its data', async () => {
    mockEligibilitySimulationRepository.findOne.mockResolvedValue(
      mockedEligibilitySimulation,
    );

    const result = await eligibilitySimulationRepository.findById(
      'eligibility-sim-uuid',
    );

    expect(result).toMatchObject(mockedEligibilitySimulation);
    expect(mockEligibilitySimulationRepository.findOne).toHaveBeenCalledTimes(
      1,
    );
    expect(mockEligibilitySimulationRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'eligibility-sim-uuid' },
      relations: ['locations', 'locations.departement'],
    });
  });

  it('should not find an eligibility simulation by id and return null', async () => {
    mockEligibilitySimulationRepository.findOne.mockResolvedValue(null);

    const result = await eligibilitySimulationRepository.findById('unknown-id');

    expect(result).toBeNull();
    expect(mockEligibilitySimulationRepository.findOne).toHaveBeenCalledTimes(
      1,
    );
    expect(mockEligibilitySimulationRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'unknown-id' },
      relations: ['locations', 'locations.departement'],
    });
  });
});

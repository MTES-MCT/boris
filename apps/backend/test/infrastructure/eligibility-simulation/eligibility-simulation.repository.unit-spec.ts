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

  it('should group eligibility simulations by eligibility stats buckets', async () => {
    const queryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        { eligibility: 'A_AND_ABIS', count: '12' },
        { eligibility: 'B1', count: '8' },
      ]),
    };

    mockEligibilitySimulationRepository.createQueryBuilder.mockReturnValue(
      queryBuilder,
    );

    const result =
      await eligibilitySimulationRepository.groupByEligibilityStats();

    expect(result).toStrictEqual([
      {
        eligibility: 'B2_AND_C',
        count: '0',
      },
      {
        eligibility: 'B1',
        count: '8',
      },
      {
        eligibility: 'A_AND_ABIS',
        count: '12',
      },
      { eligibility: 'NONE', count: '0' },
    ]);
    expect(
      mockEligibilitySimulationRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('eligibility_simulation');
    expect(queryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });

  it('should calculate eligibility simulation conversion funnel', async () => {
    const queryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({
        totalSimulations: '100',
        totalHouseholdProvided: '80',
        totalEligible: '60',
        totalConnectionWish: '40',
        totalEmailProvided: '30',
        totalDesiredCityProvided: '20',
      }),
    };

    mockEligibilitySimulationRepository.createQueryBuilder.mockReturnValue(
      queryBuilder,
    );

    const result =
      await eligibilitySimulationRepository.calculateConversionFunnel();

    expect(result).toStrictEqual({
      totalSimulations: 100,
      totalHouseholdProvided: 80,
      totalEligible: 60,
      totalConnectionWish: 40,
      totalEmailProvided: 30,
      totalDesiredCityProvided: 20,
    });
    expect(
      mockEligibilitySimulationRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('eligibility_simulation');
    expect(queryBuilder.leftJoin).toHaveBeenCalledWith(
      'eligibility_simulation.locations',
      'location',
    );
    expect(queryBuilder.getRawOne).toHaveBeenCalledTimes(1);
  });
});

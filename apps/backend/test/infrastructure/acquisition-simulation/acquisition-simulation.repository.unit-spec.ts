import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AcquisitionSimulationEntity } from 'src/infrastructure/acquisition-simulation/acquisition-simulation.entity';
import { AcquisitionSimulationRepository } from 'src/infrastructure/acquisition-simulation/acquisition-simulation.repository';
import {
  mockedAcquisitionSimulation,
  mockAcquisitionSimulationRepository,
} from 'test/mocks/integration/acquisition-simulation';

describe('AcquisitionSimulationRepository', () => {
  let acquisitionSimulationRepository: AcquisitionSimulationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcquisitionSimulationRepository,
        {
          provide: getRepositoryToken(AcquisitionSimulationEntity),
          useValue: mockAcquisitionSimulationRepository,
        },
      ],
    }).compile();

    acquisitionSimulationRepository =
      module.get<AcquisitionSimulationRepository>(
        AcquisitionSimulationRepository,
      );
  });

  it('should save an acquisition simulation and return its data', async () => {
    mockAcquisitionSimulationRepository.save.mockResolvedValue(
      mockedAcquisitionSimulation,
    );

    const result = await acquisitionSimulationRepository.save(
      mockedAcquisitionSimulation,
    );

    expect(result).toMatchObject(mockedAcquisitionSimulation);
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledWith(
      mockedAcquisitionSimulation,
    );
  });

  it('should find an acquisition simulation by id and return its data', async () => {
    mockAcquisitionSimulationRepository.findOne.mockResolvedValue(
      mockedAcquisitionSimulation,
    );

    const result = await acquisitionSimulationRepository.findById('1234');

    expect(result).toMatchObject(mockedAcquisitionSimulation);
    expect(mockAcquisitionSimulationRepository.findOne).toHaveBeenCalledTimes(
      1,
    );
    expect(mockAcquisitionSimulationRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1234' },
    });
  });

  it('should not find an acquisition simulation by id and return null', async () => {
    mockAcquisitionSimulationRepository.findOne.mockResolvedValue(null);

    const result = await acquisitionSimulationRepository.findById('1234');

    expect(result).toBeNull();
    expect(mockAcquisitionSimulationRepository.findOne).toHaveBeenCalledTimes(
      1,
    );
    expect(mockAcquisitionSimulationRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1234' },
    });
  });

  it('should return the total acquisition simulations count', async () => {
    mockAcquisitionSimulationRepository.count.mockResolvedValue(7);

    const result = await acquisitionSimulationRepository.count();

    expect(result).toBe(7);
    expect(mockAcquisitionSimulationRepository.count).toHaveBeenCalledTimes(1);
    expect(mockAcquisitionSimulationRepository.count).toHaveBeenCalledWith();
  });

  it('should calculate and return the conversion funnel data', async () => {
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({
        totalHouseInformations: '105',
        totalOwnContribution: '100',
        totalBuyingFees: '84',
        totalLoanInformations: '54',
        totalBrsHousingFees: '32',
      }),
    };

    mockAcquisitionSimulationRepository.createQueryBuilder.mockReturnValue(
      mockQueryBuilder,
    );

    const result =
      await acquisitionSimulationRepository.calculateConversionFunnel();

    expect(result).toEqual({
      totalHouseInformations: 105,
      totalOwnContribution: 100,
      totalBuyingFees: 84,
      totalLoanInformations: 54,
      totalBrsHousingFees: 32,
    });
    expect(
      mockAcquisitionSimulationRepository.createQueryBuilder,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockAcquisitionSimulationRepository.createQueryBuilder,
    ).toHaveBeenCalledWith('acquisition_simulation');
    expect(mockQueryBuilder.select).toHaveBeenCalledTimes(1);
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledTimes(4);
    expect(mockQueryBuilder.getRawOne).toHaveBeenCalledTimes(1);
  });
});

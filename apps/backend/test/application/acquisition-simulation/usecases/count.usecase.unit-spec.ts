import { Test, TestingModule } from '@nestjs/testing';
import { CountAcquisitionSimulationsUsecase } from 'src/application/acquisition-simulation/usecases/count.usecase';
import { mockAcquisitionSimulationRepository } from 'test/mocks/integration/acquisition-simulation';

describe('CountAcquisitionSimulationsUsecase', () => {
  let useCase: CountAcquisitionSimulationsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountAcquisitionSimulationsUsecase,
        {
          provide: 'AcquisitionSimulationRepositoryInterface',
          useValue: mockAcquisitionSimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<CountAcquisitionSimulationsUsecase>(
      CountAcquisitionSimulationsUsecase,
    );
  });

  it('should return the total count of acquisition simulations', async () => {
    mockAcquisitionSimulationRepository.count.mockResolvedValue(42);

    const result = await useCase.execute();

    expect(result).toBe(42);
    expect(mockAcquisitionSimulationRepository.count).toHaveBeenCalledTimes(1);
    expect(mockAcquisitionSimulationRepository.count).toHaveBeenCalledWith();
  });

  it('should return zero when there are no acquisition simulations', async () => {
    mockAcquisitionSimulationRepository.count.mockResolvedValue(0);

    const result = await useCase.execute();

    expect(result).toBe(0);
    expect(mockAcquisitionSimulationRepository.count).toHaveBeenCalledTimes(1);
    expect(mockAcquisitionSimulationRepository.count).toHaveBeenCalledWith();
  });

  it('should return a large count when there are many acquisition simulations', async () => {
    mockAcquisitionSimulationRepository.count.mockResolvedValue(1000);

    const result = await useCase.execute();

    expect(result).toBe(1000);
    expect(mockAcquisitionSimulationRepository.count).toHaveBeenCalledTimes(1);
    expect(mockAcquisitionSimulationRepository.count).toHaveBeenCalledWith();
  });
});

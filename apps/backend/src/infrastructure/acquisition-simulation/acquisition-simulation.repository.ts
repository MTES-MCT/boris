import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcquisitionSimulationRepositoryInterface } from 'src/domain/acquisition-simulation/acquisition-simulation.repository.interface';
import { AcquisitionSimulationEntity } from './acquisition-simulation.entity';

@Injectable()
export class AcquisitionSimulationRepository
  implements AcquisitionSimulationRepositoryInterface
{
  constructor(
    @InjectRepository(AcquisitionSimulationEntity)
    private readonly repository: Repository<AcquisitionSimulationEntity>,
  ) {}

  public save(
    acquisitionSimulation: AcquisitionSimulationEntity,
  ): Promise<AcquisitionSimulationEntity> {
    return this.repository.save(acquisitionSimulation);
  }

  public async findById(
    id: string,
  ): Promise<AcquisitionSimulationEntity | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  public async count(): Promise<number> {
    return this.repository.count();
  }
}

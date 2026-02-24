import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EligibilitySimulationRepositoryInterface } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { EligibilitySimulationEntity } from './eligibility-simulation.entity';

@Injectable()
export class EligibilitySimulationRepository
  implements EligibilitySimulationRepositoryInterface
{
  constructor(
    @InjectRepository(EligibilitySimulationEntity)
    private readonly repository: Repository<EligibilitySimulationEntity>,
  ) {}

  public save(
    eligibilitySimulation: EligibilitySimulationEntity,
  ): Promise<EligibilitySimulationEntity> {
    return this.repository.save(eligibilitySimulation);
  }

  public async findById(
    id: string,
  ): Promise<EligibilitySimulationEntity | null> {
    return this.repository.findOne({
      where: { id },
    });
  }
}

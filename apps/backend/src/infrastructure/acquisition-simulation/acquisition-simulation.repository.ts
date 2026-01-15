import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AcquisitionSimulationRepositoryInterface,
  ConversionFunnelResult,
} from 'src/domain/acquisition-simulation/acquisition-simulation.repository.interface';
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

  public async calculateConversionFunnel(): Promise<ConversionFunnelResult> {
    const query = this.repository
      .createQueryBuilder('acquisition_simulation')
      .select(
        `COUNT(*) FILTER (WHERE "housingPrice" IS NOT NULL)`,
        'totalHouseInformations',
      )
      .addSelect(
        `COUNT(*) FILTER (
          WHERE "housingPrice" IS NOT NULL
          AND "ownContribution" IS NOT NULL
        )`,
        'totalOwnContribution',
      )
      .addSelect(
        `COUNT(*) FILTER (
          WHERE "housingPrice" IS NOT NULL
          AND "ownContribution" IS NOT NULL
          AND "notaryFees" IS NOT NULL
          AND "oneTimeExpenses" IS NOT NULL
        )`,
        'totalBuyingFees',
      )
      .addSelect(
        `COUNT(*) FILTER (
          WHERE "housingPrice" IS NOT NULL
          AND "ownContribution" IS NOT NULL
          AND "notaryFees" IS NOT NULL
          AND "oneTimeExpenses" IS NOT NULL
          AND "interestRate" IS NOT NULL
        )`,
        'totalLoanInformations',
      )
      .addSelect(
        `COUNT(*) FILTER (
          WHERE "housingPrice" IS NOT NULL
          AND "ownContribution" IS NOT NULL
          AND "notaryFees" IS NOT NULL
          AND "oneTimeExpenses" IS NOT NULL
          AND "interestRate" IS NOT NULL
          AND "condominiumFeesFrequency" IS NOT NULL
        )`,
        'totalBrsHousingFees',
      );

    const result = await query.getRawOne();

    return {
      totalHouseInformations: Number(result.totalHouseInformations),
      totalOwnContribution: Number(result.totalOwnContribution),
      totalBuyingFees: Number(result.totalBuyingFees),
      totalLoanInformations: Number(result.totalLoanInformations),
      totalBrsHousingFees: Number(result.totalBrsHousingFees),
    };
  }
}

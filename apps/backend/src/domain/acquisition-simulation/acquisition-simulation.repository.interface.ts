import { AcquisitionSimulationEntity } from 'src/infrastructure/acquisition-simulation/acquisition-simulation.entity';

export type ConversionFunnelResult = {
  totalHouseInformations: number;
  totalOwnContribution: number;
  totalBuyingFees: number;
  totalLoanInformations: number;
  totalBrsHousingFees: number;
};

export interface AcquisitionSimulationRepositoryInterface {
  save(
    acquisitionSimulation: AcquisitionSimulationEntity,
  ): Promise<AcquisitionSimulationEntity>;
  findById(id: string): Promise<AcquisitionSimulationEntity | null>;
  count(): Promise<number>;
  calculateConversionFunnel(): Promise<ConversionFunnelResult>;
}

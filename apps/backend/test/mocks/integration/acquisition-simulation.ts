import { AcquisitionSimulationEntity } from 'src/infrastructure/acquisition-simulation/acquisition-simulation.entity';
import {
  PtzType,
  CondominiumFeesFrequency,
} from 'src/domain/acquisition-simulation/acquisition-simulation.interface';

export const mockedAcquisitionSimulation = new AcquisitionSimulationEntity(
  250000,
  'A',
  75,
  'new',
);

// Set additional properties
mockedAcquisitionSimulation.ownContribution = 50000;
mockedAcquisitionSimulation.notaryFees = 8000;
mockedAcquisitionSimulation.oneTimeExpenses = 2000;
mockedAcquisitionSimulation.interestRate = 3.5;
mockedAcquisitionSimulation.loanDuration = 20;
mockedAcquisitionSimulation.inHousePeopleAmount = 2;
mockedAcquisitionSimulation.fiscalIncome = 45000;
mockedAcquisitionSimulation.ptzType = 'collectif' as PtzType;
mockedAcquisitionSimulation.brsFees = 1500;
mockedAcquisitionSimulation.yearlyPropertyTax = 1200;
mockedAcquisitionSimulation.yearlyHouseingInsurance = 300;
mockedAcquisitionSimulation.condominiumFeesFrequency =
  'monthly' as CondominiumFeesFrequency;
mockedAcquisitionSimulation.condominiumFees = 150;
mockedAcquisitionSimulation.monthlyExpenses = 2000;

export const mockAcquisitionSimulationRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
};

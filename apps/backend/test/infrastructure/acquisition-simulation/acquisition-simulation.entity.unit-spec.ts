import { mockedAcquisitionSimulation } from 'test/mocks/integration/acquisition-simulation';
import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';
import {
  HousingType,
  PtzType,
  CondominiumFeesFrequency,
} from 'src/domain/acquisition-simulation/acquisition-simulation.interface';

describe('AcquisitionSimulationEntity', () => {
  it('getters', () => {
    expect(mockedAcquisitionSimulation.housingPrice).toBe(250000);
    expect(mockedAcquisitionSimulation.brsZone).toBe('A');
    expect(mockedAcquisitionSimulation.surface).toBe(75);
    expect(mockedAcquisitionSimulation.housingType).toBe('new');
    expect(mockedAcquisitionSimulation.ownContribution).toBe(50000);
    expect(mockedAcquisitionSimulation.notaryFees).toBe(8000);
    expect(mockedAcquisitionSimulation.oneTimeExpenses).toBe(2000);
    expect(mockedAcquisitionSimulation.interestRate).toBe(3.5);
    expect(mockedAcquisitionSimulation.loanDuration).toBe(20);
    expect(mockedAcquisitionSimulation.inHousePeopleAmount).toBe(2);
    expect(mockedAcquisitionSimulation.fiscalIncome).toBe(45000);
    expect(mockedAcquisitionSimulation.ptzType).toBe('collectif');
    expect(mockedAcquisitionSimulation.brsFees).toBe(1500);
    expect(mockedAcquisitionSimulation.yearlyPropertyTax).toBe(1200);
    expect(mockedAcquisitionSimulation.yearlyHouseingInsurance).toBe(300);
    expect(mockedAcquisitionSimulation.condominiumFeesFrequency).toBe(
      'monthly',
    );
    expect(mockedAcquisitionSimulation.condominiumFees).toBe(150);
    expect(mockedAcquisitionSimulation.monthlyExpenses).toBe(2000);
  });

  it('setters', () => {
    mockedAcquisitionSimulation.housingPrice = 300000;
    mockedAcquisitionSimulation.brsZone = 'B1' as BrsZone;
    mockedAcquisitionSimulation.surface = 85;
    mockedAcquisitionSimulation.housingType = 'old' as HousingType;
    mockedAcquisitionSimulation.ownContribution = 60000;
    mockedAcquisitionSimulation.notaryFees = 9000;
    mockedAcquisitionSimulation.oneTimeExpenses = 2500;
    mockedAcquisitionSimulation.interestRate = 4.0;
    mockedAcquisitionSimulation.loanDuration = 25;
    mockedAcquisitionSimulation.inHousePeopleAmount = 3;
    mockedAcquisitionSimulation.fiscalIncome = 50000;
    mockedAcquisitionSimulation.ptzType = 'individuel' as PtzType;
    mockedAcquisitionSimulation.brsFees = 1800;
    mockedAcquisitionSimulation.yearlyPropertyTax = 1500;
    mockedAcquisitionSimulation.yearlyHouseingInsurance = 400;
    mockedAcquisitionSimulation.condominiumFeesFrequency =
      'yearly' as CondominiumFeesFrequency;
    mockedAcquisitionSimulation.condominiumFees = 200;
    mockedAcquisitionSimulation.monthlyExpenses = 2500;

    expect(mockedAcquisitionSimulation.housingPrice).toBe(300000);
    expect(mockedAcquisitionSimulation.brsZone).toBe('B1');
    expect(mockedAcquisitionSimulation.surface).toBe(85);
    expect(mockedAcquisitionSimulation.housingType).toBe('old');
    expect(mockedAcquisitionSimulation.ownContribution).toBe(60000);
    expect(mockedAcquisitionSimulation.notaryFees).toBe(9000);
    expect(mockedAcquisitionSimulation.oneTimeExpenses).toBe(2500);
    expect(mockedAcquisitionSimulation.interestRate).toBe(4.0);
    expect(mockedAcquisitionSimulation.loanDuration).toBe(25);
    expect(mockedAcquisitionSimulation.inHousePeopleAmount).toBe(3);
    expect(mockedAcquisitionSimulation.fiscalIncome).toBe(50000);
    expect(mockedAcquisitionSimulation.ptzType).toBe('individuel');
    expect(mockedAcquisitionSimulation.brsFees).toBe(1800);
    expect(mockedAcquisitionSimulation.yearlyPropertyTax).toBe(1500);
    expect(mockedAcquisitionSimulation.yearlyHouseingInsurance).toBe(400);
    expect(mockedAcquisitionSimulation.condominiumFeesFrequency).toBe('yearly');
    expect(mockedAcquisitionSimulation.condominiumFees).toBe(200);
    expect(mockedAcquisitionSimulation.monthlyExpenses).toBe(2500);
  });
});

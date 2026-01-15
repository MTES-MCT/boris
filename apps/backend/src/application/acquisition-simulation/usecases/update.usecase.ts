import { Inject, NotFoundException } from '@nestjs/common';
import { AcquisitionSimulationRepositoryInterface } from 'src/domain/acquisition-simulation/acquisition-simulation.repository.interface';
import { UpdateAcquisitionSimulationParams } from './update.params';
import { AcquisitionSimulationView } from '../views/acquisition-simulation.view';

export class UpdateAcquisitionSimulationUsecase {
  constructor(
    @Inject('AcquisitionSimulationRepositoryInterface')
    private readonly acquisitionSimulationRepository: AcquisitionSimulationRepositoryInterface,
  ) {}

  public async execute(
    params: UpdateAcquisitionSimulationParams,
  ): Promise<AcquisitionSimulationView> {
    const {
      id,
      housingPrice,
      brsZone,
      surface,
      housingType,
      ownContribution,
      notaryFees,
      oneTimeExpenses,
      interestRate,
      loanDuration,
      inHousePeopleAmount,
      fiscalIncome,
      ptzType,
      brsFees,
      yearlyPropertyTax,
      yearlyHouseingInsurance,
      condominiumFeesFrequency,
      condominiumFees,
      monthlyExpenses,
    } = params;

    const acquisitionSimulation =
      await this.acquisitionSimulationRepository.findById(id);

    if (!acquisitionSimulation) {
      throw new NotFoundException();
    }

    acquisitionSimulation.housingPrice =
      housingPrice || acquisitionSimulation.housingPrice;
    acquisitionSimulation.brsZone = brsZone || acquisitionSimulation.brsZone;
    acquisitionSimulation.surface = surface || acquisitionSimulation.surface;
    acquisitionSimulation.housingType =
      housingType || acquisitionSimulation.housingType;
    acquisitionSimulation.ownContribution =
      typeof ownContribution === 'number'
        ? ownContribution
        : acquisitionSimulation.ownContribution;
    acquisitionSimulation.notaryFees =
      notaryFees || acquisitionSimulation.notaryFees;
    acquisitionSimulation.oneTimeExpenses =
      typeof oneTimeExpenses === 'number'
        ? oneTimeExpenses
        : acquisitionSimulation.oneTimeExpenses;
    acquisitionSimulation.interestRate =
      interestRate || acquisitionSimulation.interestRate;
    acquisitionSimulation.loanDuration =
      loanDuration || acquisitionSimulation.loanDuration;
    acquisitionSimulation.inHousePeopleAmount =
      inHousePeopleAmount || acquisitionSimulation.inHousePeopleAmount;
    acquisitionSimulation.fiscalIncome =
      fiscalIncome || acquisitionSimulation.fiscalIncome;
    acquisitionSimulation.ptzType = ptzType || acquisitionSimulation.ptzType;
    acquisitionSimulation.brsFees = brsFees || acquisitionSimulation.brsFees;
    acquisitionSimulation.yearlyPropertyTax =
      yearlyPropertyTax || acquisitionSimulation.yearlyPropertyTax;
    acquisitionSimulation.yearlyHouseingInsurance =
      yearlyHouseingInsurance || acquisitionSimulation.yearlyHouseingInsurance;
    acquisitionSimulation.condominiumFeesFrequency =
      condominiumFeesFrequency ||
      acquisitionSimulation.condominiumFeesFrequency;
    acquisitionSimulation.condominiumFees =
      condominiumFees || acquisitionSimulation.condominiumFees;
    acquisitionSimulation.monthlyExpenses =
      monthlyExpenses || acquisitionSimulation.monthlyExpenses;

    const updatedAcquisitionSimulation =
      await this.acquisitionSimulationRepository.save(acquisitionSimulation);

    return new AcquisitionSimulationView(
      updatedAcquisitionSimulation.id,
      updatedAcquisitionSimulation.housingPrice,
      updatedAcquisitionSimulation.brsZone,
      updatedAcquisitionSimulation.surface,
      updatedAcquisitionSimulation.housingType,
      updatedAcquisitionSimulation.ownContribution,
      updatedAcquisitionSimulation.notaryFees,
      updatedAcquisitionSimulation.oneTimeExpenses,
      updatedAcquisitionSimulation.interestRate,
      updatedAcquisitionSimulation.loanDuration,
      updatedAcquisitionSimulation.inHousePeopleAmount,
      updatedAcquisitionSimulation.fiscalIncome,
      updatedAcquisitionSimulation.ptzType,
      updatedAcquisitionSimulation.brsFees,
      updatedAcquisitionSimulation.yearlyPropertyTax,
      updatedAcquisitionSimulation.yearlyHouseingInsurance,
      updatedAcquisitionSimulation.condominiumFeesFrequency,
      updatedAcquisitionSimulation.condominiumFees,
      updatedAcquisitionSimulation.monthlyExpenses,
      updatedAcquisitionSimulation.createdAt,
      updatedAcquisitionSimulation.updatedAt,
    );
  }
}

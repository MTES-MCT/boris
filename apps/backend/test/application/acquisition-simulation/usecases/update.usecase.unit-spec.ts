import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAcquisitionSimulationUsecase } from 'src/application/acquisition-simulation/usecases/update.usecase';
import { AcquisitionSimulationView } from 'src/application/acquisition-simulation/views/acquisition-simulation.view';
import {
  CondominiumFeesFrequency,
  HousingType,
  PtzType,
} from 'src/domain/acquisition-simulation/acquisition-simulation.interface';
import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';
import {
  mockedAcquisitionSimulation,
  mockAcquisitionSimulationRepository,
} from 'test/mocks/integration/acquisition-simulation';

describe('UpdateAcquisitionSimulationUsecase', () => {
  let useCase: UpdateAcquisitionSimulationUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateAcquisitionSimulationUsecase,
        {
          provide: 'AcquisitionSimulationRepositoryInterface',
          useValue: mockAcquisitionSimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateAcquisitionSimulationUsecase>(
      UpdateAcquisitionSimulationUsecase,
    );
  });

  it('should update an existing acquisition simulation and return its data', async () => {
    const updatedData = {
      housingPrice: 300000,
      brsZone: 'B1' as BrsZone,
      surface: 85,
      housingType: 'old' as HousingType,
      ownContribution: 60000,
      notaryFees: 9000,
      interestRate: 4.0,
      loanDuration: 25,
    };

    const updatedSimulation = {
      ...mockedAcquisitionSimulation,
      ...updatedData,
    };

    mockAcquisitionSimulationRepository.findById.mockResolvedValue(
      mockedAcquisitionSimulation,
    );
    mockAcquisitionSimulationRepository.save.mockResolvedValue(
      updatedSimulation,
    );

    const expectedResult = new AcquisitionSimulationView(
      updatedSimulation.id,
      updatedSimulation.housingPrice,
      updatedSimulation.brsZone,
      updatedSimulation.surface,
      updatedSimulation.housingType,
      updatedSimulation.ownContribution,
      updatedSimulation.notaryFees,
      updatedSimulation.oneTimeExpenses,
      updatedSimulation.interestRate,
      updatedSimulation.loanDuration,
      updatedSimulation.inHousePeopleAmount,
      updatedSimulation.fiscalIncome,
      updatedSimulation.ptzType,
      updatedSimulation.brsFees,
      updatedSimulation.yearlyPropertyTax,
      updatedSimulation.yearlyHouseingInsurance,
      updatedSimulation.condominiumFeesFrequency,
      updatedSimulation.condominiumFees,
      updatedSimulation.monthlyExpenses,
      updatedSimulation.createdAt,
      updatedSimulation.updatedAt,
    );

    const result = await useCase.execute({
      id: mockedAcquisitionSimulation.id,
      ...updatedData,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockAcquisitionSimulationRepository.findById).toHaveBeenCalledTimes(
      1,
    );
    expect(mockAcquisitionSimulationRepository.findById).toHaveBeenCalledWith(
      mockedAcquisitionSimulation.id,
    );
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledWith(
      updatedSimulation,
    );
  });

  it('should update only provided fields and keep existing values for others', async () => {
    const updatedData = {
      housingPrice: 350000,
      interestRate: 3.8,
    };

    const updatedSimulation = {
      ...mockedAcquisitionSimulation,
      ...updatedData,
    };

    mockAcquisitionSimulationRepository.findById.mockResolvedValue(
      mockedAcquisitionSimulation,
    );
    mockAcquisitionSimulationRepository.save.mockResolvedValue(
      updatedSimulation,
    );

    const expectedResult = new AcquisitionSimulationView(
      updatedSimulation.id,
      updatedSimulation.housingPrice,
      updatedSimulation.brsZone,
      updatedSimulation.surface,
      updatedSimulation.housingType,
      updatedSimulation.ownContribution,
      updatedSimulation.notaryFees,
      updatedSimulation.oneTimeExpenses,
      updatedSimulation.interestRate,
      updatedSimulation.loanDuration,
      updatedSimulation.inHousePeopleAmount,
      updatedSimulation.fiscalIncome,
      updatedSimulation.ptzType,
      updatedSimulation.brsFees,
      updatedSimulation.yearlyPropertyTax,
      updatedSimulation.yearlyHouseingInsurance,
      updatedSimulation.condominiumFeesFrequency,
      updatedSimulation.condominiumFees,
      updatedSimulation.monthlyExpenses,
      updatedSimulation.createdAt,
      updatedSimulation.updatedAt,
    );

    const result = await useCase.execute({
      id: mockedAcquisitionSimulation.id,
      ...updatedData,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockAcquisitionSimulationRepository.findById).toHaveBeenCalledTimes(
      1,
    );
    expect(mockAcquisitionSimulationRepository.findById).toHaveBeenCalledWith(
      mockedAcquisitionSimulation.id,
    );
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledWith(
      updatedSimulation,
    );
  });

  it('should update financial fields', async () => {
    const updatedData = {
      ownContribution: 70000,
      notaryFees: 10000,
      oneTimeExpenses: 3000,
      brsFees: 2000,
      yearlyPropertyTax: 1500,
      yearlyHouseingInsurance: 400,
      condominiumFees: 200,
      monthlyExpenses: 2500,
    };

    const updatedSimulation = {
      ...mockedAcquisitionSimulation,
      ...updatedData,
    };

    mockAcquisitionSimulationRepository.findById.mockResolvedValue(
      mockedAcquisitionSimulation,
    );
    mockAcquisitionSimulationRepository.save.mockResolvedValue(
      updatedSimulation,
    );

    const expectedResult = new AcquisitionSimulationView(
      updatedSimulation.id,
      updatedSimulation.housingPrice,
      updatedSimulation.brsZone,
      updatedSimulation.surface,
      updatedSimulation.housingType,
      updatedSimulation.ownContribution,
      updatedSimulation.notaryFees,
      updatedSimulation.oneTimeExpenses,
      updatedSimulation.interestRate,
      updatedSimulation.loanDuration,
      updatedSimulation.inHousePeopleAmount,
      updatedSimulation.fiscalIncome,
      updatedSimulation.ptzType,
      updatedSimulation.brsFees,
      updatedSimulation.yearlyPropertyTax,
      updatedSimulation.yearlyHouseingInsurance,
      updatedSimulation.condominiumFeesFrequency,
      updatedSimulation.condominiumFees,
      updatedSimulation.monthlyExpenses,
      updatedSimulation.createdAt,
      updatedSimulation.updatedAt,
    );

    const result = await useCase.execute({
      id: mockedAcquisitionSimulation.id,
      ...updatedData,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockAcquisitionSimulationRepository.findById).toHaveBeenCalledTimes(
      1,
    );
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledWith(
      updatedSimulation,
    );
  });

  it('should update loan and personal information fields', async () => {
    const updatedData = {
      loanDuration: 30,
      inHousePeopleAmount: 4,
      fiscalIncome: 60000,
      ptzType: 'individuel' as PtzType,
      condominiumFeesFrequency: 'yearly' as CondominiumFeesFrequency,
    };

    const updatedSimulation = {
      ...mockedAcquisitionSimulation,
      ...updatedData,
    };

    mockAcquisitionSimulationRepository.findById.mockResolvedValue(
      mockedAcquisitionSimulation,
    );
    mockAcquisitionSimulationRepository.save.mockResolvedValue(
      updatedSimulation,
    );

    const expectedResult = new AcquisitionSimulationView(
      updatedSimulation.id,
      updatedSimulation.housingPrice,
      updatedSimulation.brsZone,
      updatedSimulation.surface,
      updatedSimulation.housingType,
      updatedSimulation.ownContribution,
      updatedSimulation.notaryFees,
      updatedSimulation.oneTimeExpenses,
      updatedSimulation.interestRate,
      updatedSimulation.loanDuration,
      updatedSimulation.inHousePeopleAmount,
      updatedSimulation.fiscalIncome,
      updatedSimulation.ptzType,
      updatedSimulation.brsFees,
      updatedSimulation.yearlyPropertyTax,
      updatedSimulation.yearlyHouseingInsurance,
      updatedSimulation.condominiumFeesFrequency,
      updatedSimulation.condominiumFees,
      updatedSimulation.monthlyExpenses,
      updatedSimulation.createdAt,
      updatedSimulation.updatedAt,
    );

    const result = await useCase.execute({
      id: mockedAcquisitionSimulation.id,
      ...updatedData,
    });

    expect(result).toMatchObject(expectedResult);
    expect(mockAcquisitionSimulationRepository.findById).toHaveBeenCalledTimes(
      1,
    );
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledTimes(1);
    expect(mockAcquisitionSimulationRepository.save).toHaveBeenCalledWith(
      updatedSimulation,
    );
  });

  it('should throw NotFoundException when acquisition simulation does not exist', async () => {
    const updatedData = {
      housingPrice: 300000,
      brsZone: 'B1' as BrsZone,
      surface: 85,
      housingType: 'old' as HousingType,
      ownContribution: 60000,
      notaryFees: 9000,
      interestRate: 4.0,
      loanDuration: 25,
    };

    mockAcquisitionSimulationRepository.findById.mockResolvedValue(null);

    try {
      await useCase.execute({
        id: 'non-existent-id',
        ...updatedData,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(
        mockAcquisitionSimulationRepository.findById,
      ).toHaveBeenCalledTimes(1);
      expect(mockAcquisitionSimulationRepository.findById).toHaveBeenCalledWith(
        'non-existent-id',
      );
      expect(mockAcquisitionSimulationRepository.save).not.toHaveBeenCalled();
    }
  });
});

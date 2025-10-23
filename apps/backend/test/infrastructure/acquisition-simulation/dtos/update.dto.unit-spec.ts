import { validate } from 'class-validator';
import { UpdateAcquisitionSimulationDTO } from 'src/infrastructure/acquisition-simulation/dtos/update.dto';

describe('UpdateAcquisitionSimulationDTO', () => {
  it('should be valid with all fields', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.housingPrice = 250000;
    dto.brsZone = 'A';
    dto.surface = 75;
    dto.housingType = 'new';
    dto.ownContribution = 50000;
    dto.notaryFees = 8000;
    dto.oneTimeExpenses = 2000;
    dto.interestRate = 3.5;
    dto.loanDuration = 20;
    dto.inHousePeopleAmount = 2;
    dto.fiscalIncome = 45000;
    dto.ptzType = 'collectif';
    dto.brsFees = 1500;
    dto.yearlyPropertyTax = 1200;
    dto.yearlyHouseingInsurance = 300;
    dto.condominiumFeesFrequency = 'monthly';
    dto.condominiumFees = 150;
    dto.monthlyExpenses = 2000;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with no fields (all optional)', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with only some fields', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.housingPrice = 300000;
    dto.brsZone = 'B1';
    dto.interestRate = 4.0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when housingPrice is zero', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.housingPrice = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('housingPrice');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when surface is zero', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.surface = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('surface');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when housingPrice is not a number', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    // @ts-expect-error: testing non-number value
    dto.housingPrice = 'not a number';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('housingPrice');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when surface is not a number', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    // @ts-expect-error: testing non-number value
    dto.surface = 'not a number';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('surface');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when brsZone is not in allowed values', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    // @ts-expect-error: testing invalid enum value
    dto.brsZone = 'INVALID_ZONE';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('brsZone');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should be invalid when housingType is not in allowed values', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    // @ts-expect-error: testing invalid enum value
    dto.housingType = 'INVALID_TYPE';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('housingType');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should be invalid when ptzType is not in allowed values', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    // @ts-expect-error: testing invalid enum value
    dto.ptzType = 'INVALID_PTZ_TYPE';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('ptzType');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should be invalid when condominiumFeesFrequency is not in allowed values', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    // @ts-expect-error: testing invalid enum value
    dto.condominiumFeesFrequency = 'INVALID_FREQUENCY';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('condominiumFeesFrequency');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should be valid with all allowed brsZone values', async () => {
    const allowedBrsZones = ['A', 'Abis', 'B1', 'B2', 'C'];

    for (const brsZone of allowedBrsZones) {
      const dto = new UpdateAcquisitionSimulationDTO();
      dto.brsZone = brsZone as any;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should be valid with all allowed housingType values', async () => {
    const allowedHousingTypes = ['new', 'old'];

    for (const housingType of allowedHousingTypes) {
      const dto = new UpdateAcquisitionSimulationDTO();
      dto.housingType = housingType as any;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should be valid with all allowed ptzType values', async () => {
    const allowedPtzTypes = ['collectif', 'individuel'];

    for (const ptzType of allowedPtzTypes) {
      const dto = new UpdateAcquisitionSimulationDTO();
      dto.ptzType = ptzType as any;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should be valid with all allowed condominiumFeesFrequency values', async () => {
    const allowedFrequencies = ['yearly', 'monthly', 'trimestrial'];

    for (const frequency of allowedFrequencies) {
      const dto = new UpdateAcquisitionSimulationDTO();
      dto.condominiumFeesFrequency = frequency as any;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should be invalid when housingPrice is negative', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.housingPrice = -1000;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('housingPrice');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when surface is negative', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.surface = -10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('surface');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when financial fields are negative', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.ownContribution = -50000;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('ownContribution');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should be invalid when loan fields are negative', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.interestRate = -3.5;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('interestRate');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when personal fields are negative', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.inHousePeopleAmount = -2;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('inHousePeopleAmount');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when multiple fields have invalid values', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.housingPrice = -1000;
    dto.surface = -10;
    // @ts-expect-error: testing invalid enum value
    dto.brsZone = 'INVALID_ZONE';

    const errors = await validate(dto);
    expect(errors).toHaveLength(3);
    expect(errors.some((error) => error.property === 'housingPrice')).toBe(
      true,
    );
    expect(errors.some((error) => error.property === 'surface')).toBe(true);
    expect(errors.some((error) => error.property === 'brsZone')).toBe(true);
  });

  it('should be valid with mixed valid and undefined fields', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.housingPrice = 250000;
    dto.brsZone = 'A';
    // surface, housingType, etc. are undefined (optional)

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with only enum fields', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.brsZone = 'B1';
    dto.housingType = 'old';
    dto.ptzType = 'individuel';
    dto.condominiumFeesFrequency = 'yearly';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with only numeric fields', async () => {
    const dto = new UpdateAcquisitionSimulationDTO();
    dto.housingPrice = 300000;
    dto.surface = 85;
    dto.ownContribution = 60000;
    dto.interestRate = 4.0;
    dto.loanDuration = 25;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

import { validate } from 'class-validator';
import { CreateAcquisitionSimulationDTO } from 'src/infrastructure/acquisition-simulation/dtos/create.dto';

describe('CreateAcquisitionSimulationDTO', () => {
  it('should be valid with all required fields', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.housingPrice = 250000;
    dto.brsZone = 'A';
    dto.surface = 75;
    dto.housingType = 'new';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when housingPrice is missing', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.brsZone = 'A';
    dto.surface = 75;
    dto.housingType = 'new';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('housingPrice');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid when brsZone is missing', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.housingPrice = 250000;
    dto.surface = 75;
    dto.housingType = 'new';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('brsZone');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid when surface is missing', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.housingPrice = 250000;
    dto.brsZone = 'A';
    dto.housingType = 'new';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('surface');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid when housingType is missing', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.housingPrice = 250000;
    dto.brsZone = 'A';
    dto.surface = 75;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('housingType');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid when housingPrice is not a number', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    // @ts-expect-error: testing non-number value
    dto.housingPrice = 'not a number';
    dto.brsZone = 'A';
    dto.surface = 75;
    dto.housingType = 'new';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('housingPrice');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when surface is not a number', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.housingPrice = 250000;
    dto.brsZone = 'A';
    // @ts-expect-error: testing non-number value
    dto.surface = 'not a number';
    dto.housingType = 'new';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('surface');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when brsZone is not in allowed values', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.housingPrice = 250000;
    // @ts-expect-error: testing invalid enum value
    dto.brsZone = 'INVALID_ZONE';
    dto.surface = 75;
    dto.housingType = 'new';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('brsZone');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should be invalid when housingType is not in allowed values', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.housingPrice = 250000;
    dto.brsZone = 'A';
    dto.surface = 75;
    // @ts-expect-error: testing invalid enum value
    dto.housingType = 'INVALID_TYPE';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('housingType');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should be valid with all allowed brsZone values', async () => {
    const allowedBrsZones = ['A', 'Abis', 'B1', 'B2', 'C'];

    for (const brsZone of allowedBrsZones) {
      const dto = new CreateAcquisitionSimulationDTO();
      dto.housingPrice = 250000;
      dto.brsZone = brsZone as any;
      dto.surface = 75;
      dto.housingType = 'new';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should be valid with all allowed housingType values', async () => {
    const allowedHousingTypes = ['new', 'old'];

    for (const housingType of allowedHousingTypes) {
      const dto = new CreateAcquisitionSimulationDTO();
      dto.housingPrice = 250000;
      dto.brsZone = 'A';
      dto.surface = 75;
      dto.housingType = housingType as any;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should be invalid when housingPrice is zero', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.housingPrice = 0;
    dto.brsZone = 'A';
    dto.surface = 75;
    dto.housingType = 'new';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('housingPrice');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when surface is zero', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.housingPrice = 250000;
    dto.brsZone = 'A';
    dto.surface = 0;
    dto.housingType = 'new';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('surface');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when housingPrice is negative', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.housingPrice = -1000;
    dto.brsZone = 'A';
    dto.surface = 75;
    dto.housingType = 'new';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('housingPrice');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when surface is negative', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.housingPrice = 250000;
    dto.brsZone = 'A';
    dto.surface = -10;
    dto.housingType = 'new';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('surface');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when multiple fields are missing', async () => {
    const dto = new CreateAcquisitionSimulationDTO();
    dto.housingPrice = 250000;
    // brsZone, surface, and housingType are missing

    const errors = await validate(dto);
    expect(errors).toHaveLength(3);
    expect(errors.some((error) => error.property === 'brsZone')).toBe(true);
    expect(errors.some((error) => error.property === 'surface')).toBe(true);
    expect(errors.some((error) => error.property === 'housingType')).toBe(true);
  });

  it('should be invalid when all fields are missing', async () => {
    const dto = new CreateAcquisitionSimulationDTO();

    const errors = await validate(dto);
    expect(errors).toHaveLength(4);
    expect(errors.some((error) => error.property === 'housingPrice')).toBe(
      true,
    );
    expect(errors.some((error) => error.property === 'brsZone')).toBe(true);
    expect(errors.some((error) => error.property === 'surface')).toBe(true);
    expect(errors.some((error) => error.property === 'housingType')).toBe(true);
  });
});

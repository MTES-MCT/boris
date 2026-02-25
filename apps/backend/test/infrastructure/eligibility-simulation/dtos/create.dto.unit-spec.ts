import { validate } from 'class-validator';
import { CreateEligibilitySimulationDTO } from 'src/infrastructure/eligibility-simulation/dtos/create.dto';

describe('CreateEligibilitySimulationDTO', () => {
  it('should be valid with all required fields', async () => {
    const dto = new CreateEligibilitySimulationDTO();
    dto.householdSize = 2;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with optional fields', async () => {
    const dto = new CreateEligibilitySimulationDTO();
    dto.householdSize = 2;
    dto.hasDisablity = true;
    dto.dependantsAmount = 1;
    dto.birthday = new Date('1990-05-15');
    dto.coBuyerBirthday = new Date('1988-03-20');

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when householdSize is missing', async () => {
    const dto = new CreateEligibilitySimulationDTO();
    dto.hasDisablity = false;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('householdSize');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid when householdSize is not a number', async () => {
    const dto = new CreateEligibilitySimulationDTO();
    // @ts-expect-error: testing non-number value
    dto.householdSize = 'not a number';
    dto.hasDisablity = false;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('householdSize');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when householdSize is zero', async () => {
    const dto = new CreateEligibilitySimulationDTO();
    dto.householdSize = 0;
    dto.hasDisablity = false;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('householdSize');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when householdSize is negative', async () => {
    const dto = new CreateEligibilitySimulationDTO();
    dto.householdSize = -1;
    dto.hasDisablity = false;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('householdSize');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when dependantsAmount is negative', async () => {
    const dto = new CreateEligibilitySimulationDTO();
    dto.householdSize = 2;
    dto.hasDisablity = false;
    dto.dependantsAmount = -1;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('dependantsAmount');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when dependantsAmount is not a number', async () => {
    const dto = new CreateEligibilitySimulationDTO();
    dto.householdSize = 2;
    dto.hasDisablity = false;
    // @ts-expect-error: testing non-number value
    dto.dependantsAmount = 'two';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('dependantsAmount');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when hasDisablity is not a boolean', async () => {
    const dto = new CreateEligibilitySimulationDTO();
    dto.householdSize = 2;
    // @ts-expect-error: testing non-boolean value
    dto.hasDisablity = 'true';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('hasDisablity');
    expect(errors[0].constraints).toHaveProperty('isBoolean');
  });

  it('should be invalid when birthday is not a Date', async () => {
    const dto = new CreateEligibilitySimulationDTO();
    dto.householdSize = 2;
    dto.hasDisablity = false;
    // @ts-expect-error: testing non-Date value
    dto.birthday = '1990-05-15';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('birthday');
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it('should be invalid when coBuyerBirthday is not a Date', async () => {
    const dto = new CreateEligibilitySimulationDTO();
    dto.householdSize = 2;
    dto.hasDisablity = false;
    // @ts-expect-error: testing non-Date value
    dto.coBuyerBirthday = '1988-03-20';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('coBuyerBirthday');
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it('should be valid when optional dates are undefined', async () => {
    const dto = new CreateEligibilitySimulationDTO();
    dto.householdSize = 1;
    dto.hasDisablity = true;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

import { validate } from 'class-validator';
import {
  GetLandbotCustomersByFieldDTO,
  LandbotCustomerGroupByField,
} from 'src/infrastructure/landbot-customer/dtos/getLandbotCustomersByField.dto';

describe('GetLandbotCustomersByFieldDTO', () => {
  it('should be valid with eligibility field', async () => {
    const dto = new GetLandbotCustomersByFieldDTO();
    dto.field = LandbotCustomerGroupByField.ELIGIBILITY;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with brsKnowledge field', async () => {
    const dto = new GetLandbotCustomersByFieldDTO();
    dto.field = LandbotCustomerGroupByField.BRS_KNOWLEDGE;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with realEstateSituation field', async () => {
    const dto = new GetLandbotCustomersByFieldDTO();
    dto.field = LandbotCustomerGroupByField.REAL_ESTATE_SITUATION;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when field is missing', async () => {
    const dto = new GetLandbotCustomersByFieldDTO();

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('field');
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should be invalid when field is not in enum', async () => {
    const dto = new GetLandbotCustomersByFieldDTO();
    (dto as any).field = 'invalidField';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('field');
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should be invalid when field is empty string', async () => {
    const dto = new GetLandbotCustomersByFieldDTO();
    (dto as any).field = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const fieldError = errors.find((error) => error.property === 'field');
    expect(fieldError).toBeDefined();
    expect(fieldError?.constraints).toHaveProperty('isEnum');
  });

  it('should be invalid when field is null', async () => {
    const dto = new GetLandbotCustomersByFieldDTO();
    (dto as any).field = null;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('field');
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should be invalid when field is undefined', async () => {
    const dto = new GetLandbotCustomersByFieldDTO();
    (dto as any).field = undefined;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('field');
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should be invalid when field is a number', async () => {
    const dto = new GetLandbotCustomersByFieldDTO();
    (dto as any).field = 123;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('field');
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should be invalid with similar but incorrect values', async () => {
    const invalidFields = [
      'eligibility ',
      ' eligibility',
      'ELIGIBILITY',
      'brs-knowledge',
      'real_estate_situation',
      'eligibility1',
    ];

    for (const field of invalidFields) {
      const dto = new GetLandbotCustomersByFieldDTO();
      (dto as any).field = field;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const fieldError = errors.find((error) => error.property === 'field');
      expect(fieldError).toBeDefined();
      expect(fieldError?.constraints).toHaveProperty('isEnum');
    }
  });
});

import { validate } from 'class-validator';
import { CreateDistributorDTO } from 'src/infrastructure/distributor/dtos/create.dto';

describe('CreateDistributorDTO', () => {
  it('should be valid with all required fields', async () => {
    const dto = new CreateDistributorDTO();
    dto.name = 'Test Distributor';
    dto.websiteUrl = 'https://test.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when name is missing', async () => {
    const dto = new CreateDistributorDTO();
    dto.websiteUrl = 'https://test.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when websiteUrl is missing', async () => {
    const dto = new CreateDistributorDTO();
    dto.name = 'Test Distributor';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('websiteUrl');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when name is not a string', async () => {
    const dto = new CreateDistributorDTO();
    (dto as any).name = 123;
    dto.websiteUrl = 'https://test.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when websiteUrl is not a string', async () => {
    const dto = new CreateDistributorDTO();
    dto.name = 'Test Distributor';
    (dto as any).websiteUrl = 123;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('websiteUrl');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when websiteUrl is empty string', async () => {
    const dto = new CreateDistributorDTO();
    dto.name = 'Test Distributor';
    dto.websiteUrl = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('websiteUrl');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid when name is empty string', async () => {
    const dto = new CreateDistributorDTO();
    dto.name = '';
    dto.websiteUrl = 'https://create-test.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid when both name and websiteUrl are missing', async () => {
    const dto = new CreateDistributorDTO();

    const errors = await validate(dto);
    expect(errors).toHaveLength(2);
    expect(errors.some((error) => error.property === 'name')).toBe(true);
    expect(errors.some((error) => error.property === 'websiteUrl')).toBe(true);
  });
});

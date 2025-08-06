import { validate } from 'class-validator';
import { CreateBrsDiffusionWebsiteDTO } from 'src/infrastructure/brs-diffusion-website/dtos/create.dto';

describe('CreateBrsDiffusionWebsiteDTO', () => {
  it('should be valid with all required fields', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    dto.source = 'Test Source';
    dto.distributorName = 'Test Distributor';
    dto.ofsName = 'Test OFS';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when source is missing', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    dto.distributorName = 'Test Distributor';
    dto.ofsName = 'Test OFS';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('source');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when distributorName is missing', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    dto.source = 'Test Source';
    dto.ofsName = 'Test OFS';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('distributorName');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when ofsName is missing', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    dto.source = 'Test Source';
    dto.distributorName = 'Test Distributor';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('ofsName');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when city is missing', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    dto.source = 'Test Source';
    dto.distributorName = 'Test Distributor';
    dto.ofsName = 'Test OFS';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('city');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when source is not a string', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    // @ts-expect-error: testing non-string value
    dto.source = 123;
    dto.distributorName = 'Test Distributor';
    dto.ofsName = 'Test OFS';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('source');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when distributorName is not a string', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    dto.source = 'Test Source';
    // @ts-expect-error: testing non-string value
    dto.distributorName = { name: 'Not a string' };
    dto.ofsName = 'Test OFS';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('distributorName');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when ofsName is not a string', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    dto.source = 'Test Source';
    dto.distributorName = 'Test Distributor';
    // @ts-expect-error: testing non-string value
    dto.ofsName = false;
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('ofsName');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when city is not a string', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    dto.source = 'Test Source';
    dto.distributorName = 'Test Distributor';
    dto.ofsName = 'Test OFS';
    // @ts-expect-error: testing non-string value
    dto.city = 999;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('city');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when source is empty', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    dto.source = '';
    dto.distributorName = 'Test Distributor';
    dto.ofsName = 'Test OFS';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('source');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid when distributorName is empty', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    dto.source = 'Test Source';
    dto.distributorName = '';
    dto.ofsName = 'Test OFS';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('distributorName');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid when ofsName is empty', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    dto.source = 'Test Source';
    dto.distributorName = 'Test Distributor';
    dto.ofsName = '';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('ofsName');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid when city is empty', async () => {
    const dto = new CreateBrsDiffusionWebsiteDTO();
    dto.source = 'Test Source';
    dto.distributorName = 'Test Distributor';
    dto.ofsName = 'Test OFS';
    dto.city = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('city');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});

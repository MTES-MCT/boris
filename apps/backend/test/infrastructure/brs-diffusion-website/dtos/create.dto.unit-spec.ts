import { validate } from 'class-validator';
import { CreateBrsDiffusionWebsiteDTO } from 'src/infrastructure/brs-diffusion-website/dtos/create.dto';

const createDto = () => {
  const dto = new CreateBrsDiffusionWebsiteDTO();
  dto.address = '12 rue de la Paix';
  dto.housingType = 'new';
  return dto;
};

describe('CreateBrsDiffusionWebsiteDTO', () => {
  it('should be valid with all required fields', async () => {
    const dto = createDto();
    dto.source = 'Test Source';
    dto.distributorName = 'Test Distributor';
    dto.ofsName = 'Test OFS';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate all optional admin fields', async () => {
    const dto = createDto();
    dto.source = 'https://example.test/programme';
    dto.distributorName = 'Test Distributor';
    dto.ofsName = 'Test OFS';
    dto.city = 'Test City';
    dto.programName = 'Test Program';
    dto.deliveryMonth = '2027-03';
    dto.ofsId = 'a302e6a4-e62c-4eca-a7da-dc87aaac629f';
    dto.distributorId = 'cdfd52b7-d3cc-45a7-a09e-c95059447f6e';
    dto.housingType = 'old';

    expect(await validate(dto)).toHaveLength(0);
  });

  it('should reject an invalid delivery month and housing type', async () => {
    const dto = createDto();
    dto.source = 'https://example.test/programme';
    dto.distributorName = 'Test Distributor';
    dto.ofsName = 'Test OFS';
    dto.city = 'Test City';
    dto.deliveryMonth = 'mars 2027';
    // @ts-expect-error: testing an unsupported value
    dto.housingType = 'renovated';

    const errors = await validate(dto);
    expect(errors.map(({ property }) => property)).toEqual(
      expect.arrayContaining(['deliveryMonth', 'housingType']),
    );
  });

  it('should be invalid when source is missing', async () => {
    const dto = createDto();
    dto.distributorName = 'Test Distributor';
    dto.ofsName = 'Test OFS';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('source');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when distributorName is missing', async () => {
    const dto = createDto();
    dto.source = 'Test Source';
    dto.ofsName = 'Test OFS';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('distributorName');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when ofsName is missing', async () => {
    const dto = createDto();
    dto.source = 'Test Source';
    dto.distributorName = 'Test Distributor';
    dto.city = 'Test City';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('ofsName');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when city is missing', async () => {
    const dto = createDto();
    dto.source = 'Test Source';
    dto.distributorName = 'Test Distributor';
    dto.ofsName = 'Test OFS';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('city');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when source is not a string', async () => {
    const dto = createDto();
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
    const dto = createDto();
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
    const dto = createDto();
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
    const dto = createDto();
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
    const dto = createDto();
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
    const dto = createDto();
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
    const dto = createDto();
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
    const dto = createDto();
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

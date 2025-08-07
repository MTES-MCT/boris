import { validate } from 'class-validator';
import { GetAllBrsDiffusionWebsitesDTO } from 'src/infrastructure/brs-diffusion-website/dtos/getAll.dto';

describe('GetAllBrsDiffusionWebsitesDTO', () => {
  it('should be valid with all fields', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 48.85341;
    dto.longitude = 2.3488;
    dto.radius = 10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with only latitude and longitude', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 48.85341;
    dto.longitude = 2.3488;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with only latitude', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 48.85341;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with only longitude', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.longitude = 2.3488;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with only radius', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.radius = 10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with empty object', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when latitude is not a number', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 'not a number' as any;
    dto.longitude = 2.3488;
    dto.radius = 10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('latitude');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when longitude is not a number', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 48.85341;
    dto.longitude = { value: 'not a number' } as any;
    dto.radius = 10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('longitude');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when radius is not an integer', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 48.85341;
    dto.longitude = 2.3488;
    dto.radius = 10.5 as any;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('radius');
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  it('should be invalid when radius is not a number', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 48.85341;
    dto.longitude = 2.3488;
    dto.radius = 'not a number' as any;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('radius');
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  it('should be invalid when radius is negative', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 48.85341;
    dto.longitude = 2.3488;
    dto.radius = -10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('radius');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should be invalid when radius is greater than 1000', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 48.85341;
    dto.longitude = 2.3488;
    dto.radius = 1001;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('radius');
    expect(errors[0].constraints).toHaveProperty('max');
  });

  it('should be valid with negative latitude', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = -48.85341;
    dto.longitude = 2.3488;
    dto.radius = 10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with negative longitude', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 48.85341;
    dto.longitude = -2.3488;
    dto.radius = 10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with zero radius', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 48.85341;
    dto.longitude = 2.3488;
    dto.radius = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with maximum radius', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 48.85341;
    dto.longitude = 2.3488;
    dto.radius = 1000;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with decimal latitude and longitude', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 48.85341;
    dto.longitude = 2.3488;
    dto.radius = 10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with large values for latitude and longitude', async () => {
    const dto = new GetAllBrsDiffusionWebsitesDTO();
    dto.latitude = 90.0;
    dto.longitude = 180.0;
    dto.radius = 10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

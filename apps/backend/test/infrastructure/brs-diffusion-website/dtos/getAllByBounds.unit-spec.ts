import { validate } from 'class-validator';
import { GetAllBrsDiffusionWebsitesByBoundsDTO } from 'src/infrastructure/brs-diffusion-website/dtos/getAllByBounds';

describe('GetAllBrsDiffusionWebsitesByBoundsDTO', () => {
  it('should be valid with all required fields', async () => {
    const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
    dto.northEastLat = 48.8566;
    dto.northEastLng = 2.3522;
    dto.southWestLat = 48.8534;
    dto.southWestLng = 2.3488;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when northEastLat is missing', async () => {
    const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
    dto.northEastLng = 2.3522;
    dto.southWestLat = 48.8534;
    dto.southWestLng = 2.3488;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('northEastLat');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when northEastLng is missing', async () => {
    const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
    dto.northEastLat = 48.8566;
    dto.southWestLat = 48.8534;
    dto.southWestLng = 2.3488;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('northEastLng');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when southWestLat is missing', async () => {
    const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
    dto.northEastLat = 48.8566;
    dto.northEastLng = 2.3522;
    dto.southWestLng = 2.3488;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('southWestLat');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when southWestLng is missing', async () => {
    const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
    dto.northEastLat = 48.8566;
    dto.northEastLng = 2.3522;
    dto.southWestLat = 48.8534;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('southWestLng');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when northEastLat is not a number', async () => {
    const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
    (dto as any).northEastLat = 'not-a-number';
    dto.northEastLng = 2.3522;
    dto.southWestLat = 48.8534;
    dto.southWestLng = 2.3488;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('northEastLat');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when northEastLng is not a number', async () => {
    const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
    dto.northEastLat = 48.8566;
    (dto as any).northEastLng = 'not-a-number';
    dto.southWestLat = 48.8534;
    dto.southWestLng = 2.3488;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('northEastLng');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when southWestLat is not a number', async () => {
    const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
    dto.northEastLat = 48.8566;
    dto.northEastLng = 2.3522;
    (dto as any).southWestLat = 'not-a-number';
    dto.southWestLng = 2.3488;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('southWestLat');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be invalid when southWestLng is not a number', async () => {
    const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
    dto.northEastLat = 48.8566;
    dto.northEastLng = 2.3522;
    dto.southWestLat = 48.8534;
    (dto as any).southWestLng = 'not-a-number';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('southWestLng');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should be valid with valid latitude and longitude ranges', async () => {
    const validCoordinates = [
      {
        northEastLat: 90,
        northEastLng: 180,
        southWestLat: -90,
        southWestLng: -180,
      }, // extremes
      { northEastLat: 0, northEastLng: 0, southWestLat: 0, southWestLng: 0 }, // equator/prime meridian
      {
        northEastLat: 48.8566,
        northEastLng: 2.3522,
        southWestLat: 48.8534,
        southWestLng: 2.3488,
      }, // Paris
    ];

    for (const coords of validCoordinates) {
      const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
      dto.northEastLat = coords.northEastLat;
      dto.northEastLng = coords.northEastLng;
      dto.southWestLat = coords.southWestLat;
      dto.southWestLng = coords.southWestLng;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should be valid with decimal coordinates', async () => {
    const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
    dto.northEastLat = 48.85341234;
    dto.northEastLng = 2.35223456;
    dto.southWestLat = 48.85345678;
    dto.southWestLng = 2.3488789;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with negative coordinates', async () => {
    const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
    dto.northEastLat = -45.8566;
    dto.northEastLng = -2.3522;
    dto.southWestLat = -45.8534;
    dto.southWestLng = -2.3488;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should have correct error messages for invalid coordinates', async () => {
    const dto = new GetAllBrsDiffusionWebsitesByBoundsDTO();
    (dto as any).northEastLat = 'invalid';
    (dto as any).northEastLng = 'invalid';
    (dto as any).southWestLat = 'invalid';
    (dto as any).southWestLng = 'invalid';

    const errors = await validate(dto);
    expect(errors).toHaveLength(4);

    const northEastLatError = errors.find(
      (error) => error.property === 'northEastLat',
    );
    expect(northEastLatError?.constraints?.isNumber).toBe(
      'La latitude nord-est doit être un nombre décimal',
    );

    const northEastLngError = errors.find(
      (error) => error.property === 'northEastLng',
    );
    expect(northEastLngError?.constraints?.isNumber).toBe(
      'La longitude nord-est doit être un nombre décimal',
    );

    const southWestLatError = errors.find(
      (error) => error.property === 'southWestLat',
    );
    expect(southWestLatError?.constraints?.isNumber).toBe(
      'La latitude sud-ouest doit être un nombre décimal',
    );

    const southWestLngError = errors.find(
      (error) => error.property === 'southWestLng',
    );
    expect(southWestLngError?.constraints?.isNumber).toBe(
      'La longitude sud-ouest doit être un nombre décimal',
    );
  });
});

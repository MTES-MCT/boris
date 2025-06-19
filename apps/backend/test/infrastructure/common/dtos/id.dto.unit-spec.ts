import { validate } from 'class-validator';
import { IdDTO } from 'src/infrastructure/common/dtos/id.dto';

describe('IdDTO', () => {
  it('should be valid with a valid UUID', async () => {
    const dto = new IdDTO();
    dto.id = '5d33fedc-7a06-48a4-b53d-05bf2da446dc';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when id is missing', async () => {
    const dto = new IdDTO();

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('id');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should be invalid when id is not a valid UUID', async () => {
    const dto = new IdDTO();
    dto.id = 'invalid-uuid';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('id');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should be invalid when id is not a string', async () => {
    const dto = new IdDTO();
    (dto as any).id = 123;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('id');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should be invalid when id is empty string', async () => {
    const dto = new IdDTO();
    dto.id = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('id');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should be valid with different UUID formats', async () => {
    const validUuids = [
      '5d33fedc-7a06-48a4-b53d-05bf2da446dc',
      '123e4567-e89b-12d3-a456-426614174000',
      '00000000-0000-0000-0000-000000000000',
    ];

    for (const uuid of validUuids) {
      const dto = new IdDTO();
      dto.id = uuid;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should be invalid with malformed UUIDs', async () => {
    const invalidUuids = [
      '5d33fedc-7a06-48a4-b53d-05bf2da446d', // too short
      '5d33fedc-7a06-48a4-b53d-05bf2da446dcc', // too long
      '5d33fedc-7a06-48a4-b53d-05bf2da446dg', // invalid character
      '5d33fedc_7a06-48a4-b53d-05bf2da446dc', // wrong separator
      '5d33fedc-7a06-48a4-b53d', // incomplete
    ];

    for (const uuid of invalidUuids) {
      const dto = new IdDTO();
      dto.id = uuid;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    }
  });
});

import { validate } from 'class-validator';
import { UpdateOfsDTO } from 'src/infrastructure/ofs/dtos/update.dto';

describe('UpdateOfsDTO', () => {
  it('should be valid with all required fields', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    dto.phone = '0203040506';
    dto.websiteUrl = 'https://updated-ofs.fr';
    dto.email = 'updated@ofs.fr';
    dto.departementNames = ['Finistère', 'Paris'];
    dto.regionNames = ['Bretagne'];
    dto.distributorIds = ['1234', '5678'];

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with only required name field', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when name is missing', async () => {
    const dto = new UpdateOfsDTO();
    dto.phone = '0203040506';
    dto.websiteUrl = 'https://updated-ofs.fr';
    dto.email = 'updated@ofs.fr';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when name is not a string', async () => {
    const dto = new UpdateOfsDTO();
    (dto as any).name = 123;
    dto.phone = '0203040506';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when name is empty string', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = '';
    dto.phone = '0203040506';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid when phone is not a string', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    (dto as any).phone = 123;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('phone');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when websiteUrl is not a string', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    (dto as any).websiteUrl = 123;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('websiteUrl');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when email is not a string', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    (dto as any).email = 123;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be valid when optional fields are not set', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    // phone, websiteUrl, email, departementNames, regionNames, distributorIds are not set

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid when optional fields are empty strings', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    dto.phone = '';
    dto.websiteUrl = '';
    dto.email = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid when arrays are empty', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    dto.departementNames = [];
    dto.regionNames = [];
    dto.distributorIds = [];

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when departementNames is not an array', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    (dto as any).departementNames = 'not-an-array';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('departementNames');
    expect(errors[0].constraints).toHaveProperty('isArray');
  });

  it('should be invalid when regionNames is not an array', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    (dto as any).regionNames = 'not-an-array';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('regionNames');
    expect(errors[0].constraints).toHaveProperty('isArray');
  });

  it('should be invalid when distributorIds is not an array', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    (dto as any).distributorIds = 'not-an-array';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('distributorIds');
    expect(errors[0].constraints).toHaveProperty('isArray');
  });

  it('should be invalid when departementNames contains non-string elements', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    (dto as any).departementNames = ['Finistère', 123, 'Paris'];

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('departementNames');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when regionNames contains non-string elements', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    (dto as any).regionNames = ['Bretagne', 123, 'Île-de-France'];

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('regionNames');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when distributorIds contains non-string elements', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    (dto as any).distributorIds = ['1234', 5678, '9012'];

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('distributorIds');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be valid with valid arrays', async () => {
    const dto = new UpdateOfsDTO();
    dto.name = 'Updated OFS Name';
    dto.departementNames = ['Finistère', 'Paris', "Côtes-d'Armor"];
    dto.regionNames = ['Bretagne', 'Île-de-France'];
    dto.distributorIds = ['1234', '5678', '9012'];

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

import { validate } from 'class-validator';
import { GetMunicipalityByInseeCodeDTO } from 'src/infrastructure/municipality/dtos/getMunicipalityByInseeCode.dto';

describe('GetMunicipalityByInseeCodeDTO', () => {
  it('should be valid with a valid INSEE code', async () => {
    const dto = new GetMunicipalityByInseeCodeDTO();
    dto.inseeCode = '75001';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when inseeCode is missing', async () => {
    const dto = new GetMunicipalityByInseeCodeDTO();

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('inseeCode');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when inseeCode is not a string', async () => {
    const dto = new GetMunicipalityByInseeCodeDTO();
    (dto as any).inseeCode = 123;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('inseeCode');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when inseeCode is empty string', async () => {
    const dto = new GetMunicipalityByInseeCodeDTO();
    dto.inseeCode = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('inseeCode');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be valid with different valid INSEE codes', async () => {
    const validInseeCodes = ['75001', '13001', '69001', '06001', '33001'];

    for (const inseeCode of validInseeCodes) {
      const dto = new GetMunicipalityByInseeCodeDTO();
      dto.inseeCode = inseeCode;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should be invalid when inseeCode is null', async () => {
    const dto = new GetMunicipalityByInseeCodeDTO();
    (dto as any).inseeCode = null;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('inseeCode');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when inseeCode is undefined', async () => {
    const dto = new GetMunicipalityByInseeCodeDTO();
    (dto as any).inseeCode = undefined;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('inseeCode');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should be invalid when inseeCode is a number as string but with wrong type', async () => {
    const dto = new GetMunicipalityByInseeCodeDTO();
    (dto as any).inseeCode = 75001;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('inseeCode');
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});

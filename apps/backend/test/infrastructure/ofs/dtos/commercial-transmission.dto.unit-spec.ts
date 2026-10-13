import { createValidationPipe } from 'src/infrastructure/config/validation-pipe.config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateCommercialTransmissionDto,
  UpdateCommercialTransmissionDto,
} from 'src/infrastructure/ofs/dtos/commercial-transmission.dto';
import { CommercialTransmissionScopeType } from 'src/infrastructure/ofs/commercial-transmission.entity';

describe('Commercial transmission DTOs', () => {
  it('rejects the former portal update payload and accepts it without distributorId', async () => {
    const pipe = createValidationPipe();
    const metadata = {
      type: 'body' as const,
      metatype: UpdateCommercialTransmissionDto,
    };
    const payload = {
      scopeType: CommercialTransmissionScopeType.GEOGRAPHIC,
      inseeCodes: ['75056', '2A004'],
      departementCodes: ['69'],
      isActive: true,
    };

    await expect(
      pipe.transform({ ...payload, distributorId: '' }, metadata),
    ).rejects.toMatchObject({
      response: { message: ['property distributorId should not exist'] },
    });
    await expect(pipe.transform(payload, metadata)).resolves.toMatchObject(
      payload,
    );
  });

  it('accepts a valid create payload', async () => {
    const dto = plainToInstance(CreateCommercialTransmissionDto, {
      distributorId: '550e8400-e29b-41d4-a716-446655440000',
      scopeType: CommercialTransmissionScopeType.GEOGRAPHIC,
      inseeCodes: ['75056'],
      departementCodes: ['75'],
      isActive: true,
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('rejects non-string geographic codes', async () => {
    const dto = plainToInstance(CreateCommercialTransmissionDto, {
      distributorId: '550e8400-e29b-41d4-a716-446655440000',
      inseeCodes: [123],
    });

    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'inseeCodes')).toBe(true);
  });

  it('rejects an invalid update boolean', async () => {
    const dto = plainToInstance(UpdateCommercialTransmissionDto, {
      isActive: 'yes',
    });

    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'isActive')).toBe(true);
  });
});

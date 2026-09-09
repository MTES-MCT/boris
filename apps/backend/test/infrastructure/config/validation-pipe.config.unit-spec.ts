import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { createValidationPipe } from 'src/infrastructure/config/validation-pipe.config';
import { CreateCommercialTransmissionDto } from 'src/infrastructure/ofs/dtos/commercial-transmission.dto';

describe('global validation pipe', () => {
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: CreateCommercialTransmissionDto,
    data: undefined,
  };

  it('rejects properties that are not declared by the DTO', async () => {
    await expect(
      createValidationPipe().transform(
        {
          distributorId: '550e8400-e29b-41d4-a716-446655440000',
          admin: true,
        },
        metadata,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects non-string values inside code arrays', async () => {
    await expect(
      createValidationPipe().transform(
        {
          distributorId: '550e8400-e29b-41d4-a716-446655440000',
          inseeCodes: [123],
        },
        metadata,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

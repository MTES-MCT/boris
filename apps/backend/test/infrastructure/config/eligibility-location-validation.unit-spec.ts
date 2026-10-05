import { BadRequestException } from '@nestjs/common';
import { createValidationPipe } from 'src/infrastructure/config/validation-pipe.config';
import { UpdateEligibilitySimulationDTO } from 'src/infrastructure/eligibility-simulation/dtos/update.dto';
import { toEligibilitySimulationLocation } from '../../../../frontend/src/lib/utils/eligibility-simulation-location';

describe('eligibility location payload from the frontend', () => {
  const suggestion = {
    id: 'suggestion-paris',
    name: 'Paris',
    city: 'Paris',
    citycode: '75056',
    label: 'Paris',
    postcode: '75001',
    x: 2.35,
    y: 48.85,
    score: 0.9,
    type: 'municipality' as const,
  };
  const metadata = {
    type: 'body' as const,
    metatype: UpdateEligibilitySimulationDTO,
  };

  it('rejects the previous payload containing geocoder metadata', async () => {
    await expect(
      createValidationPipe().transform(
        {
          housingType: 'T2',
          locations: [
            {
              ...suggestion,
              latitude: suggestion.y,
              longitude: suggestion.x,
              postalCode: suggestion.postcode,
            },
          ],
        },
        metadata,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('accepts mapped locations and preserves the data needed to save them', async () => {
    const result = await createValidationPipe().transform(
      {
        housingType: 'T2',
        locations: [toEligibilitySimulationLocation(suggestion)],
      },
      metadata,
    );

    expect(JSON.parse(JSON.stringify(result.locations))).toEqual([
      {
        name: 'Paris',
        city: 'Paris',
        citycode: '75056',
        label: 'Paris',
        latitude: 48.85,
        longitude: 2.35,
        postalCode: '75001',
      },
    ]);
  });
});

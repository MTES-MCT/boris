import { describe, expect, it } from 'vitest';
import { getBrsCardContent } from '$lib/utils/brs-diffusion-website';

describe('getBrsCardContent', () => {
  it('prioritises the program and keeps the actors in the expected order', () => {
    expect(
      getBrsCardContent({
        programName: 'Les Jardins de Boris',
        distributorName: 'Coop Habitat',
        ofsName: 'OFS Métropole',
        address: '12 rue de la Paix',
        city: 'Rennes',
        deliveryMonth: '2027-03',
      }),
    ).toEqual({
      title: 'Les Jardins de Boris',
      distributorName: 'Coop Habitat',
      ofsName: 'OFS Métropole',
      address: '12 rue de la Paix',
      deliveryMonth: 'mars 2027',
    });
  });

  it('uses the first available actor as title without repeating it', () => {
    expect(
      getBrsCardContent({
        distributorName: 'Coop Habitat',
        ofsName: 'OFS Métropole',
        city: 'Rennes',
      }),
    ).toMatchObject({
      title: 'Coop Habitat',
      distributorName: null,
      ofsName: 'OFS Métropole',
    });
  });

  it('provides a useful title when both actors are omitted', () => {
    expect(
      getBrsCardContent({ city: 'Rennes', address: '35, Ille-et-Vilaine' }),
    ).toMatchObject({
      title: 'Programme BRS à Rennes',
      distributorName: null,
      ofsName: null,
      address: null,
    });
  });
});

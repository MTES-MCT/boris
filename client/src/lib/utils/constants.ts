import type { EligibilityData } from './definitions';

export const eligibilityData: EligibilityData[] = [
  {
    category: { small: '1', long: 'Catégorie de ménage 1' },
    zoneAandAbis: 37581,
    zoneB1: 37581,
    zoneB2andC: 32673,
    content: 'Une personne seule',
    contentHtml: 'Une personne seule',
  },
  {
    category: { small: '2', long: 'Catégorie de ménage 2' },
    zoneAandAbis: 56169,
    zoneB1: 56169,
    zoneB2andC: 43633,
    content:
      "Deux personnes ne comportant aucune personne à charge, à l'exclusion des jeunes ménages ou une personne seule en situation de handicap",
    contentHtml: `
      Deux personnes ne comportant aucune personne à charge, <b>à l'exclusion des jeunes ménages</b>
      <br />
      <b>ou</b>
      <br />
      une personne seule en situation de handicap
    `,
  },
  {
    category: { small: '3', long: 'Catégorie de ménage 3' },
    zoneAandAbis: 73630,
    zoneB1: 67517,
    zoneB2andC: 52471,
    content:
      'Trois personnes ou une personne seule avec une personne à charge ou un jeune ménages (deux personnes dont la somme des âges ne dépasse pas 55 ans) ou deux personnes dont au moins une est en situation de handicap',
    contentHtml: `
      Trois personnes
      <br />
      <b>ou</b>
      <br />
      une personne seule avec une personne à charge
      <br />
      <b>ou</b>
      <br />
      un jeune ménages (deux personnes dont la somme des âges ne dépasse
      pas 55 ans)
      <br />
      <b>ou</b>
      <br />
      deux personnes dont au moins une est en situation de handicap
    `,
  },
  {
    category: { small: '4', long: 'Catégorie de ménage 4' },
    zoneAandAbis: 87909,
    zoneB1: 80875,
    zoneB2andC: 63347,
    content:
      'Quatre personnes ou une personne seule avec deux personnes à charge ou trois personnes dont au moins une est en situation de handicap',
    contentHtml: `
      Quatre personnes
      <br />
      <b>ou</b>
      <br />
      une personne seule avec deux personnes à charge
      <br />
      <b>ou</b>
      <br />
      trois personnes dont au moins une est en situation de handicap
    `,
  },
  {
    category: { small: '5', long: 'Catégorie de ménage 5' },
    zoneAandAbis: 104592,
    zoneB1: 95739,
    zoneB2andC: 74518,
    content:
      'Cinq personnes ou une personne seule avec trois personnes à charge ou quatre personnes dont au moins une est en situation de handicap',
    contentHtml: `
      Cinq personnes
      <br />
      <b>ou</b>
      <br />
      une personne seule avec trois personnes à charge
      <br />
      <b>ou</b>
      <br />
      quatre personnes dont au moins une est en situation de handicap
    `,
  },
  {
    category: { small: '6', long: 'Catégorie de ménage 6' },
    zoneAandAbis: 117694,
    zoneB1: 107738,
    zoneB2andC: 83983,
    content:
      'Six personnes ou une personne seule avec quatre personnes à charge ou cinq personnes dont au moins une est en situation de handicap',
    contentHtml: `
      Six personnes
      <br />
      <b>ou</b>
      <br />
      une personne seule avec quatre personnes à charge
      <br />
      <b>ou</b>
      <br />
      cinq personnes dont au moins une est en situation de handicap
    `,
  },
  {
    category: {
      small: 'Personne supplémentaire',
      long: 'Personne supplémentaire',
    },
    zoneAandAbis: 13116,
    zoneB1: 12005,
    zoneB2andC: 9368,
    content: 'Personne supplémentaire',
  },
];

import type { EligibilityData, Statistic } from '$lib/utils/definitions';

export const eligibilityData: EligibilityData[] = [
  {
    category: 'Catégorie 1',
    value: 1,
    options: ['1 seule personne'],
    zoneAandAbis: 38508,
    zoneB1: 38508,
    zoneB2andC: 33479,
  },
  {
    category: 'Catégorie 2',
    value: 2,
    options: [
      '2 personnes ne comportant aucune personne à charge hors jeunes ménages',
      '1 personne seule en situation de handicap',
    ],
    zoneAandAbis: 57555,
    zoneB1: 57555,
    zoneB2andC: 44710,
  },
  {
    category: 'Catégorie 3',
    value: 3,
    options: [
      '3 personnes',
      '1 personne seule avec 1 personne à charge',
      'Jeune ménage: 2 personnes dont la somme des âges ne dépasse pas 55 ans',
      '2 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 75447,
    zoneB1: 69183,
    zoneB2andC: 53766,
  },
  {
    category: 'Catégorie 4',
    value: 4,
    options: [
      '4 personnes',
      '1 personne seule avec 2 personnes à charge',
      '3 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 90078,
    zoneB1: 82871,
    zoneB2andC: 64910,
  },
  {
    category: 'Catégorie 5',
    value: 5,
    options: [
      '5 personnes',
      '1 personne avec 3 personnes à charge',
      '4 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 107173,
    zoneB1: 98101,
    zoneB2andC: 76357,
  },
  {
    category: 'Catégorie 6',
    value: 6,
    options: [
      '6 personnes',
      '1 personne seule avec 4 personnes à charge',
      '5 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 120598,
    zoneB1: 110396,
    zoneB2andC: 86055,
  },
  {
    category: 'Personne supplémentaire',
    value: 7,
    options: [],
    zoneAandAbis: 13440,
    zoneB1: 12301,
    zoneB2andC: 9599,
  },
];

export const statistics: Statistic[] = [
  {
    amount: '199 000 €',
    subtitle: 'd’argent public investi sur notre plateforme.',
    content: '',
  },
  {
    amount: '4 750',
    subtitle: 'simulations',
    content: 'dont 75% concernent des ménages éligibles.',
  },
  {
    amount: '1 275',
    subtitle: 'ménages recontactés',
    content:
      'après simulation d’éligibilité pour avoir les clés de la poursuite de leur projets (dont 61% ne connaissait pas le BRS avant BoRiS)',
  },
  {
    amount: '40',
    subtitle: 'organismes de foncier solidaire partenaires',
    content: '',
  },
];

export const toutSavoirSurLeBRSPromesses: string[] = [
  `
    <p>
      <b>
        Les logements mis en vente en BRS sont 30 à 50% moins chers que ceux mis en vente dans le marché traditionnel.
      </b>
    </p>
    <p>
      Les prix sont encadrés et contrôlés par l'État. Cela est rendu possible notamment parce que les propriétaires d'un logement en BRS achètent leur logement à 100%, mais pas le terrain sur lequel celui-ci est construit.
    </p>
    <p>
      En échange, les propriétaires d'un logement d'un BRS s'acquittent d'une redevance mensuelle contenue.
    </p>
  `,
  `
    <p>
      <b>
        En tant que propriétaire d'un logement en BRS, vous pouvez notamment revendre votre logement (avec une plus-value toutefois encadrée) ou le transmettre à vos proches.
      </b>
    </p>
    <p>
      Le dispositif se veut ainsi solidaire car il permet aux générations futures d'accéder à la propriété dans des conditions similaires, de manière abordable.
    </p>
  `,
  `
    <p>
      Les premiers logements en BRS ont vu le jour en 2019 et depuis le dispositif se déploie sur l’ensemble du territoire national.
    </p>
    <p>
      Les acquéreurs sont accompagnés tout au long de leur procédure d'achat par un organisme dédié.
    </p>
  `,
];

export const reventePromesses: string[] = [
  `
    <p>
      <b>Vous êtes libre de vendre votre bien à tout moment.</b>
    </p>
    <p>
      Que ce soit pour changer de ville ou trouver un nouveau logement plus approprié à vos besoins, c’est vous qui décidez quand vous partez !
    </p>
  `,
  `
    <p>
      <b>
        La revente d’un bien en BRS est encadrée :
      </b>
    </p>
    <p>
      Vous ne pouvez pas le vendre à n’importe qui : le ménage acheteur doit respecter les conditions d’éligibilité au BRS (c’est le cas de 87% des foyers !)
    </p>
    <p>
      Le prix de revente est encadré : vous pouvez faire une plus value à hauteur de l’inflation depuis votre achat. Le BRS est un dispositif non spéculatif.
    </p>
  `,
  `
    <p>
      <b>Il faut impliquer l’OFS dans le processus.</b>
    </p>
    <p>
      D’abord parce qu’il a un droit de préemption (il peut racheter le bien avant qu’il soit proposé à d’autres personnes) ; ensuite parce qu’il doit donner son agrément ;  parce qu’il doit être impliqué dans la rédaction du contrat de vente ; enfin parce qu’il peut vous aider à trouver un acheteur !
    </p>
  `,
];

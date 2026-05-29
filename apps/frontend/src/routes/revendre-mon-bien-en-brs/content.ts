import type { Step } from '$lib/utils/definitions';

export const resaleSteps = [
  {
    title:
      'Notifier l’OFS et préciser le plafond applicable au prix de revente',
    description:
      'Vous prévenez votre OFS de votre intention de vendre ; il calcule le prix plafond de votre logement selon votre bail.',
  },
  {
    title: 'Préparer le logement',
    description:
      'Vous faites réaliser les diagnostics obligatoires et, si nécessaire, quelques travaux pour rendre le logement attrayant.',
  },
  {
    title: 'Trouver un acheteur éligible au bail réel solidaire',
    description:
      'Vous diffusez l’annonce, en direct ou via une agence connaissant le BRS, et vérifiez l’éligibilité du candidat avec le simulateur.',
  },
  {
    title: 'Remettre l’offre préalable de cession',
    description:
      'Vous adressez à l’acheteur un document formel précisant les conditions de la vente en BRS.',
  },
  {
    title: 'Obtenir l’agrément de l’OFS',
    description:
      'L’OFS vérifie l’éligibilité de l’acheteur, son financement et la conformité de l’offre. Il a deux mois pour répondre.',
  },
  {
    title: 'Signer chez le notaire',
    description:
      'Promesse de vente puis acte authentique : vous transférez les droits réels, vous recevez les fonds.',
  },
  {
    title: 'En cas de blocage',
    description:
      'Pas d’acheteur ou refus d’agrément ? Plusieurs solutions, dont la résiliation conventionnelle du bail.',
  },
];

const step1 = {
  title: 'Revendre mon bien en BRS',
  headTitle: 'Revendre un logement en Bail Réel Solidaire - BRS - BoRiS',
  slug: 'revendre-mon-bien-en-brs',
  description:
    'Vous souhaitez revendre votre logement en Bail Réel Solidaire (BRS) ? BoRiS vous donne toutes les informations nécessaires au succès de votre projet de revente.',
  showAdilSnippet: false,
};

export const steps: Step[] = [
  {
    ...step1,
    sections: [
      {
        id: 'trouver-mon-ofs',
        title: 'Qui est mon OFS ?',
        content: '',
      },
      {
        id: 'revente-en-7-etapes',
        title: 'Les 7 étapes de la revente',
        content: '',
      },
      {
        id: 'faq-etape-1',
        title: '1 · Notifier l’OFS',
        content: '',
      },
      {
        id: 'faq-etape-2',
        title: '2 · Préparer le logement',
        content: '',
      },
      {
        id: 'faq-etape-3',
        title: '3 · Trouver un acheteur',
        content: '',
      },
      {
        id: 'faq-etape-4',
        title: '4 · Offre préalable',
        content: '',
      },
      {
        id: 'faq-etape-5',
        title: '5 · Agrément de l’OFS',
        content: '',
      },
      {
        id: 'faq-etape-6',
        title: '6 · Signature chez le notaire',
        content: '',
      },
      {
        id: 'faq-etape-7',
        title: '7 · En cas de blocage',
        content: '',
      },
      {
        id: 'faq-cas-particuliers',
        title: '8 · Cas particuliers',
        content: '',
      },
    ],
  },
];

import type { Step } from '$lib/utils/definitions';

export const hero = `
  <p class="fr-mb-0">
    Vous souhaitez revendre votre bien en BRS ? BoRiS est là pour vous guider
    à chacune des phases ! Notre équipe du Ministère du logement peut même
    vous accompagner gratuitement dans ce projet. Cela vous intéresse ?
    Contactez-nous
    <a
      href="/nous-contacter"
      class="fr-link">
      ici
    </a>
    <br />
    <br />
    Sur cette page, vous découvrirez chaque étape jusqu’à la vente.
  </p>
`;

export const promesses: string[] = [
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

export const steps: Step[] = [
  {
    title:
      'Notifier l’Organisme de Foncier Solidaire (OFS) et déterminer votre prix de vente',
    description:
      "Découvrez comment trouver votre logement en Bail Réel Solidaire (BRS) : conseils pour définir votre projet, rechercher un bien et préparer votre dossier d'achat. BoRiS vous accompagne dans toutes les étapes.",
  },
  {
    title: 'Préparer votre logement et le mettre en vente',
    description:
      "Découvrez les solutions de financement disponibles pour l'achat d'un logement en Bail Réel Solidaire (BRS) : prêts, aides, et conseils pour établir un plan de financement adapté à votre projet immobilier.",
  },
  {
    title: 'Trouvez un acheteur',
    description:
      "Devenez propriétaire d'un logement en Bail Réel Solidaire (BRS) : suivez les étapes clés après avoir trouvé votre bien, de la signature du compromis à l'acte de vente chez le notaire, et préparez votre dossier pour finaliser l'achat.",
  },
  {
    title:
      'Rédigez votre offre préalable de cession et vérifiez que tout est bon avec votre Organisme de Foncier Solidaire ',
    description:
      'Une fois installé dans votre logement en Bail Réel Solidaire (BRS), découvrez vos droits et obligations : assurance, réalisation de travaux, gestion de la copropriété et conditions de revente pour garantir une expérience de vie sereine.',
  },
  {
    title: 'Passez devant le notaire pour finaliser la vente',
    description:
      'Une fois installé dans votre logement en Bail Réel Solidaire (BRS), découvrez vos droits et obligations : assurance, réalisation de travaux, gestion de la copropriété et conditions de revente pour garantir une expérience de vie sereine.',
  },
];

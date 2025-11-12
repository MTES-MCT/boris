import { default as BrsEtape1 } from '$assets/illustrations/brs-etape-1.svg?raw';
import { default as BrsEtape2 } from '$assets/illustrations/brs-etape-2.svg?raw';
import { default as BrsEtape3 } from '$assets/illustrations/brs-etape-3.svg?raw';
import { default as BrsEtape4 } from '$assets/illustrations/brs-etape-4.svg?raw';
import { default as BrsEtape5 } from '$assets/illustrations/brs-etape-5.svg?raw';
import brs1 from '$assets/images/brs-1.jpg?as=run';
import brs2 from '$assets/images/brs-2.jpg?as=run';
import brs3 from '$assets/images/brs-3.jpg?as=run';
import brs4 from '$assets/images/brs-4.jpg?as=run';
import brs5 from '$assets/images/brs-5.jpg?as=run';
import { step1, step2, step3, step4, step5 } from './[slug]/content';

export const steps = [
  {
    illustration: BrsEtape1,
    image: brs1,
    photograph: 'Surprising_Media',
    title: 'Je me renseigne sur le dispositif du bail réel solidaire (BRS).',
    description:
      "Découvrez les informations relatives au bail réel solidaire : les avantages du bail réel solidaire (BRS), les inconvénients du bail réel solidaire (où plutôt les contreparties), les critères d'éligibilité et les parties prenantes d'un projet en BRS.",
    hrefLabel: 'Tout savoir sur le bail réel solidaire',
    href: `/tout-savoir-sur-le-bail-reel-solidaire-brs/${step1.slug}`,
  },
  {
    illustration: BrsEtape2,
    image: brs2,
    photograph: 'George Becker',
    title: 'Je trouve mon logement en bail réel solidaire (BRS).',
    description:
      "Définissez votre projet d'achat, trouvez le logement de vos rêves en BRS, construisez votre dossier et candidatez pour l'obtenir.",
    hrefLabel: 'Construire son projet immobilier',
    href: `/tout-savoir-sur-le-bail-reel-solidaire-brs/${step2.slug}`,
  },
  {
    illustration: BrsEtape3,
    image: brs3,
    photograph: 'Mikhail Nilov ',
    title: 'Je cherche des financements.',
    description:
      'Assurez-vous de pouvoir financer votre achat, payer les frais en tant que propriétaire en BRS grâce à vos fonds propres, un emprunt bancaire et des aides éventuelles et projetez-vous à plus long terme.',
    hrefLabel: 'Définir son projet financier',
    href: `/tout-savoir-sur-le-bail-reel-solidaire-brs/${step3.slug}`,
  },
  {
    illustration: BrsEtape4,
    image: brs4,
    photograph: 'Mikhail Nilov ',
    title: 'Je passe chez le notaire.',
    description:
      "Vérifiez toutes les étapes après avoir trouvé un logement, les documents à fournir ainsi que comment choisir son ou sa notaire pour signer l'acte de vente.",
    hrefLabel: "S'assurer du bon déroulement de l'achat",
    href: `/tout-savoir-sur-le-bail-reel-solidaire-brs/${step4.slug}`,
  },
  {
    illustration: BrsEtape5,
    image: brs5,
    photograph: 'Lisa from Pexels',
    title: 'Je suis chez moi !',
    description:
      "Profitez de votre logement et assurez-vous de bien connaître les spécificités liées au BRS : l'assurance logement BRS, réalisation des travaux, la vie en copropriété et la revente du logement.",
    hrefLabel: "Découvrez les spécificités pour l'après achat",
    href: `/tout-savoir-sur-le-bail-reel-solidaire-brs/${step5.slug}`,
  },
];

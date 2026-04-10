import { articles } from '$routes/blog/articles';
import { steps as revendreSteps } from '$routes/revendre-mon-bien-en-brs/content';
import { steps as brsSteps } from '$routes/tout-savoir-sur-le-bail-reel-solidaire-brs/[slug]/content';

export const SITE_URL = 'https://www.boris.beta.gouv.fr';
export const DEFAULT_SHARE_IMAGE = '/boris-logo.svg';

type JsonLd = Record<string, unknown>;

type SeoMetadata = {
  title: string;
  description: string;
  pathname: string;
  imagePath?: string;
  type?: 'website' | 'article';
  jsonLd?: JsonLd | JsonLd[];
};

const homeMetadata: SeoMetadata = {
  title: 'La plateforme officielle du Bail Réel Solidaire - BRS - BoRiS',
  description:
    "Découvrez le Bail Réel Solidaire (BRS), vérifiez votre éligibilité et trouvez un logement abordable grâce aux informations officielles de l'État.",
  pathname: '/',
};

const staticMetadataByPath: Record<string, Omit<SeoMetadata, 'pathname'>> = {
  '/accessibilite': {
    title: 'Accessibilité - Boris',
    description:
      "Déclaration d'accessibilité du site Boris et découvrez les actions pour garantir un accès inclusif aux services du Bail Réel Solidaire.",
  },
  '/action-logement': {
    title: 'Action Logement | Boris',
    description:
      "Service de conseil gratuit d'Action Logement pour vous accompagner dans votre projet d'achat en BRS et construire un plan de financement adapté.",
  },
  '/blog': {
    title: 'Blog sur le Bail Réel Solidaire - BRS - BoRiS',
    description:
      'Articles de blog sur des sujets précis concernant le Bail Réel Solidaire (BRS). BoRiS est la plateforme de référence du Ministère du Logement.',
  },
  '/conditions-generales-d-utilisation': {
    title: "Conditions générales d'utilisation - Boris",
    description:
      "Consultez les conditions générales d'utilisation du site Boris, plateforme officielle dédiée au Bail Réel Solidaire, régissant l'accès et l'utilisation des services en ligne.",
  },
  '/espace-presse': {
    title: 'Espace presse - BoRiS',
    description:
      "Découvrez l'espace presse de BoRiS, avec nos communiqués et dossiers de presse sur le Bail Réel Solidaire (BRS).",
  },
  '/logements-brs-disponibles': {
    title: 'Trouver un logement en Bail Réel Solidaire - BoRiS',
    description:
      "Trouvez un logement en BRS: consultez les biens en BRS disponibles à l'achat partout en France. Appartements et maisons en bail réel solidaire.",
  },
  '/mentions-legales': {
    title: 'Mentions légales - Boris',
    description:
      "Consultez les mentions légales du site Boris, régissant l'utilisation de la plateforme dédiée au Bail Réel Solidaire, et les informations légales concernant son exploitation.",
  },
  '/notre-mission': {
    title: 'Notre mission - Boris',
    description:
      "Découvrez la mission de Boris, plateforme dédiée au Bail Réel Solidaire, qui facilite l'accès à la propriété pour tous en accompagnant les ménages dans leur parcours vers l'achat.",
  },
  '/nous-contacter': {
    title: 'Nous contacter - Boris',
    description:
      "Contactez-nous pour toute question concernant le Bail Réel Solidaire (BRS) et obtenez de l'aide pour votre parcours vers l'achat d'un logement.",
  },
  '/organismes-de-foncier-solidaire': {
    title: 'OFS : définition, rôle, actions et liste - Boris',
    description:
      "OFS : découvrez les missions d'un OFS, ses actions, comprenez le lien OFS-BRS et identifiez les OFS proches de chez vous.",
  },
  '/politique-de-confidentialite': {
    title: 'Politique de confidentialité - Boris',
    description:
      "Consultez la politique de confidentialité de Boris, qui décrit la collecte, l'utilisation et la protection de vos données personnelles lors de l'utilisation de la plateforme dédiée au Bail Réel Solidaire.",
  },
  '/questionnaire': {
    title: 'Questionnaire | BORIS',
    description:
      "Questionnaire BoRiS pour recueillir des retours sur l'accès au Bail Réel Solidaire.",
  },
  '/simulateur-acquisition': {
    title: "Simulateur d'acquisition - Boris",
    description:
      "Simulez les frais liés à l'acquisition d'un logement en Bail Réel Solidaire (BRS), du financement aux différentes charges liées à la propriété en BRS.",
  },
  '/simulateur-eligibilite': {
    title: 'Suis-je éligible au Bail Réel Solidaire - BRS - BoRiS',
    description:
      "L'outil de simulation de l'Etat pour savoir si vous êtes éligible au dispositif de Bail Réel Solidaire (BRS).",
  },
  '/simulateur-eligibilite/steps': {
    title: "Simulateur d'éligibilité au Bail Réel Solidaire - BoRiS",
    description:
      "Simulez votre éligibilité au Bail Réel Solidaire (BRS) avec le simulateur de BoRiS.",
  },
  '/statistiques': {
    title: 'Statistiques - BoRiS',
    description: 'Voir les statistiques du Bail Réel Solidaire (BRS) sur BoRiS.',
  },
  '/tout-savoir-sur-le-bail-reel-solidaire-brs': {
    title: 'Tout savoir sur le bail réel solidaire - BRS - BoRiS',
    description:
      'Toutes les informations nécessaires sur le dispositif de Bail Réel Solidaire (BRS). BoRiS est la plateforme de référence du Ministère du Logement.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Comment savoir si je suis éligible au BRS ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Pour savoir si vous êtes éligible au bail réel solidaire, il vous suffit de remplir ce simulateur d'éligibilité au bail réel solidaire. Pour plus d'informations sur les conditions d'éligibilité, vous pouvez consulter cet article dédié : comment savoir si je suis éligible au BRS.",
          },
        },
        {
          '@type': 'Question',
          name: "Le Bail Réel Solidaire (BRS), c'est quoi exactement ?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Le bail réel solidaire (BRS) est un dispositif immobilier mis en place par l'Etat en 2015. C'est un dispositif d'accession sociale à la propriété. Il permet à des personnes qui ne pourraient pas devenir propriétaire sur le marché libre, d'acheter leur résidence principale 30 à 50% moins cher en contrepartie de certaines conditions. Consultez notre article dédié pour tout savoir sur le bail réel solidaire (BRS).",
          },
        },
        {
          '@type': 'Question',
          name: 'Quels sont les plafonds de revenus 2026 en bail réel solidaire (BRS) ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Consultez le tableau des plafonds de revenus BRS 2026 disponible dans le simulateur d\'éligibilité.',
          },
        },
        {
          '@type': 'Question',
          name: 'Comment savoir si je suis en zone A, Abis, B1 ou C ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Pour connaître votre zone, vous pouvez utiliser le simulateur de zonage proposé par service-public.fr.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quelle est la durée du BRS ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Le Bail Réel Solidaire (BRS) est signé pour une durée de 18 à 99 ans. Lorsqu\'il y a une revente ou succession, cette durée repart à zéro.',
          },
        },
        {
          '@type': 'Question',
          name: 'Où trouver un logement en bail réel solidaire ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Pour consulter les différents logements en bail réel solidaire disponibles à l'achat, vous pouvez vous rendre sur la page trouver un logement en BRS de BoRiS. Vous y trouverez les appartements et maisons en bail réel solidaire proches de chez vous, par exemple à Bordeaux, Lille, Lyon, Marseille, Montpellier, Nantes, Nice, Paris, Rennes, Strasbourg et Toulouse.",
          },
        },
        {
          '@type': 'Question',
          name: "Un organisme de foncier solidaire (OFS), c'est quoi ?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Un organisme de foncier solidaire (OFS) est un organisme agréé par l'Etat, qui achète des terrains pour y construire des logements en bail réel solidaire qu'il met ensuite en vente. Les organismes de foncier solidaire (OFS) sont des structures à but non lucratif.",
          },
        },
        {
          '@type': 'Question',
          name: 'Est-ce que je dois respecter un délai pour revendre mon bien en bail réel solidaire ? Ou je peux revendre quand je veux ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "La revente en bail réel solidaire est possible à tout moment. Il n'y a pas de délai à respecter après l'achat. Vous trouverez ici plus d'informations sur la revente en bail réel solidaire.",
          },
        },
      ],
    },
  },
};

const revendreStep = revendreSteps[0];

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') {
    return '/';
  }

  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return normalizedPathname.endsWith('/')
    ? normalizedPathname.slice(0, -1)
    : normalizedPathname;
}

function createBreadcrumbSchema(pathname: string, title: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tout savoir sur le BRS',
        item: `${SITE_URL}/tout-savoir-sur-le-bail-reel-solidaire-brs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${SITE_URL}${pathname}`,
      },
    ],
  };
}

function createArticleSchema(pathname: string, article: (typeof articles)[number]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.pageTitle || article.title,
    description: article.description,
    datePublished: article.firstPublishedAt,
    author: {
      '@type': 'Organization',
      name: 'BoRiS',
    },
    mainEntityOfPage: `${SITE_URL}${pathname}`,
  };
}

export function getSeoMetadata(pathname: string): SeoMetadata {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === '/') {
    return homeMetadata;
  }

  const staticMetadata = staticMetadataByPath[normalizedPathname];

  if (staticMetadata) {
    return {
      ...staticMetadata,
      pathname: normalizedPathname,
    };
  }

  const brsStep = brsSteps.find((step) => normalizedPathname.endsWith(`/${step.slug}`));

  if (brsStep) {
    return {
      title: brsStep.headTitle,
      description: brsStep.description,
      pathname: normalizedPathname,
      jsonLd: createBreadcrumbSchema(normalizedPathname, brsStep.title),
    };
  }

  const article = articles.find((entry) => normalizedPathname === `/blog/${entry.slug}`);

  if (article) {
    return {
      title: article.title,
      description: article.description,
      pathname: normalizedPathname,
      type: 'article',
      jsonLd: createArticleSchema(normalizedPathname, article),
    };
  }

  if (normalizedPathname === `/${revendreStep.slug}`) {
    return {
      title: revendreStep.headTitle,
      description: revendreStep.description,
      pathname: normalizedPathname,
    };
  }

  return {
    title: homeMetadata.title,
    description: homeMetadata.description,
    pathname: normalizedPathname,
  };
}

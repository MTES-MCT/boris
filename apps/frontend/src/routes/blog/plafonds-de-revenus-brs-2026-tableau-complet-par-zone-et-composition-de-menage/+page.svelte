<script lang="ts">
  import ArticlePage from '$components/pages/blog/ArticlePage.svelte';
  import type { ArticlePreview } from '$lib/utils/definitions';
  import { articles } from '$routes/blog/articles';

  const article = articles.find(
    (article) =>
      article.slug ===
      'plafonds-de-revenus-brs-2026-tableau-complet-par-zone-et-composition-de-menage',
  ) as ArticlePreview;
</script>

<ArticlePage {article}>
  <p>
    Vous souhaitez acheter un logement en <b>Bail Réel Solidaire (BRS)</b>
    et vous vous demandez si vous êtes éligible ? Les plafonds de ressources du BRS
    sont révisés chaque année au 1er janvier. Depuis
    <b>janvier 2026</b>
    , de nouveaux montants sont en vigueur.
  </p>
  <p>
    Ce guide vous donne le tableau officiel des plafonds 2026, la comparaison
    avec 2025, et tout ce qu'il faut savoir pour vérifier votre éligibilité au
    BRS selon votre situation familiale et la zone géographique de votre futur
    logement.
  </p>

  <h2 class="fr-mt-8w">Qu'est-ce que le plafond de revenus BRS ?</h2>
  <p>
    Le Bail Réel Solidaire est un dispositif d'accession sociale à la propriété
    réservé aux ménages dont les ressources ne dépassent pas un certain seuil.
    Ces <b>plafonds de revenus BRS</b>
    sont fixés par arrêté et révisés chaque année en fonction de l'évolution de l'inflation.
  </p>
  <p>
    Environ <b>87 % des ménages résidant en France</b>
    sont éligibles au BRS : il s'agit donc d'un dispositif bien plus large qu'on
    ne le pense souvent.
  </p>
  <p>
    📌 <b>Quel revenu prendre en compte ?</b>
    Le revenu à déclarer est votre
    <b>Revenu Fiscal de Référence (RFR)</b>
    , disponible sur votre avis d'imposition, pour l'année N-2. En 2026, c'est donc
    le revenu de l'année
    <b>2024</b>
    , disponible sur l'avis d'imposition 2025, qui est pris en compte.
  </p>

  <p class="fr-text--bold !mb-0">
    Où trouver votre Revenu fiscal de référence (RFR) ?
  </p>
  <p>
    Sur votre avis d'imposition, référez-vous en bas du document à la ligne
    "revenu fiscal de référence".
  </p>

  <h2 class="fr-mt-8w">Les zones géographiques du BRS : A/Abis, B1, B2 et C</h2>
  <p>
    Les plafonds de revenus BRS varient selon la <b>
      zone de tension immobilière
    </b>
    dans laquelle se situe votre futur logement. Plus la zone est tendue, plus le
    plafond est élevé pour permettre l'accès au dispositif dans les agglomérations
    où les prix sont les plus hauts.
  </p>
  <ul>
    <li>
      <b>Zone Abis :</b>
      Paris et 97 autres communes d'Ile-de-France.
    </li>
    <li>
      <b>Zone A :</b>
      agglomération parisienne hors Abis, Côte d'Azur, Genevois français, grandes
      métropoles comme Lyon, Marseille, Bordeaux, Toulouse ou Nantes.
    </li>
    <li>
      <b>Zone B1 :</b>
      agglomérations de plus de 250 000 habitants, grande couronne parisienne, Outre-Mer,
      Corse et certaines villes à prix élevés.
    </li>
    <li>
      <b>Zone B2 :</b>
      agglomérations de plus de 50 000 habitants, zones littorales ou frontalières.
    </li>
    <li>
      <b>Zone C :</b>
      reste du territoire.
    </li>
  </ul>
  <p>
    🔍 Vous ne savez pas dans quelle zone se situe votre commune ? Consultez le
    <a
      href="https://www.service-public.fr/simulateur/calcul/zonage-abc"
      class="fr-link">
      simulateur officiel de Service-Public.fr
    </a>
    .
  </p>

  <h2 class="fr-mt-8w">
    Plafonds de revenus BRS 2026 en vigueur depuis le 1er janvier 2026
  </h2>
  <p>
    Les revenus fiscaux de référence du ménage ne doivent pas dépasser les
    montants suivants :
  </p>
  <div class="fr-table fr-table--bordered">
    <table>
      <caption>Plafonds de revenus BRS 2026</caption>
      <thead>
        <tr>
          <th scope="col">Catégorie de ménage</th>
          <th scope="col">Zone A et Abis</th>
          <th scope="col">Zone B1</th>
          <th scope="col">Zone B2 et C</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Cat. 1 - 1 personne seule</th>
          <td>38 844 €</td>
          <td>38 844 €</td>
          <td>33 771 €</td>
        </tr>
        <tr>
          <th scope="row">
            Cat. 2 - 2 personnes sans personne à charge hors jeune ménage, ou 1
            personne seule en situation de handicap
          </th>
          <td>58 057 €</td>
          <td>58 057 €</td>
          <td>45 100 €</td>
        </tr>
        <tr>
          <th scope="row">
            Cat. 3 - 3 personnes, ou 1 personne seule + 1 à charge, ou jeune
            ménage, ou 2 personnes dont au moins 1 en situation de handicap
          </th>
          <td>76 105 €</td>
          <td>69 786 €</td>
          <td>54 235 €</td>
        </tr>
        <tr>
          <th scope="row">
            Cat. 4 - 4 personnes, ou 1 personne seule + 2 à charge, ou 3
            personnes dont au moins 1 en situation de handicap
          </th>
          <td>90 863 €</td>
          <td>83 594 €</td>
          <td>65 476 €</td>
        </tr>
        <tr>
          <th scope="row">
            Cat. 5 - 5 personnes, ou 1 personne + 3 à charge, ou 4 personnes
            dont au moins 1 en situation de handicap
          </th>
          <td>108 107 €</td>
          <td>98 956 €</td>
          <td>77 023 €</td>
        </tr>
        <tr>
          <th scope="row">
            Cat. 6 - 6 personnes, ou 1 personne + 4 à charge, ou 5 personnes
            dont au moins 1 en situation de handicap
          </th>
          <td>121 650 €</td>
          <td>111 359 €</td>
          <td>86 805 €</td>
        </tr>
        <tr>
          <th scope="row">Personne supplémentaire</th>
          <td>+ 13 557 €</td>
          <td>+ 12 408 €</td>
          <td>+ 9 683 €</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p>
    Source : <a
      href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000437021/2025-02-12/"
      class="fr-link"
      target="_blank"
      rel="noopener noreferrer">
      Textes de référence sur Légifrance
    </a>
    — plafonds en vigueur depuis janvier 2026.
  </p>
  <p>
    💡 <b>Qu'est-ce qu'un jeune ménage ?</b>
    Depuis 2024, un jeune ménage est défini comme un couple marié, en concubinage
    ou pacsé, dont
    <b>la somme des âges ne dépasse pas 55 ans.</b>
  </p>

  <h2 class="fr-mt-8w">Comparaison plafonds BRS 2025 vs 2026</h2>
  <p>
    Les plafonds sont revalorisés chaque année. Voici l'évolution entre 2025 et
    2026 :
  </p>
  <div class="fr-table fr-table--bordered">
    <table>
      <caption>Comparaison des plafonds BRS 2025 et 2026</caption>
      <thead>
        <tr>
          <th scope="col">Catégorie</th>
          <th scope="col">Zone A/Abis 2025</th>
          <th scope="col">Zone A/Abis 2026</th>
          <th scope="col">Évolution</th>
          <th scope="col">Zone B1 2025</th>
          <th scope="col">Zone B1 2026</th>
          <th scope="col">Évolution</th>
          <th scope="col">Zone B2/C 2025</th>
          <th scope="col">Zone B2/C 2026</th>
          <th scope="col">Évolution</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Cat. 1</th>
          <td>38 508 €</td>
          <td>38 844 €</td>
          <td>+336 €</td>
          <td>38 508 €</td>
          <td>38 844 €</td>
          <td>+336 €</td>
          <td>33 479 €</td>
          <td>33 771 €</td>
          <td>+292 €</td>
        </tr>
        <tr>
          <th scope="row">Cat. 2</th>
          <td>57 555 €</td>
          <td>58 057 €</td>
          <td>+502 €</td>
          <td>57 555 €</td>
          <td>58 057 €</td>
          <td>+502 €</td>
          <td>44 710 €</td>
          <td>45 100 €</td>
          <td>+390 €</td>
        </tr>
        <tr>
          <th scope="row">Cat. 3</th>
          <td>75 447 €</td>
          <td>76 105 €</td>
          <td>+658 €</td>
          <td>69 183 €</td>
          <td>69 786 €</td>
          <td>+603 €</td>
          <td>53 766 €</td>
          <td>54 235 €</td>
          <td>+469 €</td>
        </tr>
        <tr>
          <th scope="row">Cat. 4</th>
          <td>90 078 €</td>
          <td>90 863 €</td>
          <td>+785 €</td>
          <td>82 871 €</td>
          <td>83 594 €</td>
          <td>+723 €</td>
          <td>64 910 €</td>
          <td>65 476 €</td>
          <td>+566 €</td>
        </tr>
        <tr>
          <th scope="row">Cat. 5</th>
          <td>107 173 €</td>
          <td>108 107 €</td>
          <td>+934 €</td>
          <td>98 101 €</td>
          <td>98 956 €</td>
          <td>+855 €</td>
          <td>76 357 €</td>
          <td>77 023 €</td>
          <td>+666 €</td>
        </tr>
        <tr>
          <th scope="row">Cat. 6</th>
          <td>120 598 €</td>
          <td>121 650 €</td>
          <td>+1 052 €</td>
          <td>110 396 €</td>
          <td>111 359 €</td>
          <td>+963 €</td>
          <td>86 055 €</td>
          <td>86 805 €</td>
          <td>+750 €</td>
        </tr>
        <tr>
          <th scope="row">Pers. suppl.</th>
          <td>13 440 €</td>
          <td>13 557 €</td>
          <td>+117 €</td>
          <td>12 301 €</td>
          <td>12 408 €</td>
          <td>+107 €</td>
          <td>9 599 €</td>
          <td>9 683 €</td>
          <td>+84 €</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p>
    La revalorisation 2026 représente en moyenne +0,9 % par rapport aux plafonds
    2025, en cohérence avec l'évolution de l'indice de référence des loyers.
  </p>

  <h2 class="fr-mt-8w">Comment vérifier votre éligibilité au BRS en 2026 ?</h2>
  <h3>Étape 1 - Identifiez votre catégorie de ménage</h3>
  <p>
    Comptez le nombre de personnes qui occuperont le logement : vous, votre
    conjoint ou conjointe, vos enfants à charge et toute personne en situation
    de handicap. Reportez-vous ensuite au tableau ci-dessus pour identifier
    votre catégorie.
  </p>
  <h3>Étape 2 - Trouvez votre zone géographique</h3>
  <p>
    Utilisez le <a
      class="fr-link"
      href="https://www.service-public.fr/simulateur/calcul/zonage-abc"
      target="_blank"
      rel="noopener noreferrer">
      simulateur de zonage ABC de Service-Public.fr
    </a>
    pour connaître la zone de votre commune ou de la commune où vous souhaitez acheter.
  </p>
  <h3>Étape 3 - Retrouvez votre Revenu Fiscal de Référence</h3>
  <p>
    Munissez-vous de votre <b>avis d'imposition 2025</b>
    sur les revenus 2024. Le Revenu Fiscal de Référence (RFR) figure en bas de la
    première page de ce document. C'est ce montant, et non votre salaire brut, qui
    est comparé au plafond BRS.
  </p>
  <h3>Étape 4 - Comparez et simulez</h3>
  <p>
    Si votre RFR est inférieur au plafond correspondant à votre catégorie et à
    votre zone, <b>vous êtes potentiellement éligible au BRS.</b>
  </p>
  <p>
    ✅ Le plus simple : utilisez directement le
    <a
      href="/simulateur-eligibilite"
      class="fr-link">
      simulateur d'éligibilité BoRiS
    </a>
    pour obtenir une réponse personnalisée en quelques clics.
  </p>

  <h2 class="fr-mt-8w">Cas particuliers à connaître</h2>
  <p>
    <strong>Situation de handicap.</strong>
    Les ménages comportant une ou plusieurs personnes en situation de handicap bénéficient
    d'une catégorie de ménage plus favorable, ce qui élève leur plafond de revenus
    applicable.
  </p>
  <p>
    <strong>Jeune ménage.</strong>
    Un couple dont la somme des âges ne dépasse pas 55 ans est classé en catégorie
    3 même sans personne à charge, ce qui lui permet d'accéder à un plafond plus
    élevé que deux personnes sans enfant.
  </p>
  <p>
    <strong>Personne supplémentaire.</strong>
    Au-delà de la catégorie 6, chaque personne supplémentaire dans le foyer ouvre
    droit à une majoration du plafond : + 13 557 € en zone A/Abis, + 12 408 € en
    zone B1, + 9 683 € en zone B2/C.
  </p>
  <p>
    <strong>Revenus fluctuants.</strong>
    Si vos revenus N-2 sont inhabituellement élevés, par exemple après une période
    de chômage ou un changement de situation, signalez-le à l'OFS : certains peuvent
    tenir compte de votre situation actuelle.
  </p>

  <h2 class="fr-mt-8w">Plafonds de revenus BRS 2026 : ce qu'il faut retenir</h2>
  <p>
    Le BRS est accessible à une large majorité des ménages français. Pour
    résumer :
  </p>
  <ul>
    <li>
      Les plafonds 2026 sont en vigueur <b>depuis le 1er janvier 2026.</b>
    </li>
    <li>
      Le revenu à déclarer est le <b>RFR 2024</b>
      , disponible sur l'avis d'imposition 2025.
    </li>
    <li>
      Les plafonds varient selon votre <b>composition familiale</b>
      et votre
      <b>zone géographique</b>
      .
    </li>
    <li>
      La revalorisation 2026 est de <b>+0,9 %</b>
      par rapport à 2025.
    </li>
  </ul>
  <p>
    En cas de doute, le <a
      href="/simulateur-eligibilite"
      class="fr-link">
      simulateur BoRiS
    </a>
    vous donne une réponse immédiate et gratuite.
  </p>

  <h2 class="fr-mt-8w">
    Questions fréquentes sur les plafonds de revenus BRS 2026
  </h2>
  <p class="fr-text--bold !mb-0">
    Quels sont les plafonds de revenus BRS en 2026 ?
  </p>
  <p>
    En 2026, le plafond pour une personne seule est de 38 844 € en zone A/Abis
    et de 33 771 € en zone B2/C. Pour un couple sans enfant, il est de 58 057 €
    en zone A/Abis et de 45 100 € en zone B2/C. Consultez le tableau complet
    ci-dessus pour votre situation.
  </p>
  <p class="fr-text--bold !mb-0">
    Les plafonds BRS sont-ils les mêmes que les plafonds PTZ ?
  </p>
  <p>
    Non. Les plafonds BRS sont alignés sur ceux du PSLA, le Prêt Social
    Location-Accession, qui sont différents des plafonds PTZ. Le BRS est
    cependant cumulable avec le PTZ, ce qui peut optimiser significativement
    votre plan de financement.
  </p>
  <p class="fr-text--bold !mb-0">
    Que se passe-t-il si mes revenus dépassent légèrement le plafond ?
  </p>
  <p>
    Si votre RFR dépasse le plafond applicable, vous n'êtes pas éligible au BRS
    pour cette année. Les plafonds étant réévalués chaque année, votre situation
    peut évoluer. Contactez directement un OFS pour évaluer vos options.
  </p>
  <p class="fr-text--bold !mb-0">
    Les plafonds BRS sont-ils les mêmes dans toute la France ?
  </p>
  <p>
    Non. Ils varient selon la zone de tension immobilière : A/Abis, B1 ou B2/C.
    Chaque OFS peut également appliquer des critères complémentaires de
    sélection dans le respect du cadre national.
  </p>
  <p class="fr-text--bold !mb-0">
    Le revenu à déclarer est-il le salaire net ou le revenu fiscal de référence
    ?
  </p>
  <p>
    C'est le Revenu Fiscal de Référence (RFR), pas le salaire net. Ce montant
    figure sur votre avis d'imposition et tient compte de certains abattements.
    Il est généralement inférieur à votre revenu brut annuel.
  </p>
  <p class="fr-text--bold !mb-0">
    Les plafonds BRS changent-ils chaque année ?
  </p>
  <p>
    Oui. Ils sont révisés au 1er janvier de chaque année en fonction de
    l'évolution de l'indice de référence des loyers. La revalorisation entre
    2025 et 2026 est de +0,9 %.
  </p>

  <p class="fr-mt-8w">
    Sources :
    <a
      href="/simulateur-eligibilite"
      class="fr-link">
      simulateur d'éligibilité BoRiS
    </a>
    et textes de référence PSLA sur Légifrance.
  </p>
  <p>
    Cet article est fourni à titre informatif. Les plafonds officiels font foi.
    En cas de doute sur votre éligibilité, rapprochez-vous de l'OFS gestionnaire
    du programme qui vous intéresse ou utilisez le simulateur BoRiS.
  </p>
</ArticlePage>

<script>
  const axes = [
    {
      id: 'axe-utilisable',
      key: 'utilisable',
      title: 'Utilisable',
      lead: '86,9 %',
      sub: "obtiennent leur résultat de simulation d'éligibilité",
    },
    {
      id: 'axe-utilise',
      key: 'utilise',
      title: 'Utilisé',
      lead: '7 002',
      sub: "simulations d'éligibilité en avril 2026, x 6,8 par rapport à avril 2025",
    },
    {
      id: 'axe-utile',
      key: 'utile',
      title: 'Utile',
      lead: '4,5 / 5',
      sub: 'satisfaction utilisateur post-simulateur, mars 2026',
    },
    {
      id: 'axe-impactant',
      key: 'impactant',
      title: 'Impactant',
      lead: '150',
      sub: "ménages avec un projet d'achat en BRS en 2025",
    },
    {
      id: 'axe-efficient',
      key: 'efficient',
      title: 'Efficient',
      lead: '18,23 €',
      sub: 'coût par simulation en 2025, 7,91 € sur janvier-avril 2026',
    },
  ];

  const usedKpis = [
    {
      value: '11 000',
      label: 'Visiteurs uniques · avril 2026',
      trend: 'x 1,8 par rapport à avril 2025',
    },
    {
      value: '7 002',
      label: "Simulations d'éligibilité · avril 2026",
      trend: 'x 6,8 par rapport à avril 2025',
    },
    {
      value: '164',
      label:
        "OFS partenaires · avril 2026, dont l'intégralité des OFS producteurs de BRS",
    },
    {
      value: '87 %',
      label: 'de ménages éligibles aux plafonds BRS',
    },
  ];

  const notes = [
    {
      id: 'note-1',
      title: 'Note 1 - Ne connaissait pas le BRS : 70 %',
      content:
        "Question posée en sortie de simulateur : Avant de visiter BoRiS, aviez-vous entendu parler du BRS ? Réponse Non. Base : 8 597 ménages ayant répondu à l'enquête depuis sa mise en place. Source : page transparence boris.beta.gouv.fr/statistiques.",
    },
    {
      id: 'note-2',
      title: 'Note 2 - Ménages avec projet BRS en 2025 : 150',
      content:
        "150 ménages avec projet d'achat en BRS, à partir d'une enquête auprès de 110 répondants en novembre 2025. Méthodologie d'extrapolation à expliciter dans la prochaine version.",
    },
    {
      id: 'note-3',
      title: 'Note 3 - Funnels simulateurs',
      content:
        'Données mesurées sur les 30 derniers jours en avril 2026, accédées le 30/04/2026 sur la page transparence boris.beta.gouv.fr/statistiques.',
    },
    {
      id: 'note-4',
      title: 'Note 4 - Taux de contact support',
      content:
        'Mesure directe sur le formulaire de contact, mars 2026. Calcul : environ 10 messages divisé par 8 300 visiteurs uniques en mars 2026, soit environ 0,12 %.',
    },
    {
      id: 'note-5',
      title: 'Note 5 - Marché cible : 87 %',
      content: 'Source : fiche officielle beta.gouv.fr/startups/boris.html.',
    },
    {
      id: 'note-6',
      title: 'Note 6 - Marché prioritaire : 150 000 locataires HLM',
      content:
        'Locataires HLM assujettis au surloyer de solidarité. Source : fiche officielle beta.gouv.fr/startups/boris.html.',
    },
    {
      id: 'note-7',
      title: 'Note 7 - Volume secteur BRS',
      content:
        '2022 et 2023 : DHUP, Bilan national OFS/BRS 2023. 2024 : estimation indicative en attente de publication. A recalculer une fois le volume secteur 2025 consolidé.',
    },
    {
      id: 'note-8',
      title: 'Note 8 - Satisfaction : 4,5 / 5',
      content:
        'Question post-simulateur sur échelle 1-5, mars 2026. Taille du panel à préciser.',
    },
    {
      id: 'note-9',
      title: 'Note 9 - Problèmes utilisateurs résolus',
      content:
        "Mesuré par entretiens qualitatifs UX réalisés en février 2026. Pour chaque problème, la réponse BoRiS est associée à un indicateur quantitatif d'usage récent lorsqu'il existe.",
    },
    {
      id: 'note-10',
      title: 'Note 10 - Statut résidentiel des ménages',
      content:
        "Question : Vous êtes actuellement... avec choix multiple. Même panel que la note 1, n = 8 597 répondants à l'enquête post-simulateur.",
    },
    {
      id: 'note-11',
      title: "Note 11 - Coûts à l'utilisation 2025",
      content:
        'Tous les coûts sont calculés en flux annuel. Le coût par simulation est calculable directement : 278 063 € divisé par 15 252 simulations en 2025.',
    },
    {
      id: 'note-12',
      title: 'Note 12 - Économie pour le ménage',
      content:
        "Économie BRS structurelle de 30 à 50 % sur le prix d'acquisition, soit 50 à 150 k€ selon la zone tendue. Estimation indicative, variable selon la zone, le programme et le profil du ménage.",
    },
  ];
</script>

<svelte:head>
  <title>Matrice d'impact - BoRiS - Avril 2026</title>
  <meta
    name="description"
    content="Matrice d'impact du service public numérique BoRiS : usage, utilité, impact et efficience du Bail Réel Solidaire." />
</svelte:head>

<div
  class="bg-[linear-gradient(180deg,rgba(245,245,254,0.75)_0,rgba(255,255,255,0)_24rem),var(--background-default-grey)]">
  <section class="fr-container fr-mt-4w fr-mb-6w">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-8">
        <p class="fr-badges-group">
          <span class="fr-badge fr-badge--success fr-badge--no-icon">
            Phase Accélération
          </span>
          <span class="fr-badge fr-badge--info fr-badge--no-icon">
            Mise à jour avril 2026
          </span>
          <span class="fr-badge fr-badge--new fr-badge--no-icon">
            Version 3
          </span>
        </p>
        <h1 class="fr-display--xs fr-mt-2w">Matrice d'impact - BoRiS</h1>
        <p class="fr-text--lead fr-mt-2w">
          Mesure d'usage, d'utilité, d'impact et d'efficience du service public
          numérique BoRiS, conformément au modèle beta.gouv.fr d'évaluation des
          services numériques publics.
        </p>

        <dl
          class="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-t border-[var(--border-default-grey)] pt-4 text-[0.95rem]">
          <div>
            <dt class="inline font-bold text-[var(--text-mention-grey)]">
              Date de l'analyse :
            </dt>
            <dd class="m-0 inline">avril 2026</dd>
          </div>
          <div>
            <dt class="inline font-bold text-[var(--text-mention-grey)]">
              Périmètre temporel :
            </dt>
            <dd class="m-0 inline">2023 - avril 2026</dd>
          </div>
          <div>
            <dt class="inline font-bold text-[var(--text-mention-grey)]">
              Phase :
            </dt>
            <dd class="m-0 inline">
              Investigation 2023 · Accélération depuis sept. 2024
            </dd>
          </div>
        </dl>
      </div>

      <div class="fr-col-12 fr-col-md-4">
        <div class="fr-callout fr-callout--brown-caramel">
          <p class="fr-callout__title fr-text--md">Sources de données</p>
          <p class="fr-callout__text fr-text--sm">
            Toutes les mesures sont issues de la
            <a
              href="/statistiques"
              class="fr-link">
              page transparence BoRiS
            </a>
            , de la fiche officielle
            <a
              href="https://beta.gouv.fr/startups/boris.html"
              class="fr-link">
              beta.gouv.fr/startups/boris
            </a>
            , des données de navigation collectées via le site, et d'enquêtes utilisateurs
            en sortie de simulateur.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section
    class="fr-container fr-mb-6w"
    id="contexte">
    <h2 class="fr-h3">Contexte</h2>
    <div class="fr-mt-3w grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="min-h-56 bg-[var(--background-alt-grey)] p-6">
        <p
          class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
          Service
        </p>
        <p>
          BoRiS est un site d'information et de mise en relation qui aide les
          ménages modestes à comprendre et accéder au
          <strong>Bail Réel Solidaire (BRS)</strong>
          .
        </p>
      </div>
      <div class="min-h-56 bg-[var(--background-alt-grey)] p-6">
        <p
          class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
          Irritant utilisateur
        </p>
        <p>
          Les ménages éligibles au BRS ignorent l'existence du dispositif ou
          n'ont pas accès à une information fiable pour décider d'acheter.
        </p>
        <p class="mt-2 text-[0.95rem] text-[var(--text-default-grey)]">
          <strong>70 %</strong>
          des ménages ayant répondu à l'enquête post-simulateur n'avaient jamais
          entendu parler du BRS avant de visiter le site
          <a
            href="#note-1"
            class="align-super text-xs font-semibold text-[var(--text-action-high-blue-france)] no-underline hover:underline">
            [1]
          </a>
          .
        </p>
      </div>
      <div class="min-h-56 bg-[var(--background-alt-grey)] p-6">
        <p
          class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
          Politique publique
        </p>
        <p>
          Développement du <strong>Bail Réel Solidaire</strong>
          pour faciliter l'accès à la propriété des ménages modestes en dissociant
          le foncier du bâti.
        </p>
      </div>
      <div class="min-h-56 bg-[var(--background-alt-grey)] p-6">
        <p
          class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
          Cible prioritaire
        </p>
        <p>
          Ménages dont les revenus sont insuffisants pour acheter dans le libre
          en zone tendue, mais suffisants pour être acquéreurs en BRS, en
          particulier <strong>
            locataires HLM soumis au surloyer de solidarité
          </strong>
          .
        </p>
      </div>
    </div>
  </section>

  <section
    class="fr-container fr-mb-6w"
    id="vue-synthetique">
    <h2 class="fr-h3">Vue synthétique de la matrice</h2>
    <p class="fr-text--lg fr-mb-3w">
      Quatre dimensions d'évaluation du service, plus une dimension transverse
      d'efficience.
    </p>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {#each axes as axis}
        <a
          href={`#${axis.id}`}
          class={`flex min-h-0 flex-col gap-2 border-t-4 bg-[var(--background-default-grey)] p-5 no-underline shadow-[inset_0_0_0_1px_var(--border-default-grey)] transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-52 ${
            axis.key === 'utilisable'
              ? 'border-t-[#009099]'
              : axis.key === 'utilise'
                ? 'border-t-[#6a6af4]'
                : axis.key === 'utile'
                  ? 'border-t-[#c08c65]'
                  : axis.key === 'impactant'
                    ? 'border-t-[#00a95f]'
                    : 'border-t-[#ff9940]'
          }`}
          data-axis={axis.key}>
          <span
            class="text-base font-bold uppercase text-[var(--text-title-grey)]">
            {axis.title}
          </span>
          <span
            class="my-1 text-[1.75rem] font-bold leading-tight text-[var(--text-title-blue-france)]">
            {axis.lead}
          </span>
          <span class="text-sm text-[var(--text-mention-grey)]">
            {axis.sub}
          </span>
        </a>
      {/each}
    </div>
  </section>

  <section
    class="fr-container scroll-mt-24 pt-8"
    data-axis="utilisable"
    id="axe-utilisable">
    <header
      class="mb-6 flex flex-wrap items-baseline gap-4 border-b-2 border-b-[#009099] pb-3">
      <span
        class="rounded-[2px] bg-[#006a6f] px-2.5 py-1 text-xs font-bold uppercase text-white">
        Utilisable
      </span>
      <h2 class="fr-h3 !m-0">1. Utilisable</h2>
    </header>

    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-6">
        <div class="mb-4 bg-[var(--background-alt-grey)] p-6">
          <p
            class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
            Funnel - simulateur d'éligibilité (avril 2026)
          </p>
          <p
            class="text-2xl font-bold leading-tight text-[var(--text-title-blue-france)]">
            86,86 % obtiennent leur résultat
          </p>
          <p class="mt-2 text-[0.95rem] text-[var(--text-default-grey)]">
            Soit 7 797 résultats sur 8 976 démarrages mesurés sur les 30
            derniers jours
            <a
              href="#note-3"
              class="align-super text-xs font-semibold text-[var(--text-action-high-blue-france)] no-underline hover:underline">
              [3]
            </a>
            .
          </p>
          <p class="mt-2 text-[0.95rem] text-[var(--text-default-grey)]">
            <strong>22,52 %</strong>
            donnent ensuite leurs coordonnées pour mise en relation avec un OFS,
            soit 2 021 ménages.
          </p>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6">
        <div class="mb-4 bg-[var(--background-alt-grey)] p-6">
          <p
            class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
            Funnel - simulateur de coût d'acquisition (avril 2026)
          </p>
          <p class="mt-2 text-[0.95rem] text-[var(--text-default-grey)]">
            Base : 2 947 démarrages sur les 30 derniers jours
            <a
              href="#note-3"
              class="align-super text-xs font-semibold text-[var(--text-action-high-blue-france)] no-underline hover:underline">
              [3]
            </a>
            .
          </p>
          <ul class="fr-mt-1w">
            <li>
              <strong>96,3 %</strong>
              obtiennent le résultat du coût total de leur projet
            </li>
            <li>
              <strong>79,2 %</strong>
              obtiennent le montant de leur mensualité post-achat
            </li>
            <li>
              <strong>64,7 %</strong>
              obtiennent le détail des charges mensuelles
            </li>
          </ul>
        </div>
      </div>
      <div class="fr-col-12">
        <div class="mb-4 bg-[var(--background-alt-grey)] p-6">
          <p
            class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
            Taux de contact du support
          </p>
          <p
            class="text-2xl font-bold leading-tight text-[var(--text-title-blue-france)]">
            ~ 0,12 %
          </p>
          <p class="mt-2 text-[0.95rem] text-[var(--text-default-grey)]">
            Environ 10 messages reçus en mars 2026 sur 8 300 visiteurs uniques
            mensuels
            <a
              href="#note-4"
              class="align-super text-xs font-semibold text-[var(--text-action-high-blue-france)] no-underline hover:underline">
              [4]
            </a>
            . Le service répond seul aux questions des utilisateurs ; pas de support
            formel.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section
    class="fr-container scroll-mt-24 pt-8"
    data-axis="utilise"
    id="axe-utilise">
    <header
      class="mb-6 flex flex-wrap items-baseline gap-4 border-b-2 border-b-[#6a6af4] pb-3">
      <span
        class="rounded-[2px] bg-[#5555d8] px-2.5 py-1 text-xs font-bold uppercase text-white">
        Utilisé
      </span>
      <h2 class="fr-h3 !m-0">2. Utilisé</h2>
    </header>

    <div class="fr-mb-3w grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {#each usedKpis as kpi}
        <div
          class="border-l-[3px] border-l-[var(--text-active-blue-france)] bg-[var(--background-alt-blue-france)] p-5">
          <span
            class="block text-[2rem] font-bold leading-none text-[var(--text-active-blue-france)]">
            {kpi.value}
          </span>
          <span class="mt-2 block text-sm text-[var(--text-mention-grey)]">
            {kpi.label}
          </span>
          {#if kpi.trend}
            <span
              class="mt-2 block text-sm font-semibold text-[var(--text-default-success)]">
              {kpi.trend}
            </span>
          {/if}
        </div>
      {/each}
    </div>

    <h3 class="fr-h5 fr-mt-3w">Visiteurs uniques mensuels</h3>
    <div class="fr-table fr-table--bordered">
      <table>
        <caption class="fr-sr-only">
          Évolution des visiteurs uniques mensuels
        </caption>
        <thead>
          <tr>
            <th scope="col">Période</th>
            <th scope="col">Visiteurs uniques</th>
            <th scope="col">Évolution</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Avril 2026</th>
            <td><strong>11 000</strong></td>
            <td>-</td>
          </tr>
          <tr>
            <th scope="row">Mars 2026</th>
            <td>8 300</td>
            <td>-</td>
          </tr>
          <tr>
            <th scope="row">Avril 2025</th>
            <td>6 200</td>
            <td>-</td>
          </tr>
          <tr>
            <th scope="row">Avril 2026 vs avril 2025</th>
            <td colspan="2"><strong>x 1,8</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="fr-h5 fr-mt-4w">
      Simulations d'éligibilité - flux mensuel récent
    </h3>
    <div class="fr-table fr-table--bordered">
      <table>
        <caption class="fr-sr-only">
          Évolution des simulations d'éligibilité par mois
        </caption>
        <thead>
          <tr>
            <th scope="col">Période</th>
            <th scope="col">Simulations</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Avril 2026</th>
            <td><strong>7 002</strong></td>
          </tr>
          <tr>
            <th scope="row">Mars 2026</th>
            <td>5 426</td>
          </tr>
          <tr>
            <th scope="row">Février 2026</th>
            <td>1 960</td>
          </tr>
          <tr>
            <th scope="row">Janvier 2026</th>
            <td>1 959</td>
          </tr>
          <tr>
            <th scope="row">Avril 2025</th>
            <td>1 029</td>
          </tr>
          <tr>
            <th scope="row">Mars 2025</th>
            <td>1 057</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="fr-callout fr-callout--blue-cumulus fr-mt-2w">
      <p class="fr-callout__title">Bond marqué entre février et mars 2026</p>
      <p class="fr-callout__text">
        Le passage de 1 960 à 5 426 simulations s'explique par le lancement
        d'une nouvelle version du simulateur d'éligibilité, plus accessible.
      </p>
    </div>

    <h3 class="fr-h5 fr-mt-4w">Volumes annuels</h3>
    <div class="fr-table fr-table--bordered">
      <table>
        <caption class="fr-sr-only">Volumes annuels de simulations</caption>
        <thead>
          <tr>
            <th scope="col">Année</th>
            <th scope="col">Simulations</th>
            <th scope="col">Note</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">2026 (janvier-avril)</th>
            <td><strong>16 347</strong></td>
            <td>Dépasse déjà tout 2025</td>
          </tr>
          <tr>
            <th scope="row">2025</th>
            <td>15 252</td>
            <td>-</td>
          </tr>
          <tr>
            <th scope="row">2024 (mars-décembre)</th>
            <td>3 460</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="fr-callout fr-mt-4w">
      <p class="fr-callout__title">Marché prioritaire haute valeur</p>
      <p class="fr-callout__text">
        <strong>150 000</strong>
        locataires HLM assujettis au surloyer de solidarité
        <a
          href="#note-6"
          class="align-super text-xs font-semibold text-[var(--text-action-high-blue-france)] no-underline hover:underline">
          [6]
        </a>
        . Le marché adressable réel est contraint par la géographie des OFS actifs
        et la disponibilité des programmes.
      </p>
    </div>
  </section>

  <section
    class="fr-container scroll-mt-24 pt-8"
    data-axis="utile"
    id="axe-utile">
    <header
      class="mb-6 flex flex-wrap items-baseline gap-4 border-b-2 border-b-[#c08c65] pb-3">
      <span
        class="rounded-[2px] bg-[#7b5a3e] px-2.5 py-1 text-xs font-bold uppercase text-white">
        Utile
      </span>
      <h2 class="fr-h3 !m-0">3. Utile</h2>
    </header>

    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3w">
      <div class="fr-col-12 fr-col-md-6">
        <div class="mb-4 bg-[var(--background-alt-grey)] p-6">
          <p
            class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
            Satisfaction utilisateur
          </p>
          <p
            class="text-2xl font-bold leading-tight text-[var(--text-title-blue-france)]">
            4,5 / 5
            <a
              href="#note-8"
              class="align-super text-xs font-semibold text-[var(--text-action-high-blue-france)] no-underline hover:underline">
              [8]
            </a>
          </p>
          <p class="mt-2 text-[0.95rem] text-[var(--text-default-grey)]">
            Panel post-simulateur, mars 2026. Taille du panel à préciser.
          </p>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6">
        <div class="mb-4 bg-[var(--background-alt-grey)] p-6">
          <p
            class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
            Net Promoter Score (NPS)
          </p>
          <p
            class="text-2xl font-bold leading-tight text-[var(--text-title-blue-france)]">
            À mettre en place
          </p>
          <p class="mt-2 text-[0.95rem] text-[var(--text-default-grey)]">
            Évolution prévue : ajouter en fin de simulateur la question de
            recommandation sur une échelle de 0 à 10, avec une cible NPS > 50.
          </p>
        </div>
      </div>
    </div>

    <h3 class="fr-h5">Problèmes utilisateurs résolus</h3>
    <div class="fr-table fr-table--bordered">
      <table>
        <caption class="fr-sr-only">
          Problèmes utilisateurs et réponses BoRiS
        </caption>
        <thead>
          <tr>
            <th scope="col">Problème exprimé</th>
            <th scope="col">Réponse BoRiS</th>
            <th scope="col">Indicateurs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Suis-je éligible au BRS ?</th>
            <td>Simulateur d'éligibilité</td>
            <td>7 002 simulations · avril 2026</td>
          </tr>
          <tr>
            <th scope="row">Où trouver un logement BRS dans ma zone ?</th>
            <td>Carte des programmes</td>
            <td>~4 200 visiteurs / mois en moyenne en 2025</td>
          </tr>
          <tr>
            <th scope="row">Comment se déroule un achat BRS ?</th>
            <td>Contenus informatifs</td>
            <td>-</td>
          </tr>
          <tr>
            <th scope="row">Comment planifier mon budget ?</th>
            <td>Simulateur de coût d'acquisition</td>
            <td>1 908 simulations complètes · avril 2026</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section
    class="fr-container scroll-mt-24 pt-8"
    data-axis="impactant"
    id="axe-impactant">
    <header
      class="mb-6 flex flex-wrap items-baseline gap-4 border-b-2 border-b-[#00a95f] pb-3">
      <span
        class="rounded-[2px] bg-[#18753c] px-2.5 py-1 text-xs font-bold uppercase text-white">
        Impactant
      </span>
      <h2 class="fr-h3 !m-0">4. Impactant</h2>
    </header>

    <div
      class="fr-mb-3w mb-4 border-l-4 border-l-[var(--text-default-success)] bg-[var(--background-contrast-green-emeraude)] p-6">
      <p
        class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
        Impact mesuré - 2025
      </p>
      <p
        class="text-2xl font-bold leading-tight text-[var(--text-default-success)]">
        150 ménages avec un projet d'achat en BRS grâce à BoRiS
        <a
          href="#note-2"
          class="align-super text-xs font-semibold text-[var(--text-action-high-blue-france)] no-underline hover:underline">
          [2]
        </a>
      </p>
      <p class="mt-2 text-[0.95rem] text-[var(--text-default-grey)]">
        Estimation à partir d'une enquête auprès de 110 répondants en novembre
        2025.
      </p>
    </div>

    <h3 class="fr-h5">Mise en perspective : volume secteur BRS</h3>
    <div class="fr-table fr-table--bordered">
      <table>
        <caption class="fr-sr-only">
          Volume secteur BRS - livraisons annuelles
        </caption>
        <thead>
          <tr>
            <th scope="col">Année</th>
            <th scope="col">Livraisons BRS</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">2022</th>
            <td>652</td>
            <td>DHUP, Bilan national OFS/BRS 2023</td>
          </tr>
          <tr>
            <th scope="row">2023</th>
            <td>1 107</td>
            <td>DHUP, Bilan national OFS/BRS 2023</td>
          </tr>
          <tr>
            <th scope="row">2024</th>
            <td>~1 700, estimation</td>
            <td>En attente du Bilan national OFS/BRS 2024</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="fr-h5 fr-mt-4w">
      Caractéristiques des ménages transmis aux OFS
    </h3>
    <p class="fr-text--sm fr-mb-2w">
      Panel n = 8 597 répondants à l'enquête post-simulateur.
    </p>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3w">
      <div class="fr-col-12 fr-col-md-6">
        <div class="mb-4 bg-[var(--background-contrast-green-emeraude)] p-6">
          <p
            class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
            Connaissance préalable du BRS
          </p>
          <p
            class="text-2xl font-bold leading-tight text-[var(--text-default-success)]">
            70 % ne connaissaient pas le BRS
          </p>
          <p class="mt-2 text-[0.95rem] text-[var(--text-default-grey)]">
            avant de visiter BoRiS, preuve directe de l'apport informationnel du
            service.
          </p>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6">
        <div class="mb-4 bg-[var(--background-alt-grey)] p-6">
          <p
            class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
            Statut résidentiel
          </p>
          <ul>
            <li>
              <strong>28 %</strong>
              locataires d'un logement social
            </li>
            <li>47 % locataires du privé</li>
            <li>17 % hébergés</li>
            <li>6 % propriétaires</li>
            <li>2 % autre</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="fr-callout fr-mb-3w">
      <p class="fr-callout__title">
        Suivi longitudinal en cours de mise en place
      </p>
      <p class="fr-callout__text">
        Les OFS partenaires s'engagent à remonter le nombre de contacts BoRiS
        ayant effectivement signé un contrat BRS.
      </p>
    </div>

    <div class="mb-4 bg-[var(--background-alt-grey)] p-6">
      <p>
        Au-delà des mises en relation, l'impact informationnel est très
        important : BoRiS joue un rôle de référence dans le parcours
        d'information sur le BRS et produit des données de demande
        territorialisées utiles à l'administration centrale, aux OFS et aux
        banques.
      </p>
    </div>
  </section>

  <section
    class="fr-container scroll-mt-24 pt-8"
    data-axis="efficient"
    id="axe-efficient">
    <header
      class="mb-6 flex flex-wrap items-baseline gap-4 border-b-2 border-b-[#ff9940] pb-3">
      <span
        class="rounded-[2px] bg-[#8d5330] px-2.5 py-1 text-xs font-bold uppercase text-white">
        Efficient
      </span>
      <h2 class="fr-h3 !m-0">5. Efficient</h2>
    </header>

    <h3 class="fr-h5">Budget exécuté par année</h3>
    <div class="fr-table fr-table--bordered">
      <table>
        <caption class="fr-sr-only">Budget exécuté par année</caption>
        <thead>
          <tr>
            <th scope="col">Année</th>
            <th scope="col">Budget exécuté</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">2023</th>
            <td>23 040 €</td>
          </tr>
          <tr>
            <th scope="row">2024</th>
            <td>115 168 €</td>
          </tr>
          <tr>
            <th scope="row">2025</th>
            <td><strong>278 063 €</strong></td>
          </tr>
          <tr>
            <th scope="row">2026 (janvier-avril)</th>
            <td>129 264 €</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="fr-h5 fr-mt-4w">Évolution du coût unitaire</h3>
    <div class="fr-table fr-table--bordered">
      <table>
        <caption class="fr-sr-only">Évolution du coût unitaire</caption>
        <thead>
          <tr>
            <th scope="col">Année</th>
            <th scope="col">Budget</th>
            <th scope="col">Simulations</th>
            <th scope="col">€ / simulation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">2024 (mars-décembre)</th>
            <td>115 168 €</td>
            <td>3 460</td>
            <td><strong>33,29 €</strong></td>
          </tr>
          <tr>
            <th scope="row">2025</th>
            <td>278 063 €</td>
            <td>15 252</td>
            <td><strong>18,23 €</strong></td>
          </tr>
          <tr>
            <th scope="row">2026 (janvier-avril)</th>
            <td>129 264 €</td>
            <td>16 347</td>
            <td><strong>7,91 €</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="fr-text--sm fr-mt-2w">
      Le coût par simulation a été divisé par environ 1,8 entre 2024 et 2025.
      Sur les 4 premiers mois de 2026, il continue de baisser.
    </p>

    <div class="fr-mt-4w mb-4 bg-[var(--background-alt-grey)] p-6">
      <p
        class="mb-2 text-sm font-bold uppercase text-[var(--text-mention-grey)]">
        Économie pour le ménage
      </p>
      <p
        class="text-2xl font-bold leading-tight text-[var(--text-title-blue-france)]">
        50 000 à 150 000 €
      </p>
      <p class="mt-2 text-[0.95rem] text-[var(--text-default-grey)]">
        Par acquisition selon la zone, sur la base d'une économie BRS
        structurelle de 30 à 50 % sur le prix d'acquisition. Fourchette
        indicative.
      </p>
    </div>

    <div class="fr-callout fr-mt-4w">
      <p class="fr-callout__title">Évolution prévue</p>
      <p class="fr-callout__text">
        Mesurer également le temps et l'argent économisés aux OFS grâce à BoRiS
        : qualification amont des prospects, réduction du temps consacré à
        l'information de premier niveau, ciblage géographique des leads.
      </p>
    </div>
  </section>

  <section
    class="fr-container fr-mt-6w fr-mb-6w"
    id="synthese">
    <h2 class="fr-h3">Synthèse</h2>
    <div class="fr-callout fr-callout--blue-ecume fr-mt-3w">
      <p class="fr-callout__text">
        BoRiS atteint <strong>11 000 visiteurs uniques</strong>
        en avril 2026,
        <strong>7 002 simulations d'éligibilité</strong>
        sur le même mois, et un taux de satisfaction de
        <strong>4,5 / 5</strong>
        . En 2025,
        <strong>150 ménages</strong>
        ont enclenché un projet d'achat en BRS grâce au site, dont 70 % qui ignoraient
        le dispositif et 28 % issus du parc locatif social.
      </p>
      <p class="fr-callout__text fr-mt-2w">
        Sur les 4 premiers mois de 2026, BoRiS a déjà collecté 16 347
        simulations, contre 15 252 sur toute 2025.
      </p>
      <p class="fr-callout__text fr-mt-2w">
        Pour un budget exécuté de <strong>278 063 €</strong>
        en 2025, le coût par simulation ressort à
        <strong>18,23 €</strong>
        , en baisse vs 2024 et déjà à 7,91 € sur les 4 premiers mois de 2026.
      </p>
    </div>
  </section>

  <section
    class="fr-container fr-mb-6w"
    id="methodologie">
    <h2 class="fr-h3">Notes méthodologiques</h2>
    <p class="fr-text--lead fr-mt-2w">
      Méthodologie alignée sur les lignes directrices beta.gouv.fr : tout
      chiffre est daté au mois près, accompagné de sa base physique et
      temporelle, et n'est pas en cumulé. Les pourcentages sont assortis de leur
      valeur absolue.
    </p>

    <div class="fr-accordions-group fr-mt-4w">
      {#each notes as note}
        <section class="fr-accordion">
          <h3 class="fr-accordion__title">
            <button
              class="fr-accordion__btn"
              aria-expanded="false"
              aria-controls={note.id}>
              {note.title}
            </button>
          </h3>
          <div
            class="fr-collapse"
            id={note.id}>
            <p>{note.content}</p>
          </div>
        </section>
      {/each}
    </div>
  </section>
</div>

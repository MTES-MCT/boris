<script lang="ts">
  import DistributionCard from '$components/pages/statistiques-eligibilite/DistributionCard.svelte';
  import { formatNumber } from '$lib/utils/formatters';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
  const statistics = $derived(data.statistics);
  const selectedDepartement = $derived(data.selectedDepartement);
  const selectedPostalCode = $derived(data.selectedPostalCode);

  const percentage = (value: number, total: number) =>
    total === 0 ? 0 : Math.round((value / total) * 100);
  const distributionTotal = (items: { count: number }[]) =>
    items.reduce((sum, item) => sum + item.count, 0);
  const selectedDepartementName = $derived(
    statistics.filters.departements.find(
      (item) => item.code === selectedDepartement,
    )?.name,
  );
  const perimeter = $derived(
    selectedPostalCode
      ? `code postal ${selectedPostalCode}`
      : selectedDepartementName
        ? `${selectedDepartementName} (${selectedDepartement})`
        : 'France entière',
  );
  const updatedAt = $derived(
    statistics.updatedAt
      ? new Intl.DateTimeFormat('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Europe/Paris',
        }).format(new Date(statistics.updatedAt))
      : 'date non disponible',
  );
  const regionsTotal = $derived(distributionTotal(statistics.regions));
  const regionsSummary = $derived.by(() => {
    const regionNames = statistics.regions
      .slice(0, 3)
      .map((region) => region.label);

    return regionNames.length
      ? regionNames
          .map((name) => `en ${name}`)
          .join(', ')
          .replace(/, ([^,]*)$/, ' et $1')
      : 'dans les territoires renseignés';
  });
  const topHousingTypes = $derived(
    statistics.housingTypes.toSorted((a, b) => b.count - a.count).slice(0, 2),
  );
  const zoneDisplay = (postalCode: string) =>
    postalCode.length <= 3 ? `${postalCode} · département` : postalCode;
</script>

<svelte:head>
  <title>Ce que les ménages cherchent en bail réel solidaire - BoRiS</title>
  <meta
    name="description"
    content="Statistiques anonymes issues des simulations d’éligibilité au bail réel solidaire sur BoRiS." />
  <meta
    name="robots"
    content="noindex, nofollow" />
</svelte:head>

<div class="stats-page">
  <div class="fr-container">
    <div class="page-heading fr-py-8w fr-py-md-12w">
      <p class="fr-badge fr-badge--blue-ecume fr-mb-3w">
        Données du {updatedAt}
      </p>
      <h1>Ce que les ménages cherchent en bail réel solidaire</h1>
      <p class="fr-text--lead fr-col-md-9 fr-mb-0">
        BoRiS permet à un ménage de vérifier son éligibilité au bail réel
        solidaire et de trouver les logements disponibles près de chez lui.
        Chaque simulation laisse une trace anonyme : une zone recherchée, une
        composition de foyer, un type de logement souhaité. Cette page rassemble
        ces traces. Elle ne décrit pas le marché du BRS tel qu'il se construit,
        mais la demande telle qu'elle s'exprime, avant même qu'un logement
        existe.
      </p>
    </div>
  </div>

  <div class="filter-band">
    <div class="fr-container">
      <form
        method="GET"
        class="fr-grid-row fr-grid-row--gutters fr-py-4w">
        <div class="fr-col-12 fr-col-md-3">
          <div class="fr-select-group fr-mb-0">
            <label
              class="fr-label"
              for="departement">
              Département
            </label>
            <select
              class="fr-select"
              id="departement"
              name="departement"
              value={selectedDepartement}
              onchange={(event) => {
                const form = event.currentTarget.form;
                const postalSelect =
                  form?.querySelector<HTMLSelectElement>('#codePostal');
                if (postalSelect) postalSelect.value = '';
                form?.requestSubmit();
              }}>
              <option value="">France entière</option>
              {#each statistics.filters.departements as departement}
                <option value={departement.code}>
                  {departement.code} · {departement.name}
                </option>
              {/each}
            </select>
          </div>
        </div>

        <div class="fr-col-12 fr-col-md-3">
          <div class="fr-select-group fr-mb-0">
            <label
              class="fr-label"
              for="codePostal">
              Code postal
            </label>
            <select
              class="fr-select"
              id="codePostal"
              name="codePostal"
              value={selectedPostalCode}
              disabled={!selectedDepartement}
              onchange={(event) => event.currentTarget.form?.requestSubmit()}>
              <option value="">
                {selectedDepartement
                  ? 'Tous les codes postaux'
                  : "Choisir un département d'abord"}
              </option>
              {#each statistics.filters.postalCodes as postalCode}
                <option value={postalCode}>{postalCode}</option>
              {/each}
            </select>
          </div>
        </div>

        <div class="fr-col-12 fr-col-md-2 filter-action">
          <a
            class="fr-btn fr-btn--secondary"
            href="/statistiques-eligibilite">
            Réinitialiser
          </a>
        </div>

        <p
          class="fr-col-12 fr-col-md-4 perimeter fr-mb-0"
          aria-live="polite">
          Périmètre : <strong>{perimeter}.</strong>
          Les ventilations géographiques portent sur {formatNumber(
            statistics.totals.geolocated,
          )} simulations géolocalisées, soit {percentage(
            statistics.totals.geolocated,
            statistics.totals.simulations,
          )} % du total.
        </p>
      </form>
    </div>
  </div>

  <div class="fr-container content fr-py-8w fr-py-md-12w">
    <section class="stats-section">
      <div class="section-intro">
        <p class="eyebrow">01 — Vue d'ensemble</p>
        <h2>De la curiosité au projet</h2>
        <p class="fr-text--lead">
          Sur {formatNumber(statistics.totals.simulations)} simulations réalisées
          depuis l'ouverture du service, {formatNumber(
            statistics.totals.eligible,
          )}
          portent sur un ménage éligible au bail réel solidaire. Parmi elles,
          {formatNumber(statistics.totals.contactable)} ménages sont allés jusqu'à
          laisser leurs coordonnées.
        </p>
        <p>
          Ces trois nombres ne mesurent pas la même chose. Le premier dit
          l'intérêt pour le dispositif, le deuxième la part de cet intérêt que
          la réglementation autorise, le troisième l'intention réelle d'aller
          plus loin. C'est le troisième qui intéresse un OFS ou un opérateur :
          ce sont des ménages identifiés, en recherche active, et qui ont déjà
          passé le test d'éligibilité.
        </p>
      </div>

      <div class="fr-grid-row fr-grid-row--gutters kpis fr-mt-5w">
        <div class="fr-col-12 fr-col-md-4">
          <article class="fr-card fr-card--shadow kpi-card">
            <div class="fr-card__body">
              <div class="fr-card__content">
                <h3 class="fr-card__title">Simulations réalisées</h3>
                <p class="kpi-value">
                  {formatNumber(statistics.totals.simulations)}
                </p>
                <p class="fr-card__detail">depuis l'ouverture du service</p>
                <p class="fr-card__desc">
                  Visites allées jusqu'au test d'éligibilité.
                </p>
              </div>
            </div>
          </article>
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <article class="fr-card fr-card--shadow kpi-card kpi-card--eligible">
            <div class="fr-card__body">
              <div class="fr-card__content">
                <h3 class="fr-card__title">
                  Ménages éligibles dans au moins une zone
                </h3>
                <p class="kpi-value">
                  {formatNumber(statistics.totals.eligible)}
                </p>
                <p class="fr-card__detail">
                  {percentage(
                    statistics.totals.eligible,
                    statistics.totals.simulations,
                  )} % des simulations
                </p>
                <p class="fr-card__desc">
                  Ressources sous le plafond BRS d'au moins un des trois groupes
                  de zones.
                </p>
              </div>
            </div>
          </article>
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <article class="fr-card fr-card--shadow kpi-card kpi-card--contact">
            <div class="fr-card__body">
              <div class="fr-card__content">
                <h3 class="fr-card__title">
                  Ménages ayant laissé leurs coordonnées
                </h3>
                <p class="kpi-value">
                  {formatNumber(statistics.totals.contactable)}
                </p>
                <p class="fr-card__detail">
                  {percentage(
                    statistics.totals.contactable,
                    statistics.totals.simulations,
                  )} % des simulations
                </p>
                <p class="fr-card__desc">
                  Démarche volontaire, en fin de simulation. La demande
                  adressable aujourd'hui.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="fr-callout fr-callout--blue-cumulus fr-mt-4w">
        <h3 class="fr-callout__title">Ce que « éligible » veut dire ici</h3>
        <p class="fr-callout__text">
          Le test compare les ressources du ménage aux plafonds BRS des trois
          groupes de zones (A et A bis, B1, B2 et C), et le ménage est compté
          dès qu'il passe sous l'un d'eux. Éligible dans au moins une zone ne
          veut donc pas dire éligible là où le ménage cherche : les plafonds de
          la zone A sont les plus larges, un ménage qui ne franchit que celui-là
          ne serait pas éligible dans une commune classée B2.
        </p>
      </div>
    </section>

    <section class="stats-section">
      <div class="section-intro">
        <p class="eyebrow">02 — Territoires</p>
        <h2>Où la demande se manifeste</h2>
        <p class="fr-text--lead">
          La demande se concentre {regionsSummary}. Le rapprochement le plus
          utile n'est pas le classement lui-même, c'est l'écart entre les
          territoires où la demande s'exprime et ceux où des logements sont
          effectivement proposés.
        </p>
        <p>
          Les deux vues qui suivent vont du plus large au plus fin. La seconde,
          par code postal, sert à situer une demande à l'échelle d'un projet.
        </p>
      </div>

      <div class="fr-grid-row fr-grid-row--gutters fr-mt-5w">
        <div class="fr-col-12 fr-col-lg-6">
          <DistributionCard
            title="Régions les plus recherchées"
            items={statistics.regions}
            total={regionsTotal}
            detail={`sur ${formatNumber(statistics.totals.geolocated)} simulations géolocalisées`} />
        </div>
        <div class="fr-col-12 fr-col-lg-6">
          <article class="fr-card fr-card--shadow stats-card">
            <div class="fr-card__body">
              <div class="fr-card__content">
                <h3 class="fr-card__title">
                  Zones déclarées les plus demandées
                </h3>
                <p class="fr-card__detail">
                  zones comptant au moins 10 simulations
                </p>
                <div class="fr-table fr-table--bordered fr-table--sm fr-mb-0">
                  <div class="fr-table__wrapper">
                    <div class="fr-table__container">
                      <div class="fr-table__content">
                        <table>
                          <caption class="fr-sr-only">
                            Zones déclarées les plus demandées
                          </caption>
                          <thead>
                            <tr>
                              <th scope="col">Zone</th>
                              <th scope="col">Département</th>
                              <th scope="col">Simulations</th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each statistics.zones as zone}
                              <tr>
                                <td>{zoneDisplay(zone.postalCode)}</td>
                                <td>{zone.departementCode}</td>
                                <td>{formatNumber(zone.count)}</td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="fr-alert fr-alert--warning fr-alert--sm fr-mt-3w">
                  <h4 class="fr-alert__title">
                    Anomalie 2 · deux granularités dans le même champ
                  </h4>
                  <p>
                    Des codes postaux complets et des codes de département
                    peuvent cohabiter dans la colonne. Les valeurs sur les
                    premiers arrondissements de Paris ou Lyon peuvent
                    correspondre à une valeur par défaut retenue quand le ménage
                    saisit la ville sans préciser.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="section-intro">
        <p class="eyebrow">03 — Profils</p>
        <h2>Qui sont ces ménages</h2>
        <p class="fr-text--lead">
          Composition du foyer, statut d'occupation actuel, ressources et
          situation professionnelle. Ces vues servent à savoir à qui on
          s'adresse, et à vérifier que le dispositif touche les ménages qu'il
          vise plutôt que ceux qui savent déjà s'informer.
        </p>
        <p>
          Chaque vue porte sur les simulations où l'information a été
          renseignée, et cet effectif est indiqué sous le titre. Il varie
          fortement d'une vue à l'autre : additionner des pourcentages d'une
          carte à l'autre n'a pas de sens.
        </p>
      </div>

      <div class="fr-grid-row fr-grid-row--gutters fr-mt-5w">
        <div class="fr-col-12 fr-col-lg-6">
          <DistributionCard
            title="Taille du ménage"
            items={statistics.householdSizes} />
        </div>
        <div class="fr-col-12 fr-col-lg-6">
          <DistributionCard
            title="Situation de logement actuelle"
            items={statistics.propertySituations} />
        </div>
        <div class="fr-col-12 fr-col-lg-6">
          <DistributionCard
            title="Catégories de revenus"
            items={statistics.incomeRanges} />
          <div class="fr-alert fr-alert--warning fr-alert--sm fr-mt-2w">
            <h3 class="fr-alert__title">
              Anomalie 1 · défaut d'unité, pas un résultat
            </h3>
            <p>
              La requête écarte déjà les valeurs nulles, donc la première
              tranche n'est pas gonflée par des champs vides. Le champ semble
              stocker un revenu mensuel comparé à des seuils annuels. Telle
              quelle, cette carte ne doit pas servir à qualifier la solvabilité
              de la demande.
            </p>
          </div>
        </div>
        <div class="fr-col-12 fr-col-lg-6">
          <DistributionCard
            title="Situation professionnelle"
            items={statistics.employmentStatuses} />
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="section-intro">
        <p class="eyebrow">04 — Recherche</p>
        <h2>Ce qu'ils cherchent</h2>
        <p class="fr-text--lead">
          {#if topHousingTypes.length >= 2}
            Sur ce périmètre, le {topHousingTypes[0].label} arrive en tête, suivi
            du {topHousingTypes[1].label}. Le T1 reste marginal, ce qui
            distingue nettement cette demande de celle du locatif social.
          {:else}
            La vue ci-dessous présente les typologies recherchées sur ce
            périmètre.
          {/if}
        </p>
        <p>
          C'est la vue la plus directement opérationnelle pour un opérateur qui
          construit : elle dit ce que les ménages demandent, indépendamment de
          ce qui leur est proposé aujourd'hui.
        </p>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters fr-mt-5w">
        <div class="fr-col-12 fr-col-lg-8">
          <DistributionCard
            title="Typologie de logement recherchée"
            items={statistics.housingTypes} />
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="section-intro">
        <p class="eyebrow">05 — Notoriété</p>
        <h2>Ce que les ménages savent du dispositif</h2>
        <p class="fr-text--lead">
          Cette vue ne décrit pas la demande, elle décrit sa formation. Un
          dispositif que les ménages découvrent au moment de la simulation ne se
          diffuse pas par les mêmes canaux qu'un dispositif déjà connu, et c'est
          une donnée d'action publique avant d'être une donnée de
          commercialisation.
        </p>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters fr-mt-5w">
        <div class="fr-col-12 fr-col-lg-8">
          <DistributionCard
            title="Connaissance du BRS avant la simulation"
            items={statistics.brsKnowledge} />
          <div class="fr-alert fr-alert--warning fr-alert--sm fr-mt-2w">
            <h3 class="fr-alert__title">
              Anomalie 3 · « ne connaissait pas » veut peut-être dire « n'a pas
              coché »
            </h3>
            <p>
              La requête écarte les valeurs nulles, donc ces réponses négatives
              ont bien été écrites par le parcours. Reste à savoir par quel
              geste : une question à deux réponses, ou une case à cocher dont
              l'absence de coche vaut « non ». Dans le second cas ce n'est pas
              un taux de notoriété.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="method fr-p-4w fr-p-md-6w">
      <h2>Sur ces données</h2>
      <p>
        Chaque ligne correspond à une simulation réalisée sur
        boris.beta.gouv.fr, sans donnée nominative. Une même personne peut
        simuler plusieurs fois. Les effectifs varient d'une vue à l'autre selon
        les champs renseignés, et sont indiqués sous chaque titre. Les zones
        recherchées sont déclarées par le ménage et ne préjugent pas d'un projet
        abouti.
      </p>
      <div class="fr-alert fr-alert--info fr-alert--sm fr-my-3w">
        <h3 class="fr-alert__title">
          Anomalie 4 · les cartes ne partagent pas le même dénominateur
        </h3>
        <p>
          Le total du périmètre est de {formatNumber(
            statistics.totals.simulations,
          )} simulations, mais la ventilation géographique en couvre {formatNumber(
            statistics.totals.geolocated,
          )}, les ressources {formatNumber(
            distributionTotal(statistics.incomeRanges),
          )}, et la typologie {formatNumber(
            distributionTotal(statistics.housingTypes),
          )}. Chaque carte porte donc son propre effectif.
        </p>
      </div>
      <p>
        <strong>Les territoires ne s'additionnent pas.</strong>
        Un même ménage peut déclarer plusieurs zones de recherche, dans plusieurs
        départements, et il est compté dans chacune. Chaque périmètre se lit seul.
      </p>
      <p>
        <strong>Secret statistique.</strong>
        Une zone où moins de dix ménages ont déclaré chercher un logement n'est pas
        listée dans le filtre et ses chiffres ne sont pas publiés. Ces simulations
        restent comptées dans les totaux du département et du pays : elles ne sont
        pas retirées, seulement pas ventilées.
      </p>
      <p>
        <strong>Fraîcheur.</strong>
        Les données sont calculées depuis la base BoRiS puis conservées en cache
        pendant douze heures. La date affichée en haut correspond à la simulation
        la plus récente du périmètre sélectionné.
      </p>
      <p class="fr-mb-0">
        <strong>Source des chiffres :</strong>
        base de données BoRiS, simulations d'éligibilité.
      </p>
    </section>
  </div>
</div>

<style>
  .stats-page {
    background: var(--background-alt-grey);
  }
  .page-heading h1 {
    max-width: 52rem;
  }
  .page-heading .fr-badge {
    float: right;
  }
  .filter-band {
    background: var(--background-default-grey);
    border-block: 1px solid var(--border-default-grey);
    position: sticky;
    top: 3.5rem;
    z-index: 10;
  }
  .filter-action {
    align-items: end;
    display: flex;
  }
  .perimeter {
    align-self: end;
    color: var(--text-mention-grey);
    font-size: 0.875rem;
    text-align: right;
  }
  .content {
    max-width: 75rem;
  }
  .stats-section {
    scroll-margin-top: 12rem;
  }
  .stats-section + .stats-section {
    border-top: 1px solid var(--border-default-grey);
    margin-top: 6rem;
    padding-top: 6rem;
  }
  .section-intro {
    max-width: 52rem;
  }
  .eyebrow {
    color: var(--text-action-high-blue-france);
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
  }
  .kpi-card {
    border-top: 0.375rem solid var(--border-action-high-blue-france);
    height: 100%;
  }
  .kpi-card--eligible {
    border-top-color: var(--border-plain-green-emeraude);
  }
  .kpi-card--contact {
    border-top-color: var(--border-plain-purple-glycine);
  }
  .kpi-card .fr-card__content,
  .stats-card .fr-card__content {
    padding: 2rem;
  }
  .kpi-value {
    color: var(--text-title-blue-france);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    line-height: 1;
    margin: 1.5rem 0 0.5rem;
  }
  .stats-card {
    height: 100%;
  }
  .method {
    background: var(--background-contrast-blue-france);
    border-left: 0.25rem solid var(--border-action-high-blue-france);
    margin-top: 6rem;
  }
  @media (max-width: 48rem) {
    .page-heading .fr-badge {
      float: none;
    }
    .filter-band {
      position: static;
    }
    .filter-action {
      align-items: initial;
    }
    .perimeter {
      text-align: left;
    }
    .stats-section + .stats-section {
      margin-top: 4rem;
      padding-top: 4rem;
    }
    .kpi-card .fr-card__content,
    .stats-card .fr-card__content {
      padding: 1.5rem;
    }
  }
</style>

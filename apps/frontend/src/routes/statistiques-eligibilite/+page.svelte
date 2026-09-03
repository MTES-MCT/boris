<script lang="ts">
  import DistributionCard from '$components/pages/statistiques-eligibilite/DistributionCard.svelte';
  import { formatNumber } from '$lib/utils/formatters';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
  const statistics = $derived(data.statistics);
  const selectedDepartement = $derived(data.selectedDepartement);
  const selectedPostalCode = $derived(data.selectedPostalCode);

  const percentage = (value: number | null, total: number) =>
    value === null || total === 0 ? null : Math.round((value / total) * 100);
  const formatProtectedCount = (value: number | null) =>
    value === null ? '< 5' : formatNumber(value);
  const formatProtectedPercentage = (value: number | null, total: number) => {
    const result = percentage(value, total);

    return result === null ? 'part masquée' : `${result} %`;
  };
  const formatDistributionDetail = (
    total: number | null,
    description = 'simulations renseignées',
  ) =>
    total === null
      ? 'effectif partiellement masqué pour protéger les petits groupes'
      : `sur ${formatNumber(total)} ${description}`;
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
  const regionsTotal = $derived(statistics.totals.geolocated);
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
    statistics.housingTypes.some((item) => item.count === null)
      ? []
      : statistics.housingTypes
          .toSorted((first, second) => (second.count ?? 0) - (first.count ?? 0))
          .slice(0, 2),
  );
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

<div class="bg-[var(--background-alt-grey)]">
  <div class="fr-container">
    <div class="fr-py-8w fr-py-md-12w">
      <h1 class="max-w-[52rem]">
        Ce que les ménages cherchent en bail réel solidaire
      </h1>
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

  <div
    class="z-[1000] border-y border-[var(--border-default-grey)] bg-[var(--background-default-grey)] md:sticky md:top-14">
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

        <div class="fr-col-12 fr-col-md-2 flex md:items-end">
          <a
            class="fr-btn fr-btn--secondary"
            href="/statistiques-eligibilite">
            Réinitialiser
          </a>
        </div>

        <p
          class="fr-col-12 fr-col-md-4 fr-mb-0 self-end text-left text-sm text-[var(--text-mention-grey)] md:text-right"
          aria-live="polite">
          Périmètre : <strong>{perimeter}.</strong>
          Les ventilations géographiques portent sur {formatProtectedCount(
            statistics.totals.geolocated,
          )} simulations géolocalisées, soit {formatProtectedPercentage(
            statistics.totals.geolocated,
            statistics.totals.simulations,
          )} du total.
        </p>
      </form>
    </div>
  </div>

  <div class="fr-container fr-py-8w fr-py-md-12w max-w-[75rem]">
    <section class="scroll-mt-48">
      <div class="max-w-[52rem]">
        <p
          class="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-action-high-blue-france)]">
          01 — Vue d'ensemble
        </p>
        <h2>De la curiosité au projet</h2>
        <p class="fr-text--lead">
          Sur {formatNumber(statistics.totals.simulations)} simulations réalisées
          depuis l'ouverture du service, {formatProtectedCount(
            statistics.totals.eligible,
          )}
          portent sur un ménage éligible au bail réel solidaire. Parmi elles,
          {formatProtectedCount(statistics.totals.contactable)} ménages sont allés
          jusqu'à laisser leurs coordonnées.
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

      <div class="fr-grid-row fr-grid-row--gutters fr-mt-5w">
        <div class="fr-col-12 fr-col-md-4">
          <article
            class="fr-card fr-card--shadow h-full border-t-[0.375rem] border-t-[var(--border-action-high-blue-france)]">
            <div class="fr-card__body">
              <div class="fr-card__content !p-6 md:!p-8">
                <h3 class="fr-card__title">Simulations réalisées</h3>
                <p
                  class="mt-6 mb-2 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none text-[var(--text-title-blue-france)]">
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
          <article
            class="fr-card fr-card--shadow h-full border-t-[0.375rem] border-t-[var(--border-plain-green-emeraude)]">
            <div class="fr-card__body">
              <div class="fr-card__content !p-6 md:!p-8">
                <h3 class="fr-card__title">
                  Ménages éligibles dans au moins une zone
                </h3>
                <p
                  class="mt-6 mb-2 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none text-[var(--text-title-blue-france)]">
                  {formatProtectedCount(statistics.totals.eligible)}
                </p>
                <p class="fr-card__detail">
                  {formatProtectedPercentage(
                    statistics.totals.eligible,
                    statistics.totals.simulations,
                  )} des simulations
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
          <article
            class="fr-card fr-card--shadow h-full border-t-[0.375rem] border-t-[var(--border-plain-purple-glycine)]">
            <div class="fr-card__body">
              <div class="fr-card__content !p-6 md:!p-8">
                <h3 class="fr-card__title">
                  Ménages ayant laissé leurs coordonnées
                </h3>
                <p
                  class="mt-6 mb-2 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none text-[var(--text-title-blue-france)]">
                  {formatProtectedCount(statistics.totals.contactable)}
                </p>
                <p class="fr-card__detail">
                  {formatProtectedPercentage(
                    statistics.totals.contactable,
                    statistics.totals.simulations,
                  )} des simulations
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

    <section
      class="mt-16 scroll-mt-48 border-t border-[var(--border-default-grey)] pt-16 md:mt-24 md:pt-24">
      <div class="max-w-[52rem]">
        <p
          class="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-action-high-blue-france)]">
          02 — Territoires
        </p>
        <h2>Où la demande se manifeste</h2>
        <p class="fr-text--lead">
          La demande se concentre {regionsSummary}. Le rapprochement le plus
          utile n'est pas le classement lui-même, c'est l'écart entre les
          territoires où la demande s'exprime et ceux où des logements sont
          effectivement proposés.
        </p>
        <p>
          Les deux vues qui suivent vont du plus large au plus fin, de la région
          au département.
        </p>
      </div>

      <div class="fr-grid-row fr-grid-row--gutters fr-mt-5w">
        <div class="fr-col-12 fr-col-lg-6">
          <DistributionCard
            title="Régions les plus recherchées"
            items={statistics.regions}
            total={regionsTotal}
            detail={formatDistributionDetail(
              statistics.totals.geolocated,
              'simulations géolocalisées',
            )} />
        </div>
        <div class="fr-col-12 fr-col-lg-6">
          <article class="fr-card fr-card--shadow h-full">
            <div class="fr-card__body">
              <div class="fr-card__content !p-6 md:!p-8">
                <h3 class="fr-h4 fr-mb-1w">Départements les plus recherchés</h3>
                <p class="fr-text--sm fr-mb-4w text-[var(--text-mention-grey)]">
                  départements comptant au moins 5 simulations
                </p>
                <div class="fr-table fr-table--bordered fr-table--sm fr-mb-0">
                  <div class="fr-table__wrapper">
                    <div class="fr-table__container">
                      <div class="fr-table__content">
                        <table>
                          <caption class="fr-sr-only">
                            Départements les plus recherchés
                          </caption>
                          <thead>
                            <tr>
                              <th scope="col">Département</th>
                              <th scope="col">Code</th>
                              <th scope="col">Simulations</th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each statistics.topDepartements as departement}
                              <tr>
                                <td>{departement.label}</td>
                                <td>{departement.code}</td>
                                <td>
                                  {formatProtectedCount(departement.count)}
                                </td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section
      class="mt-16 scroll-mt-48 border-t border-[var(--border-default-grey)] pt-16 md:mt-24 md:pt-24">
      <div class="max-w-[52rem]">
        <p
          class="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-action-high-blue-france)]">
          03 — Profils
        </p>
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
            items={statistics.householdSizes}
            total={statistics.breakdownTotals.householdSizes} />
        </div>
        <div class="fr-col-12 fr-col-lg-6">
          <DistributionCard
            title="Situation de logement actuelle"
            items={statistics.propertySituations}
            total={statistics.breakdownTotals.propertySituations} />
        </div>
        <div class="fr-col-12 fr-col-lg-6">
          <DistributionCard
            title="Revenu fiscal de référence annuel"
            items={statistics.incomeRanges}
            total={statistics.breakdownTotals.incomeRanges} />
        </div>
        <div class="fr-col-12 fr-col-lg-6">
          <DistributionCard
            title="Situation professionnelle"
            items={statistics.employmentStatuses}
            total={statistics.breakdownTotals.employmentStatuses} />
        </div>
      </div>
    </section>

    <section
      class="mt-16 scroll-mt-48 border-t border-[var(--border-default-grey)] pt-16 md:mt-24 md:pt-24">
      <div class="max-w-[52rem]">
        <p
          class="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-action-high-blue-france)]">
          04 — Recherche
        </p>
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
            items={statistics.housingTypes}
            total={statistics.breakdownTotals.housingTypes} />
        </div>
      </div>
    </section>

    <section
      class="mt-16 scroll-mt-48 border-t border-[var(--border-default-grey)] pt-16 md:mt-24 md:pt-24">
      <div class="max-w-[52rem]">
        <p
          class="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-action-high-blue-france)]">
          05 — Notoriété
        </p>
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
            items={statistics.brsKnowledge}
            total={statistics.breakdownTotals.brsKnowledge} />
        </div>
      </div>
    </section>

    <section
      class="fr-p-4w fr-p-md-6w mt-16 border-l-4 border-l-[var(--border-action-high-blue-france)] bg-[var(--background-contrast-blue-france)] md:mt-24">
      <h2>Sur ces données</h2>
      <p>
        Chaque ligne correspond à une simulation réalisée sur
        boris.beta.gouv.fr, sans donnée nominative. Une même personne peut
        simuler plusieurs fois. Les effectifs varient d'une vue à l'autre selon
        les champs renseignés, et sont indiqués sous chaque titre. Les zones
        recherchées sont déclarées par le ménage et ne préjugent pas d'un projet
        abouti.
      </p>
      <p>
        <strong>Les territoires ne s'additionnent pas.</strong>
        Un même ménage peut déclarer plusieurs zones de recherche, dans plusieurs
        départements, et il est compté dans chacune. Chaque périmètre se lit seul.
      </p>
      <p>
        <strong>Secret statistique.</strong>
        Une zone où moins de cinq ménages ont déclaré chercher un logement n'est
        pas listée dans le filtre et ses chiffres ne sont pas publiés. Ces simulations
        restent comptées dans les totaux du département et du pays : elles ne sont
        pas retirées, seulement pas ventilées.
      </p>
      <p>
        <strong>Actualisation.</strong>
        Les données sont calculées depuis la base BoRiS puis conservées en cache
        pendant douze heures.
      </p>
      <p>
        Toutes les questions ne sont pas posées à tous les ménages et certaines
        réponses sont facultatives. C'est pourquoi chaque graphique indique son
        propre nombre de simulations renseignées.
      </p>
      <p class="fr-mb-0">
        <strong>Source des chiffres :</strong>
        base de données BoRiS, simulations d'éligibilité.
      </p>
    </section>
  </div>
</div>

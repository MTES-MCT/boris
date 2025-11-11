<script lang="ts">
  import Section from '$components/common/Section.svelte';

  type Step = {
    date: string;
    title: string;
    description: string;
  };

  const steps = [
    {
      date: 'Mai 2023 - Aout 2023',
      title: "Phase d'investigation",
      description: `L'équipe du projet (1 intrapreneur + 1 coach) ont testé la pertinence du projet à travers des interviews d'une vingtaine de personnes (acheteurs en BRS, bénéficiaires potentiels, banques, organismes de foncier solidaire (OFS), etc.) et des travaux de recherche.`,
    },
    {
      date: 'Septembre 2023 - Juin 2024',
      title: 'Phase de construction',
      description: `Pendant 6 mois, nous avons testé l'idée en créant un prototype fonctionnel (notamment ce site web et le simulateur d'éligibilité). L'objectif fut ensuite de tester auprès des futurs usagers la pertinence de la solution, sur la période Mars-Juin 2024. Sur ces trois mois nous avons eu nos 600 premières simulations, et avons au final pu accompagner 20 ménages vers l'accession au BRS. Ces résultats ont permis de débloquer de nouveaux fonds pour passer à l'étape supérieure.`,
    },
    {
      date: `Août 2024 - Aujourd'hui`,
      title: "Phase d'accélération",
      description: `Notre équipe s'est renforcée avec l'arrivée de notre chargée de déploiement, notre développeur et notre designeuse, dans l'optique de toucher et d'aider un maximum de ménages à devenir propriétaire en BRS.`,
    },
    {
      date: 'Et après ?',
      title: '',
      description: `Nous avons la ferme intention de développer cette plateforme pour répondre aux enjeux des ménages dans leur recherche d'un logement à prix abordable. Nous continuerons à ajouter des informations utiles aux acquéreurs à chaque étape de leur parcours, au fur et à mesure de notre évolution.`,
    },
  ];
</script>

<Section>
  <h2 class="fr-h3 text-center !mt-8 !mb-8 md:!mt-16 !text-blue-primary">
    Les grandes étapes de notre projet.
  </h2>

  <div
    class={`
      relative flex flex-col lg:flex-row lg:gap-12
      before:content-[''] before:absolute before:top-[-1rem] before:left-[calc(0.5rem-1px)] before:w-[2px] before:h-full before:bg-blue-primary
      lg:before:top-[47px] lg:before:left-[-1rem] lg:before:w-[calc(100%+2rem)] lg:before:h-[2px]
    `}>
    {#each steps as step}
      {@render chronologyStep(step.date, step.title, step.description)}
    {/each}
  </div>
</Section>

{#snippet chronologyStep(date: string, title: string, description: string)}
  <div class="flex-1 mb-8">
    <div class="content">
      <p
        class={`
        relative fr-text--sm fr-text--bold !mb-0 lg:!mb-8 pb-4 pl-6 lg:pl-0
        before:content-[''] before:absolute before:top-[0.25rem] before:left-0 before:w-[1rem] before:h-[1rem] before:rounded-full before:bg-blue-primary
        lg:before:top-[calc(100%)]
      `}>
        {date}
      </p>
      <p class="fr-text--sm fr-text--bold !mb-2 pl-6 lg:pl-0">{title}</p>
      <p class="fr-text--sm pl-6 lg:pl-0">{description}</p>
    </div>
  </div>
{/snippet}

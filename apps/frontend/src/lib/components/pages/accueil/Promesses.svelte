<script lang="ts">
  import type { Icon } from '$lib/utils/definitions';

  import Section from '$components/common/Section.svelte';
  import Disclaimer from '$components/common/Disclaimer.svelte';

  type Promise = {
    icon: Icon;
    content: string;
    href: string;
    linkLabel: string;
  };

  const promises: Promise[] = [
    {
      icon: 'community-line',
      content:
        'Achetez votre logement 30 à 50% moins cher, profitez des avantages du bail réel solidaire et comprenez les contreparties !',
      href: '/tout-savoir-sur-le-bail-reel-solidaire-brs',
      linkLabel: 'Comprendre le bail réel solidaire',
    },
    {
      icon: 'france-line',
      content:
        "Trouvez une offre de logements abordables proposée par les Organismes Fonciers Solidaires qui se déploie sur l'ensemble du territoire.",
      href: '/logements-brs-disponibles',
      linkLabel: 'Trouver un logement en BRS',
    },
    {
      icon: 'sofa-line',
      content:
        "Profitez pleinement de votre logement en résidence principale et à condition d'être éligible au bail réel solidaire.",
      href: '/simulateur-eligibilite/steps',
      linkLabel: 'Tester mon éligibilité',
    },
    {
      icon: 'service-line',
      content:
        "Acquittez vous mensuellement d'une redevance contenue auprès de l'organisme de foncier solidaire (OFS) avec qui vous partagez la propriété.",
      href: '/simulateur-acquisition',
      linkLabel: 'Calculer le coût total de mon achat en BRS',
    },
  ];
</script>

<Section>
  <div
    class="fr-container relative !max-w-[400px] md:!max-w-[576px] lg:!max-w-[1044px] fr-py-1v fr-py-md-4w mt-[-9.5rem] mb-[6rem] rounded-lg bg-white border border-blue-primary border-2 lg:border-(length:--path-thickness) lg:border-blue-primary">
    <div class="fr-grid-row fr-grid-row--gutters">
      {#each promises as { icon, content, href, linkLabel }}
        {@render promise(icon, content, href, linkLabel)}
      {/each}
    </div>
  </div>

  <Disclaimer content="la clef pour devenir propriétaire en BRS." />
</Section>

{#snippet promise(icon: Icon, content: string, href: string, linkLabel: string)}
  <div
    class="flex flex-col justify-between fr-col-12 fr-col-md-6 fr-col-lg-3 fr-px-2w fr-py-3w fr-py-md-2w fr-my-2w">
    <div class="flex flex-col items-center gap-none">
      <span
        class={`fr-icon-${icon} inline-block fr-p-2w fr-mb-2w fr-mb-md-4w rounded-full bg-blue-light text-blue-primary`}
        aria-hidden="true">
      </span>

      <p class="fr-text--sm text-center fr-mb-2w fr-mb-md-4w">{content}</p>
    </div>
    <a
      class="fr-link fr-text--sm self-center"
      {href}>
      {linkLabel}
    </a>
  </div>
{/snippet}

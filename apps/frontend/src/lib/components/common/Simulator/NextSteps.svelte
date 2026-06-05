<script lang="ts">
  type NextStepLink = {
    label: string;
    href: string;
    external?: boolean;
  };

  type Props = {
    isEligible: boolean;
  };

  const { isEligible }: Props = $props();

  const eligibleLinks: NextStepLink[] = [
    {
      label: 'Trouver un logement en BRS près de chez moi',
      href: '/logements-brs-disponibles',
    },
    {
      label: "Estimer mon coût d'acquisition",
      href: '/simulateur-acquisition',
    },
    {
      label: 'Comprendre les étapes du BRS',
      href: '/tout-savoir-sur-le-bail-reel-solidaire-brs',
    },
  ];

  const ineligibleLinks: NextStepLink[] = [
    {
      label: 'Comprendre les plafonds de ressources',
      href: '/simulateur-eligibilite#plafonds-de-ressources',
    },
    {
      label: "D'autres solutions pour acheter",
      href: '/blog/acheter-son-logement-sans-se-ruiner-3-solutions-a-connaitre-absolument',
    },
    {
      label: "Prendre conseil gratuitement auprès de l'ADIL",
      href: 'https://www.anil.org/lanil-et-les-adil/votre-adil/',
      external: true,
    },
  ];

  const links = $derived(isEligible ? eligibleLinks : ineligibleLinks);
</script>

<section
  class="fr-mt-6w fr-pt-4w border-t-1 border-t-(--border-default-grey)"
  aria-labelledby="simulator-next-steps-title">
  <h3
    id="simulator-next-steps-title"
    class="fr-h5">
    Et maintenant ?
  </h3>

  <ul class="fr-mt-2w">
    {#each links as link}
      <li>
        <a
          class="fr-link"
          class:fr-link--icon-right={link.external}
          class:fr-icon-external-link-line={link.external}
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}>
          {link.label}
        </a>
      </li>
    {/each}
  </ul>
</section>

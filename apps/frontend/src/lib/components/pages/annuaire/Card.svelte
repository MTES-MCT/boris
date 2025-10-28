<script lang="ts">
  import '@gouvfr/dsfr/dist/component/card/card.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';

  import Badge from '$components/common/Badge.svelte';

  import type {
    DepartementRelationnalView,
    RegionRelationnalView,
  } from '$lib/utils/api-types';
  import type { Heading } from '$lib/utils/definitions';

  type Props = {
    region: RegionRelationnalView;
    departement: DepartementRelationnalView;
    city: string;
    ofsName: string;
    distributorName: string;
    source: string;
    cardTitleElement?: Heading;
    narrow?: boolean;
    selected?: boolean;
    handleClose?: () => void;
  };

  const {
    region,
    departement,
    city,
    ofsName,
    distributorName,
    source,
    cardTitleElement = 'h3',
    narrow = false,
    selected = false,
    handleClose,
  }: Props = $props();
</script>

<article
  class="fr-card fr-card--sm"
  class:fr-mb-1v={narrow}
  class:box-shadow-primary={selected}
  class:background-color-blue-deep={selected}
  class:selected>
  <div
    class="fr-card__body"
    class:fr-px-3w={narrow}>
    <div
      class="fr-card__content"
      class:fr-pt-2w={narrow}
      class:fr-pb-0={narrow}>
      {#if handleClose}
        <div class="closable flex justify-between align-start gap-2w">
          {@render badges()}
          <button
            onclick={handleClose}
            aria-label="Fermer">
            <span
              aria-hidden="true"
              class="fr-icon-close-line">
            </span>
          </button>
        </div>
      {:else}
        {@render badges()}
      {/if}
      <div>
        <svelte:element
          this={cardTitleElement}
          class="fr-card__title">
          {ofsName}
        </svelte:element>
        <p class="fr-mb-0">{distributorName}</p>
      </div>
    </div>
    <div
      class="fr-card__footer"
      class:fr-pt-0={narrow}
      class:fr-pb-1w={narrow}>
      <ul class="fr-links-group fr-links-group--inline">
        <li>
          <a
            href={source}
            class="fr-link fr-icon-arrow-right-line fr-link--icon-right"
            target="_blank"
            rel="noopener">
            Lien
          </a>
        </li>
      </ul>
    </div>
  </div>
</article>

{#snippet badges()}
  <div
    class="flex flex-wrap"
    class:gap-1w={!narrow}
    class:fr-mb-2w={!narrow}
    class:fr-mt-1v={!narrow}
    class:fr-mb-1w={narrow}
    class:gap-1v={narrow}>
    <Badge
      status="info"
      hideIcon>
      {city}
    </Badge>
    <Badge
      status="new"
      hideIcon>
      {departement.name}
    </Badge>
    <Badge
      status="success"
      hideIcon>
      {region.name}
    </Badge>
  </div>
{/snippet}

<style lang="postcss">
  .selected {
    --border-default-grey: var(--color-blue-primary);
  }
</style>

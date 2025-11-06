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
  class:mb-1={narrow}
  class:border-1={selected}
  class:border-blue-primary={selected}
  class:!bg-blue-deep={selected}
  class:shadow-lg={selected}>
  <div
    class="fr-card__body"
    class:!px-6={narrow}>
    <div
      class="fr-card__content"
      class:!pt-4={narrow}
      class:!pb-0={narrow}>
      {#if handleClose}
        <div class="flex justify-between items-start gap-4">
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
      class:!pt-0={narrow}
      class:!pb-2={narrow}>
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
  <div class="flex flex-wrap gap-1 mt-[2px] mb-4">
    <Badge status="info">
      {city}
    </Badge>
    <Badge status="new">
      {departement.name}
    </Badge>
    <Badge status="success">
      {region.name}
    </Badge>
  </div>
{/snippet}

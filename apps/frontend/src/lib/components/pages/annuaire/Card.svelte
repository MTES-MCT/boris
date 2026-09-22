<script lang="ts">
  import '@gouvfr/dsfr/dist/component/card/card.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';

  import Badge from '$components/common/Badge.svelte';

  import type { DepartementRelationnalView } from '$lib/utils/api-types';
  import type { Heading } from '$lib/utils/definitions';
  import { getBrsCardContent } from '$lib/utils/brs-diffusion-website';

  type Props = {
    departement: DepartementRelationnalView;
    city: string;
    address: string;
    programName?: string | null;
    ofsName?: string | null;
    distributorName?: string | null;
    ofs?: { name: string } | null;
    distributor?: { name: string } | null;
    deliveryMonth?: string | null;
    housingType?: 'new' | 'old';
    source: string;
    cardTitleElement?: Heading;
    narrow?: boolean;
    selected?: boolean;
    handleClose?: () => void;
  };

  const {
    departement,
    city,
    address,
    programName,
    ofsName,
    distributorName,
    ofs,
    distributor,
    deliveryMonth,
    housingType,
    source,
    cardTitleElement = 'h3',
    narrow = false,
    selected = false,
    handleClose,
  }: Props = $props();

  const content = $derived(
    getBrsCardContent({
      programName,
      distributorName: distributorName || distributor?.name,
      ofsName: ofsName || ofs?.name,
      address,
      city,
      deliveryMonth,
    }),
  );
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
          {content.title}
        </svelte:element>
        {#if content.distributorName}
          <p class="fr-text--sm fr-mb-1v">
            Commercialisé par <strong>{content.distributorName}</strong>
          </p>
        {/if}
        {#if content.ofsName}
          <p class="fr-text--sm fr-mb-1v">
            OFS : <strong>{content.ofsName}</strong>
          </p>
        {/if}
        {#if content.address}
          <p class="fr-text--sm fr-mb-0 text-[var(--text-mention-grey)]">
            <span
              class="fr-icon-map-pin-2-line fr-icon--sm mr-1"
              aria-hidden="true">
            </span>
            {content.address}, {city}
          </p>
        {/if}
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
            Voir le programme
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
    <Badge status="default">
      {departement.name}
    </Badge>
    {#if housingType}
      <Badge
        status={housingType === 'new' ? 'success' : 'info'}
        normalCase>
        {housingType === 'new' ? 'Neuf' : 'Ancien'}
      </Badge>
    {/if}
    {#if content.deliveryMonth}
      <Badge
        status="default"
        normalCase>
        Livraison {content.deliveryMonth}
      </Badge>
    {/if}
  </div>
{/snippet}

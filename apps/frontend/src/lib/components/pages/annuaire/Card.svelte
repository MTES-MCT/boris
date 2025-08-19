<script lang="ts">
  import '@gouvfr/dsfr/dist/component/card/card.min.css';

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
  };

  const {
    region,
    departement,
    city,
    ofsName,
    distributorName,
    source,
    cardTitleElement = 'h3',
  }: Props = $props();
</script>

<article class="fr-card fr-card--sm">
  <div class="fr-card__body">
    <div class="fr-card__content">
      <div class="location fr-mb-2w">
        <Badge>{region.name}</Badge>
        <Badge>{departement.name}</Badge>
        <Badge>{city}</Badge>
      </div>
      <div>
        <svelte:element
          this={cardTitleElement}
          class="fr-card__title">
          {ofsName}
        </svelte:element>
        <p class="fr-mb-0">{distributorName}</p>
      </div>
    </div>
    <div class="fr-card__footer">
      <ul class="fr-links-group fr-links-group--inline">
        <li>
          <a
            href={source}
            class="fr-link fr-icon-arrow-right-line fr-link--icon-right"
            target="_blank"
            rel="noopener">
            Libellé
          </a>
        </li>
      </ul>
    </div>
  </div>
</article>

<style lang="postcss">
  .location {
    display: flex;
    flex-wrap: wrap;
    gap: var(--1w);
  }
</style>

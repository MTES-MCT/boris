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
    narrow?: boolean;
    selected?: boolean;
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
  }: Props = $props();
</script>

<article
  class="fr-card fr-card--sm"
  class:narrow
  class:selected>
  <div class="fr-card__body">
    <div class="fr-card__content">
      <div class="location">
        <Badge
          status="info"
          hideIcon>
          {region.name}
        </Badge>
        <Badge
          status="new"
          hideIcon>
          {departement.name}
        </Badge>
        <Badge
          status="success"
          hideIcon>
          {city}
        </Badge>
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
            Lien
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
    margin-bottom: var(--2w);
  }

  .narrow {
    margin-bottom: var(--1v);

    .fr-card__body {
      padding-inline: var(--3w);
    }

    .fr-card__content {
      padding-top: var(--2w);
      padding-bottom: 0;

      .location {
        gap: var(--1v);
        margin-bottom: var(--1w);
      }
    }

    .fr-card__footer {
      padding-top: 0;
      padding-bottom: var(--1w);
    }
  }

  .selected {
    --border-default-grey: var(--color-blue-primary);

    background-color: var(--color-blue-deep);
    box-shadow: 0 6px 12px rgba(134, 144, 162, 0.3);
  }
</style>

<script lang="ts">
  import ChartProvider from '$components/common/Charts/ChartProvider.svelte';
  import { formatNumber } from '$lib/utils/formatters';
  import type { PublicEligibilityStatisticsDistribution } from '$lib/types/statistics';

  type Props = {
    title: string;
    items: PublicEligibilityStatisticsDistribution[];
    total?: number;
    detail?: string;
    class?: string;
  };

  const {
    title,
    items,
    total = items.reduce((sum, item) => sum + item.count, 0),
    detail = `sur ${formatNumber(total)} simulations renseignées`,
    class: className = '',
  }: Props = $props();

  const percentage = (count: number) =>
    total === 0 ? 0 : Math.round((count / total) * 100);
</script>

<article class={`fr-card fr-card--shadow stats-card ${className}`}>
  <div class="fr-card__body">
    <div class="fr-card__content">
      <h3 class="fr-card__title">{title}</h3>
      <p class="fr-card__detail">{detail}</p>

      {#if items.length > 0}
        <div
          class="chart"
          aria-hidden="true">
          <ChartProvider>
            <bar-chart
              x={JSON.stringify([items.map((item) => item.label)])}
              y={JSON.stringify([items.map((item) => item.count)])}
              name={JSON.stringify(['Simulations'])}
              selected-palette="sequentialDescending"
              horizontal="true">
            </bar-chart>
          </ChartProvider>
        </div>

        <ul
          class="values fr-raw-list"
          aria-label={`Valeurs — ${title}`}>
          {#each items as item}
            <li>
              <span>{item.label}</span>
              <strong>
                {formatNumber(item.count)} · {percentage(item.count)} %
              </strong>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="fr-text--sm fr-mb-0">Aucune donnée sur ce périmètre.</p>
      {/if}
    </div>
  </div>
</article>

<style>
  .stats-card {
    height: 100%;
  }

  .fr-card__content {
    padding: 2rem;
  }

  .fr-card__detail {
    margin-bottom: 1rem;
  }

  .chart {
    min-height: 18rem;
  }

  .values {
    border-top: 1px solid var(--border-default-grey);
    margin-top: 1rem;
    padding-top: 0.75rem;
  }

  .values li {
    align-items: baseline;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    padding: 0.35rem 0;
  }

  .values strong {
    flex: none;
    font-size: 0.875rem;
  }

  @media (max-width: 48rem) {
    .fr-card__content {
      padding: 1.5rem;
    }
  }
</style>

<script lang="ts">
  import ChartProvider from '$components/common/Charts/ChartProvider.svelte';
  import { formatNumber } from '$lib/utils/formatters';
  import type { PublicEligibilityStatisticsDistribution } from '$lib/types/statistics';

  type Props = {
    title: string;
    items: PublicEligibilityStatisticsDistribution[];
    total?: number | null;
    detail?: string;
    class?: string;
  };

  const {
    title,
    items,
    total = items.some((item) => item.count === null)
      ? null
      : items.reduce((sum, item) => sum + (item.count ?? 0), 0),
    detail = total === null
      ? 'effectif partiellement masqué pour protéger les petits groupes'
      : `sur ${formatNumber(total)} simulations renseignées`,
    class: className = '',
  }: Props = $props();

  const percentage = (count: number) =>
    total === null || total === 0 ? null : Math.round((count / total) * 100);
  const publishedItems = $derived(
    items.filter(
      (
        item,
      ): item is PublicEligibilityStatisticsDistribution & {
        count: number;
      } => item.count !== null,
    ),
  );
</script>

<article class={`fr-card fr-card--shadow h-full ${className}`}>
  <div class="fr-card__body">
    <div class="fr-card__content !p-6 md:!p-8">
      <h3 class="fr-h4 fr-mb-1w">{title}</h3>
      <p class="fr-text--sm fr-mb-4w text-[var(--text-mention-grey)]">
        {detail}
      </p>

      {#if items.length > 0}
        <div
          class="min-h-72"
          aria-hidden="true">
          <ChartProvider>
            <bar-chart
              x={JSON.stringify([publishedItems.map((item) => item.label)])}
              y={JSON.stringify([publishedItems.map((item) => item.count)])}
              name={JSON.stringify(['Simulations'])}
              selected-palette="sequentialDescending"
              horizontal="true">
            </bar-chart>
          </ChartProvider>
        </div>

        <ul
          class="fr-raw-list mt-4 border-t border-[var(--border-default-grey)] pt-3"
          aria-label={`Valeurs — ${title}`}>
          {#each items as item}
            <li class="flex items-baseline justify-between gap-4 py-[0.35rem]">
              <span>{item.label}</span>
              <strong class="shrink-0 text-sm">
                {#if item.count === null}
                  &lt; 5 · donnée masquée
                {:else if percentage(item.count) !== null}
                  {formatNumber(item.count)} · {percentage(item.count)} %
                {:else}
                  {formatNumber(item.count)}
                {/if}
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

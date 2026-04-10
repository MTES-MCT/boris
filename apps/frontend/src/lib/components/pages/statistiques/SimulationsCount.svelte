<script lang="ts">
  import ChartProvider from '$components/common/Charts/ChartProvider.svelte';
  import LineChart from '$components/common/Charts/LineChart.svelte';
  import { formatNumber } from '$lib/utils/formatters';
  import type { PageData } from '../../../../routes/statistiques/$types';
  import StatisticBox from './StatisticBox.svelte';

  type Props = {
    count: number;
    montlhlySummary: PageData['simulationsMonthlySummary'];
  };

  const { count, montlhlySummary }: Props = $props();

  const formattedData: Record<
    string,
    PageData['simulationsMonthlySummary']['data']
  > = $derived.by(() => {
    const years = [
      ...new Set(montlhlySummary.data.map((item) => item.year)),
    ].sort((a, b) => Number(a) - Number(b));

    let result: Record<string, PageData['simulationsMonthlySummary']['data']> =
      {};

    years.forEach((year) => {
      result = {
        ...result,
        [year]: montlhlySummary.data
          .filter((item) => item.year === year)
          .sort((a, b) => Number(a.month) - Number(b.month)),
      };
    });

    const mostRecentYear: string = years[years.length - 1];

    if (result[mostRecentYear]?.length === 1) {
      delete result[mostRecentYear];
    } else {
      result[mostRecentYear]?.pop();
    }

    return result;
  });

  const chartYears = $derived.by(() => Object.keys(formattedData));

  const chartLabels = $derived.by(() => {
    const firstYear = chartYears[0];

    if (!firstYear) {
      return [];
    }

    return formattedData[firstYear].map((item) =>
      new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(
        new Date(2000, Number(item.month) - 1, 1),
      ),
    );
  });

  const formattedStartDate = $derived.by(() => {
    const year = chartYears[0];
    const month = year ? formattedData[year]?.[0]?.month : undefined;

    if (!year || !month) {
      return 'date inconnue';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(Number(year), Number(month) - 1, 1));
  });
</script>

<StatisticBox>
  <h2 class="fr-h3">Nombre de simulations d'éligibilité au BRS par mois</h2>
  <p>
    Depuis le lancement du simulateur en {formattedStartDate}, nous avons
    enregistré
    <b>{formatNumber(count)}</b>
    simulations d'éligibilité au BRS.
  </p>
  <ChartProvider>
    <LineChart
      x={[chartLabels]}
      y={chartYears.map((year) => {
        return formattedData[year].map((item) => Number(item.count));
      })}
      name={chartYears}
      selectedPalette="categorical"
      unitTooltip="Nombre de simulations">
    </LineChart>
  </ChartProvider>
</StatisticBox>

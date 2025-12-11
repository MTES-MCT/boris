<script lang="ts">
  import StatisticBox from './StatisticBox.svelte';
  import type { PageProps } from '../../../../routes/statistiques/$types';
  import MapChart from '$components/common/Charts/MapChart.svelte';
  import ChartProvider from '$components/common/Charts/ChartProvider.svelte';

  type Props = {
    departementalConnectionCount: PageProps['data']['departementalConnectionCount'];
  };

  const { departementalConnectionCount }: Props = $props();

  const formattedDate = (): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'full',
      timeZone: 'Europe/Paris',
    }).format(new Date());
  };
</script>

<StatisticBox>
  <h2 class="fr-h3">
    Nombre de ménages mis en relation avec un OFS ou son commercialisateur par
    département
  </h2>

  <ChartProvider>
    <MapChart
      data={departementalConnectionCount}
      value="Par département"
      name=""
      level="dep"
      date={formattedDate()} />
  </ChartProvider>
</StatisticBox>

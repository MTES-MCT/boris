<script lang="ts">
  import StatisticBox from './StatisticBox.svelte';
  import type { PageData } from '../../../../routes/statistiques/$types';
  import MapChart from '$components/common/Charts/MapChart.svelte';
  import ChartProvider from '$components/common/Charts/ChartProvider.svelte';
  import { formattedToday } from '$lib/utils/helpers';

  type Props = {
    departementalConnectionCount: PageData['departementalConnectionCount'];
  };

  const { departementalConnectionCount }: Props = $props();
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
      date={formattedToday()} />
  </ChartProvider>
</StatisticBox>

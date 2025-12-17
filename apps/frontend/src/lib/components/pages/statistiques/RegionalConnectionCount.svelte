<script lang="ts">
  import StatisticBox from './StatisticBox.svelte';
  import type { PageData } from '../../../../routes/statistiques/$types';
  import MapChart from '$components/common/Charts/MapChart.svelte';
  import ChartProvider from '$components/common/Charts/ChartProvider.svelte';
  import { formattedToday } from '$lib/utils/helpers';

  type Props = {
    regionalConnectionCount: PageData['regionalConnectionCount'];
  };

  const { regionalConnectionCount }: Props = $props();
</script>

<StatisticBox>
  <h2 class="fr-h3">
    Nombre de ménages mis en relation avec un OFS ou son commercialisateur par
    région
  </h2>

  <ChartProvider>
    <MapChart
      data={regionalConnectionCount}
      value="Par région"
      name=""
      level="reg"
      date={formattedToday()} />
  </ChartProvider>
</StatisticBox>

<script lang="ts">
  import StatisticBox from './StatisticBox.svelte';
  import ChartProvider from '$components/common/Charts/ChartProvider.svelte';
  import PieChart from '$components/common/Charts/PieChart.svelte';
  import type { PageData } from '../../../../routes/statistiques/$types';

  type Props = {
    housingTypesRepartition: PageData['realEstateSituation'];
  };

  const { housingTypesRepartition }: Props = $props();
</script>

<StatisticBox>
  <h2 class="fr-h3">
    Répartition des types de logements des ménages recontactés après simulation
    d'éligibilité
  </h2>

  <ChartProvider>
    <PieChart
      x={[housingTypesRepartition.map((item) => item.realEstateSituation)]}
      y={[housingTypesRepartition.map((item) => Number(item.count))]}
      name={housingTypesRepartition.map((item) => item.realEstateSituation)}
      selectedPalette="categorical"
      unitTooltip="%" />
  </ChartProvider>
</StatisticBox>

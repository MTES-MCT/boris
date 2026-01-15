<script lang="ts">
  import Table from '$components/common/Table.svelte';
  import type { PageData } from '../../../../routes/statistiques/$types';

  import StatisticBox from './StatisticBox.svelte';

  type Props = {
    acquisitionSimulationsConversionFunnel: PageData['acquisitionSimulationsConversionFunnel'];
  };

  const { acquisitionSimulationsConversionFunnel }: Props = $props();
</script>

<StatisticBox>
  <h2 class="fr-h3 !mb-0">
    Le funnel de conversion du simulateur d'acquisition
  </h2>

  <Table
    theads={[
      'Étape',
      'Visiteurs',
      'Taux de conversion',
      'Taux de réponse total',
      'Abandon',
      "Taux d'abandon",
    ]}
    tbodies={acquisitionSimulationsConversionFunnel.map((row, index) => {
      const isFirstRow = index === 0;

      if (isFirstRow) {
        return [
          `<span class="fr-text--bold">${index + 1}. </span>${row.title}`,
          row.value.toString(),
          '-',
          '-',
          '-',
          '-',
        ];
      } else {
        return [
          `<span class="fr-text--bold">${index + 1}. </span>${row.title}`,
          row.value.toString(),
          `<span class="fr-text--bold text-green-700">${row.conversionRate.toFixed(2)}%</span>`,
          `<span class="fr-text--bold text-green-700">${row.totalRespondantsRate.toFixed(2)}%</span>`,
          row.terminations.toString(),
          `<span class="fr-text--bold text-red-700">${row.terminationRate.toFixed(2)}%</span>`,
        ];
      }
    })}
    multiline />
</StatisticBox>

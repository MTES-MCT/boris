<script lang="ts">
  import Table from '$components/common/Table.svelte';
  import Tile from '$components/common/Tile.svelte';
  import type { PageData } from '../../../../routes/statistiques/$types';

  import StatisticBox from './StatisticBox.svelte';

  type Props = {
    conversionFunnel: PageData['conversionFunnel'];
  };

  const { conversionFunnel }: Props = $props();
</script>

<StatisticBox>
  <h2 class="fr-h3 !mb-0">
    Le funnel de conversion du simulateur d'éligibilité
  </h2>
  <p class="fr-text--bold">Sur les 30 derniers jours</p>

  <Table
    theads={[
      'Étape',
      'Visiteurs',
      'Conversions',
      'Taux de conversion',
      'Taux de réponse total',
      'Abandon',
      "Taux d'abandon",
    ]}
    tbodies={conversionFunnel.map((row, index) => {
      const isFirst = index === 0;
      const isLast = index === conversionFunnel.length - 1;

      return [
        `<span class="fr-text--bold">${index + 1}. </span>${row.title}`,
        row.value.toString(),
        isLast ? '-' : row.conversions.toString(),
        isLast
          ? '-'
          : `<span class="fr-text--bold text-green-700">${row.conversionRate.toFixed(2)}%</span>`,
        isFirst
          ? '-'
          : `<span class="fr-text--bold text-green-700">${row.totalRespondantsRate.toFixed(2)}%</span>`,
        isLast ? '-' : row.terminations.toString(),
        isLast
          ? '-'
          : `<span class="fr-text--bold text-red-700">${row.terminationRate.toFixed(2)}%</span>`,
      ];
    })}
    multiline />
</StatisticBox>

<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import Stats from '$components/pages/statistiques/Stats.svelte';
  import SimulationsCount from '$components/pages/statistiques/SimulationsCount.svelte';

  import type { PageProps } from './$types';
  import DepartementalConnectionCount from '$components/pages/statistiques/DepartementalConnectionCount.svelte';
  import RegionalConnectionCount from '$components/pages/statistiques/RegionalConnectionCount.svelte';
  import HousingTypesRepartition from '$components/pages/statistiques/HousingTypesRepartition.svelte';
  const { data }: PageProps = $props();

  const {
    investedAmount,
    purchasePlanAmount,
    eligibility,
    countSimulations,
    simulationsMonthlySummary,
    brsKnowledge,
    realEstateSituation,
    ofssAmount,
    regionalConnectionCount,
    departementalConnectionCount,
  } = data;

  const householdsData = $derived.by(() => {
    const total = brsKnowledge.reduce(
      (sum, item) => sum + Number(item.count),
      0,
    );

    const totalUnawareOfBrs = brsKnowledge
      .filter((item) => item.brsKnowledge === 'Non')
      .reduce((sum, item) => sum + Number(item.count), 0);

    const totalsRealEstateSituation = realEstateSituation
      .filter(
        (item) =>
          item.realEstateSituation !== null &&
          item.realEstateSituation !== 'dans une autre situation immobilière',
      )
      .map((item) => {
        return {
          realEstateSituation: item.realEstateSituation,
          count: Math.round((Number(item.count) / total) * 100).toString(),
        };
      });

    totalsRealEstateSituation.push({
      realEstateSituation: 'dans une autre situation immobilière',
      count: (
        100 -
        totalsRealEstateSituation.reduce(
          (sum, item) => sum + Number(item.count),
          0,
        )
      ).toString(),
    });

    return {
      total: total,
      brsUnawarePercentage: (totalUnawareOfBrs / total) * 100,
      totalsRealEstateSituation,
    };
  });
</script>

<Section>
  <h1 class="!mb-0">Statistiques</h1>

  <Stats
    hideDisclaimer
    {investedAmount}
    {eligibility}
    {purchasePlanAmount}
    {ofssAmount}
    {householdsData} />

  <div class="flex flex-col gap-16">
    <SimulationsCount
      count={countSimulations}
      montlhlySummary={simulationsMonthlySummary} />

    <RegionalConnectionCount {regionalConnectionCount} />

    <DepartementalConnectionCount {departementalConnectionCount} />

    <HousingTypesRepartition
      housingTypesRepartition={householdsData.totalsRealEstateSituation} />
  </div>
</Section>

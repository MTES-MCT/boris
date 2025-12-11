<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import Stats from '$components/pages/statistiques/Stats.svelte';
  import SimulationsCount from '$components/pages/statistiques/SimulationsCount.svelte';

  import type { PageProps } from './$types';
  import DepartementalConnectionCount from '$components/pages/statistiques/DepartementalConnectionCount.svelte';
  import RegionalConnectionCount from '$components/pages/statistiques/RegionalConnectionCount.svelte';
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
</script>

<Section>
  <h1 class="!mb-0">Statistiques</h1>

  <Stats
    hideDisclaimer
    {investedAmount}
    {eligibility}
    {brsKnowledge}
    {realEstateSituation}
    {purchasePlanAmount}
    {ofssAmount} />

  <div class="flex flex-col gap-16">
    <SimulationsCount
      count={countSimulations}
      montlhlySummary={simulationsMonthlySummary} />

    <RegionalConnectionCount {regionalConnectionCount} />

    <DepartementalConnectionCount {departementalConnectionCount} />
  </div>
</Section>

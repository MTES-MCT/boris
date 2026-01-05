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
    householdsData,
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

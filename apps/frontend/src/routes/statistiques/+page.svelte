<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import Stats from '$components/pages/statistiques/Stats.svelte';
  import SimulationsCount from '$components/pages/statistiques/SimulationsCount.svelte';

  import type { PageProps } from './$types';
  import DepartementalConnectionCount from '$components/pages/statistiques/DepartementalConnectionCount.svelte';
  import RegionalConnectionCount from '$components/pages/statistiques/RegionalConnectionCount.svelte';
  import HousingTypesRepartition from '$components/pages/statistiques/HousingTypesRepartition.svelte';
  import ConversionFunnel from '$components/pages/statistiques/ConversionFunnel.svelte';
  import AcquisitionSimulationsConversionFunnel from '$components/pages/statistiques/AcquisitionSimulationsConversionFunnel.svelte';
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
    conversionFunnel,
    acquisitionSimulationsConversionFunnel,
  } = data;
</script>

<svelte:head>
  <title>Statistiques - BoRiS</title>
  <meta
    name="description"
    content="Voir les statistiques du Bail Réel Solidaire (BRS) sur BoRiS." />
</svelte:head>

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

    <ConversionFunnel {conversionFunnel} />

    <AcquisitionSimulationsConversionFunnel
      {acquisitionSimulationsConversionFunnel} />

    <RegionalConnectionCount {regionalConnectionCount} />

    <DepartementalConnectionCount {departementalConnectionCount} />

    <HousingTypesRepartition
      housingTypesRepartition={householdsData.totalsRealEstateSituation} />
  </div>
</Section>

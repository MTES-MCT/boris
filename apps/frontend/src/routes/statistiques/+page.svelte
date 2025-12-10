<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import SimulationsCount from '$components/pages/statistiques/SimulationsCount.svelte';

  import type { PageProps } from './$types';
  const { data }: PageProps = $props();
</script>

<Section>
  <h1>Statistiques</h1>

  <SimulationsCount
    count={data.countSimulations}
    montlhlySummary={data.simulationsMonthlySummary} />
</Section>

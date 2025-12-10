<script lang="ts">
  import { onMount } from 'svelte';
  import '@gouvfr/dsfr/dist/dsfr.min.css';

  onMount(async () => {
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr/dist/dsfr.module.min.js');
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr-chart');
  });

  import Section from '$components/common/Section.svelte';
</script>

<Section>
  <h1>Statistiques</h1>
  <line-chart
    x="[[1, 2, 3, 4]]"
    y="[[10, 20, 30, 40]]">
  </line-chart>
</Section>

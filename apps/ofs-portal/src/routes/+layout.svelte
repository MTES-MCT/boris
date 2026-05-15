<script lang="ts">
  import '@gouvfr/dsfr/dist/dsfr.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons.min.css';
  import { onMount } from 'svelte';

  let { data, children } = $props();

  onMount(async () => {
    await import('@gouvfr/dsfr/dist/dsfr.module.min.js');
  });
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{@render children()}

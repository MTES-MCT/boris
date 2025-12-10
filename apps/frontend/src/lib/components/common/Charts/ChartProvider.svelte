<script lang="ts">
  import { onMount, type Snippet } from 'svelte';

  import '@gouvfr/dsfr-chart/css';

  onMount(async () => {
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr-chart');
  });

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

{@render children()}

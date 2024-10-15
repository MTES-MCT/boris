<script lang="ts">
  import '@gouvfr/dsfr/dist/dsfr.main.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons.min.css';

  onMount(async () => {
    // await import('@gouvfr/dsfr/dist/dsfr.module.min');
  });

  import Header from '$lib/components/Header/Header.svelte';
  import Footer from '$lib/components/Footer/Footer.svelte';

  import { onMount, type Snippet } from 'svelte';

  const { children }: { children: Snippet } = $props();
</script>

<Header />

<main>
  {@render children()}
</main>

<Footer />

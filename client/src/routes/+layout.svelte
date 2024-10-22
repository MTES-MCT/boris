<script lang="ts">
  import '@gouvfr/dsfr/dist/dsfr.min.css';
  import '@gouvfr/dsfr/dist/utility/utility.min.css';
  import { onMount, type Snippet } from 'svelte';

  onMount(async () => {
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr/dist/dsfr.module.min');
  });

  import Header from '$lib/components/Header/Header.svelte';
  import Footer from '$lib/components/Footer/Footer.svelte';

  const { children }: { children: Snippet } = $props();
</script>

<Header />

<main class="fr-container">
  <div class="fr-grid-row">
    <div class="fr-col fr-py-3w fr-py-md-6w">
      {@render children()}
    </div>
  </div>
</main>

<Footer />

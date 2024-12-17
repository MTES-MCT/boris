<script lang="ts">
  import '@gouvfr/dsfr/dist/dsfr.min.css';
  import '@gouvfr/dsfr/dist/utility/utility.min.css';
  import '$assets/styles/main.css';
  import { onMount, type Snippet } from 'svelte';

  onMount(async () => {
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr/dist/dsfr.module.min');
  });

  import Header from '$components/header/header.svelte';
  import Footer from '$components/footer/footer.svelte';
  import GoogleAnalytics from '$components/google-analytics/googleAnalytics.svelte';
  import Favicon from '$components/Favicon.svelte';

  const { children }: { children: Snippet } = $props();
</script>

<Favicon />
<GoogleAnalytics />

<Header />

<main>
  {@render children()}
</main>

<Footer />

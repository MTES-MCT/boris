<script lang="ts">
  import '@gouvfr/dsfr/dist/dsfr.min.css';
  import '@gouvfr/dsfr/dist/utility/utility.min.css';
  import '$assets/styles/main.css';

  import { onMount, type Snippet } from 'svelte';

  import Favicon from '$components/layout/Favicon.svelte';
  import Header from '$components/layout/Header.svelte';
  import Footer from '$components/layout/Footer.svelte';
  import Analytics from '$components/layout/Analytics.svelte';

  onMount(async () => {
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr/dist/dsfr.module.min');
  });

  type Props = { children: Snippet };
  const { children }: Props = $props();
</script>

<Favicon />
<Analytics />

<Header />

<main>
  {@render children()}
</main>

<Footer />

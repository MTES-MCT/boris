<script lang="ts">
  import '@gouvfr/dsfr/dist/core/core.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons.min.css';
  import '$assets/styles/main.css';

  onMount(async () => {
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr/dist/core/core.module.min');
  });

  import { onMount, type Snippet } from 'svelte';

  import Favicon from '$components/layout/Favicon.svelte';
  import SkipLinks from '$components/layout/SkipLinks.svelte';
  import Analytics from '$components/layout/Analytics.svelte';
  import Header from '$components/layout/Header.svelte';
  import Footer from '$components/layout/Footer.svelte';
  import NoScrollOnNavigation from '$components/layout/NoScrollOnNavigation.svelte';
  import Consent from '$components/common/Consent.svelte';
  import { blockSearchEngineIndexing } from '$lib/utils/helpers';
  import { page } from '$app/state';

  type Props = { children: Snippet };
  const { children }: Props = $props();
</script>

<svelte:head>
  {#if blockSearchEngineIndexing(page)}
    <meta
      name="robots"
      content="noindex, nofollow" />
  {/if}
</svelte:head>

<Favicon />
<Consent />
<Analytics />
<NoScrollOnNavigation />
<SkipLinks />
<Header />

<main id="main">
  {@render children()}
</main>

<Footer />

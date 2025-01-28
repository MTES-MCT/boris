<script lang="ts">
  import '@gouvfr/dsfr/dist/core/core.min.css';
  import '$assets/styles/main.css';
  import { type Snippet } from 'svelte';

  import Favicon from '$components/layout/Favicon.svelte';
  import SkipLinks from '$components/layout/SkipLinks.svelte';
  import Analytics from '$components/layout/Analytics.svelte';
  import Header from '$components/layout/Header.svelte';
  import Footer from '$components/layout/Footer.svelte';
  import NoScrollOnNavigation from '$components/layout/NoScrollOnNavigation.svelte';

  type Props = { children: Snippet };
  const { children }: Props = $props();
</script>

<NoScrollOnNavigation />
<Favicon />
<Analytics />
<SkipLinks />
<Header />

<main id="main">
  {@render children()}
</main>

<Footer />

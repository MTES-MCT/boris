<script lang="ts">
  import '@gouvfr/dsfr/dist/core/core.min.css';
  import '$assets/styles/main.css';
  import { type Snippet } from 'svelte';

  import Favicon from '$components/layout/Favicon.svelte';
  import Header from '$components/layout/Header.svelte';
  import Footer from '$components/layout/Footer.svelte';
  import Analytics from '$components/layout/Analytics.svelte';
  import SkipLinks from '$components/common/SkipLinks.svelte';

  type Props = { children: Snippet };
  const { children }: Props = $props();
</script>

<Favicon />
<Analytics />
<SkipLinks />
<Header />

<main id="main">
  {@render children()}
</main>

<Footer />

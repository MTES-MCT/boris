<script lang="ts">
  import '@gouvfr/dsfr/dist/dsfr.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons.min.css';
  import '$assets/styles/main.css';

  import dsfrManager from '$lib/managers/dsfr.svelte';

  onMount(async () => {
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr/dist/dsfr.module.min.js');

    dsfrManager.isWindowDsfrDefined = true;
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
  import Notice from '$components/common/Notice.svelte';

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
  <Notice
    type="info"
    content="Aidez-nous à améliorer BoRiS"
    hasDescription
    desc="L'équipe BoRiS recherche des volontaires pour participer à des tests utilisateurs en visioconférence d'une durée d'environ 45 minutes. Ces sessions nous permettront d'améliorer l'expérience du site pour les dizaines de milliers de visiteurs qui cherchent à se loger en Bail Réel Solidaire. Si vous souhaitez nous aider, nous vous invitons à cliquer sur le lien ci-dessous."
    hasLink
    linkHref="https://tally.so/r/ZjoJLB"
    linkLabel="Répondre au questionnaire"
    linkTitle="Répondre au questionnaire"
    blank
    dismissible />
  {@render children()}
</main>

<Footer />

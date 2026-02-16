<script lang="ts">
  import type { PageProps } from './$types';

  import Page from '$components/common/SideNavPage/Page.svelte';

  const { data }: PageProps = $props();
  const {
    title,
    description,
    sections,
    previousStep,
    nextStep,
    headTitle,
    showAdilSnippet,
  } = $derived(data.step);
</script>

<svelte:head>
  <title>{headTitle}</title>
  <meta
    name="description"
    content={description} />
</svelte:head>

{#key title}
  <Page
    {title}
    {sections}
    {previousStep}
    {nextStep}
    {showAdilSnippet} />
{/key}

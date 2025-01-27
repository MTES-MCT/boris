<script lang="ts">
  import NoScrollOnNavigation from '$components/common/NoScrollOnNavigation.svelte';
  import Page from '$components/pages/tout-savoir-sur-le-bail-reel-solidaire-brs/[slug]/Page.svelte';

  const { data } = $props();
  const { title, sections, previousStep, nextStep } = $derived(data);
</script>

<svelte:head>
  <title>{title} - Boris</title>
</svelte:head>

<NoScrollOnNavigation />

{#key title}
  <Page
    {title}
    {sections}
    {previousStep}
    {nextStep} />
{/key}

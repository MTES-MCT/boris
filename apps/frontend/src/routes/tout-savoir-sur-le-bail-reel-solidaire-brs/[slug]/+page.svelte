<script lang="ts">
  import Page from '$components/common/SideNavPage/Page.svelte';

  const { data } = $props();
  const { title, description, sections, previousStep, nextStep, headTitle } =
    $derived(data);
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
    {nextStep} />
{/key}

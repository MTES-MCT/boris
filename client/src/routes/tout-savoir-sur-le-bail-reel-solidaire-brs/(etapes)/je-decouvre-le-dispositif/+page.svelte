<script lang="ts">
  import Page from '$components/pages/tout-savoir-sur-le-bail-reel-solidaire-brs/(etapes)/Page.svelte';
  import { sections } from './content';
</script>

<svelte:head>
  <title>Je découvre le dispositif - Boris</title>
</svelte:head>

<div class="background-gradient">
  <Page
    title="Je découvre le dispositif"
    {sections} />
</div>

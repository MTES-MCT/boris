<script lang="ts">
  import Page from '$components/pages/tout-savoir-sur-le-bail-reel-solidaire-brs/(etapes)/Page.svelte';
  import { sections } from './content';
</script>

<svelte:head>
  <title>Je trouve mon logement - Boris</title>
</svelte:head>

<div class="background-gradient">
  <Page
    title="Je trouve mon logement"
    {sections} />
</div>

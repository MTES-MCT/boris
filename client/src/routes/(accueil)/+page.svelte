<script lang="ts">
  import Cta from '$components/accueil/cta/cta.svelte';
  import Hero from '$components/accueil/hero/hero.svelte';
  import Infos from '$components/accueil/infos/infos.svelte';
  import Promesse from '$components/accueil/promesse/promesse.svelte';
  import Verbatims from '$components/accueil/verbatims/verbatims.svelte';
</script>

<svelte:head>
  <title>Boris - Page d'accueil</title>
</svelte:head>

<Hero />

<div class="background-gradient">
  <Promesse />
  <Infos />
  <Verbatims />
  <Cta />
</div>

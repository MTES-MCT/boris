<script lang="ts">
  import PageCta from '$components/common/PageCta.svelte';
  import Hero from '$components/pages/accueil/Hero.svelte';
  import Infos from '$components/pages/accueil/Infos.svelte';
  import Promesse from '$components/pages/accueil/Promesses.svelte';
  import Verbatims from '$components/pages/accueil/Verbatims.svelte';
</script>

<svelte:head>
  <title>Accueil - Boris</title>
</svelte:head>

<Hero />

<div class="background-gradient">
  <Promesse />
  <Infos />
  <Verbatims />
  <PageCta />
</div>

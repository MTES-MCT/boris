<script>
  import Chronology from '$components/pages/notre-mission/Chronology.svelte';
  import Hero from '$components/pages/notre-mission/Hero.svelte';
  import Team from '$components/pages/notre-mission/Team.svelte';
</script>

<svelte:head>
  <title>Boris - Notre mission</title>
</svelte:head>

<div class="background-gradient">
  <Hero />
  <Team />
  <Chronology />
</div>

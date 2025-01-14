<script>
  import Chronology from '$components/pages/notre-mission/Chronology.svelte';
  import Hero from '$components/pages/notre-mission/Hero.svelte';
  import Stats from '$components/pages/notre-mission/Stats.svelte';
  import Team from '$components/pages/notre-mission/Team.svelte';
</script>

<svelte:head>
  <title>Notre mission - Boris</title>
</svelte:head>

<div class="background-gradient">
  <Hero />
  <Team />
  <Chronology />
  <Stats />
</div>

<script>
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Hero from '$components/pages/notre-mission/Hero.svelte';
  import Team from '$components/pages/notre-mission/Team.svelte';
  import Chronology from '$components/pages/notre-mission/Chronology.svelte';
  import Stats from '$components/pages/notre-mission/Stats.svelte';
</script>

<svelte:head>
  <title>Notre mission - Boris</title>
</svelte:head>

<GradientBackgroundWrapper>
  <Hero />
  <Team />
  <Chronology />
  <Stats />
</GradientBackgroundWrapper>

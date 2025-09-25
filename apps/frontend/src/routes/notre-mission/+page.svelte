<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Hero from '$components/pages/notre-mission/Hero.svelte';
  import Team from '$components/pages/notre-mission/Team.svelte';
  import Chronology from '$components/pages/notre-mission/Chronology.svelte';
  import Stats from '$components/pages/notre-mission/Stats.svelte';
  import type { DataType } from './+page.server';

  type Props = {
    data: DataType;
  };

  const { data }: Props = $props();
</script>

<svelte:head>
  <title>Notre mission - Boris</title>
  <meta
    name="description"
    content="Découvrez la mission de Boris, plateforme dédiée au Bail Réel Solidaire, qui facilite l'accès à la propriété pour tous en accompagnant les ménages dans leur parcours vers l'achat." />
</svelte:head>

<GradientBackgroundWrapper>
  <Hero />
  <Team />
  <Chronology />
  <Stats statistics={data.statistics} />
</GradientBackgroundWrapper>

<script lang="ts">
  import type { DataType } from './+page.server';

  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Hero from '$components/common/StepPage/Hero.svelte';
  import Definition from '$components/pages/organisme-de-foncier-solidaire/Definition.svelte';
  import Role from '$components/pages/organisme-de-foncier-solidaire/Role.svelte';
  import Proximity from '$components/pages/organisme-de-foncier-solidaire/Proximity.svelte';
  import OfsList from '$components/pages/organisme-de-foncier-solidaire/OfsList.svelte';
  import { formatOfss } from '$lib/utils/formatters';
  import Synthesis from '$components/pages/organisme-de-foncier-solidaire/Synthesis.svelte';

  type Props = {
    data: DataType;
  };

  const { data }: Props = $props();

  const ofss = data.ofss.items;
  const formattedOfss = formatOfss(ofss);
</script>

<svelte:head>
  <title>OFS : définition, rôle, actions et liste - Boris</title>
  <meta
    name="description"
    content="OFS : découvrez les missions d'un OFS, ses actions, comprenez le lien OFS-BRS et identifiez les OFS proches de chez vous. " />
</svelte:head>

<GradientBackgroundWrapper>
  <Hero title="Les OFS : à quoi servent-ils, où les trouver ?">
    <span></span>
  </Hero>
  <Definition />
  <Role />
  <Proximity />
  <OfsList regions={formattedOfss} />
  <Synthesis />
</GradientBackgroundWrapper>

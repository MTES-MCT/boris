<script lang="ts">
  import type { PageProps } from './$types';

  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Hero from '$components/pages/notre-mission/Hero.svelte';
  import Team from '$components/pages/notre-mission/Team.svelte';
  import Chronology from '$components/pages/notre-mission/Chronology.svelte';
  import Stats from '$components/pages/statistiques/Stats.svelte';
  import Section from '$components/common/Section.svelte';

  const { data }: PageProps = $props();
  const {
    investedAmount,
    purchasePlanAmount,
    ofssAmount,
    eligibility,
    householdsData,
  } = data;
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

  <Section id="statistiques">
    <div
      class="max-w-[768px] mx-auto p-4 md:p-10 rounded-tl-xl rounded-tr-xl bg-white">
      <Stats
        {investedAmount}
        {eligibility}
        {householdsData}
        {purchasePlanAmount}
        {ofssAmount} />

      <div class="flex justify-center">
        <a
          href="/statistiques"
          class="fr-link fr-text--bold">
          Plus de détails ici
          <span class="fr-icon--sm fr-icon-arrow-right-line"></span>
        </a>
      </div>
    </div>
  </Section>
</GradientBackgroundWrapper>

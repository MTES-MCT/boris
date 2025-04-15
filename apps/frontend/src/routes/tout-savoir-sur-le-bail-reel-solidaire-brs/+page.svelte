<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Hero from '$components/pages/step-pages/Hero.svelte';
  import Promesses from '$components/pages/step-pages/Promesses.svelte';
  import Steps from '$components/pages/tout-savoir-sur-le-bail-reel-solidaire-brs/Steps.svelte';
  import PageCta from '$components/common/PageCta.svelte';
  import { toutSavoirSurLeBRSPromesses } from '$lib/utils/constants';
</script>

<svelte:head>
  <title>Tout savoir sur le BRS - Boris</title>
  <meta
    name="description"
    content="Découvrez le Bail Réel Solidaire (BRS), un dispositif qui permet d'accéder à la propriété à un prix abordable grâce à un partenariat avec des organismes de fonciers solidaires. Apprenez-en plus sur ses avantages, critères et fonctionnement." />
</svelte:head>

<GradientBackgroundWrapper>
  <Hero title="Qu'est ce que le Bail Réel Solidaire ?">
    <p class="fr-mb-0">
      Le Bail Réel Solidaire (BRS) est un dispositif mis en place par l’État
      permettant à des ménages qui ne pourraient pas devenir propriétaires d'un
      logement au prix du marché d’accéder à la propriété de leur résidence
      principale.
    </p>
  </Hero>
  <Promesses
    title="Le BRS en 3 points clés."
    promesses={toutSavoirSurLeBRSPromesses} />
  <Steps />
  <PageCta />
</GradientBackgroundWrapper>

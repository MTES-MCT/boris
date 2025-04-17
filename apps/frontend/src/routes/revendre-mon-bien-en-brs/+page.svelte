<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Hero from '$components/pages/step-page/Hero.svelte';
  import Promesses from '$components/pages/step-page/Promesses.svelte';
  import Steps from '$components/pages/step-page/Steps.svelte';
  import PageCta from '$components/common/PageCta.svelte';
  import { reventePromesses } from '$lib/utils/constants';
  import { steps } from './content';
</script>

<svelte:head>
  <title>Tout savoir sur le BRS - Boris</title>
  <meta
    name="description"
    content="Découvrez le Bail Réel Solidaire (BRS), un dispositif qui permet d'accéder à la propriété à un prix abordable grâce à un partenariat avec des organismes fonciers solidaires. Apprenez-en plus sur ses avantages, critères et fonctionnement." />
</svelte:head>

<GradientBackgroundWrapper>
  <Hero title="Revendre mon bien en BRS">
    <p class="fr-mb-0">
      Vous souhaitez revendre votre bien en BRS ? BoRiS est là pour vous guider
      à chacune des phases ! Notre équipe du Ministère du logement peut même
      vous accompagner gratuitement dans ce projet. Cela vous intéresse ?
      Contactez-nous
      <a
        href="/nous-contacter"
        class="fr-link">
        ici
      </a>
      <br />
      <br />
      Sur cette page, vous découvrirez chaque étape jusqu’à la vente.
    </p>
  </Hero>
  <Promesses
    title="La revente en 3 points clés"
    promesses={reventePromesses} />
  <Steps {steps} />
  <PageCta />
</GradientBackgroundWrapper>

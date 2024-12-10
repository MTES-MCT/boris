<script lang="ts">
  import HorizontalCard from '$components/cards/horizontal/horizontal.svelte';
  import Section from '$components/section/section.svelte';
  import brsEtape1 from '$assets/images/brs-etape-1.jpg';
  import brsEtape2 from '$assets/images/brs-etape-2.jpg';
  import brsEtape3 from '$assets/images/brs-etape-3.jpg';
  import brsEtape4 from '$assets/images/brs-etape-4.jpg';
  import brsEtape5 from '$assets/images/brs-etape-5.jpg';
  import Hero from '$components/tout-savoir-sur-le-bail-reel-solidaire-brs/hero/hero.svelte';
  import Promesse from '$components/tout-savoir-sur-le-bail-reel-solidaire-brs/promesse/promesse.svelte';
</script>

<svelte:head>
  <title>Boris - Tout savoir sur le BRS</title>
</svelte:head>

<div class="background-gradient">
  <Hero />
  <Promesse />

  <Section
    title="Les étapes du BRS"
    titleElement="h2">
    <div class="cards-container">
      <HorizontalCard
        id="etape1"
        title="Etape 1 : je découvre le dispositif"
        content="Découvrez les informations relatives au Bail Réel solidaire et testez votre éligibilité."
        href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-decouvre-le-dispositif"
        imgSrc={brsEtape1}
        linkLabel="En savoir plus" />

      <HorizontalCard
        id="etape2"
        title="Etape 2 : je trouve mon logement"
        content="Trouvez le logement de vos rêves en BRS et candidatez pour l'obtenir."
        href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-trouve-mon-logement"
        imgSrc={brsEtape2}
        linkLabel="En savoir plus"
        reversed />

      <HorizontalCard
        id="etape3"
        title="Étape 3 : je cherche des financements"
        content="Assurez-vous de pouvoir financer votre achat grâce à vos fonds propres, un emprunt bancaire et des aides éventuelles."
        href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-cherche-des-financements"
        imgSrc={brsEtape3}
        linkLabel="En savoir plus" />

      <HorizontalCard
        id="etape4"
        title="Étape 4 : je deviens propriétaire"
        content="Une fois tous les éléments finalisés, vous pouvez signer l'acte de vente chez le notaire."
        href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-deviens-proprietaire"
        imgSrc={brsEtape4}
        linkLabel="En savoir plus"
        reversed />

      <HorizontalCard
        id="etape5"
        title="Étape 5 : je suis chez moi"
        content="Profitez de votre logement et assurez-vous de bien connaître les spécificités liées au BRS."
        href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-suis-chez-moi"
        imgSrc={brsEtape5}
        linkLabel="En savoir plus" />
    </div>
  </Section>
</div>

<style lang="postcss">
  .cards-container {
    display: flex;
    flex-direction: column;
    gap: var(--8w);
  }
</style>

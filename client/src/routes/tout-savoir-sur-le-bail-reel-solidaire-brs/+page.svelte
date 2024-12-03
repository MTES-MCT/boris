<script lang="ts">
  import HorizontalCard from '$components/cards/horizontal/horizontal.svelte';
  import Section from '$components/section/section.svelte';
  import brsEtape1 from '$assets/images/brs-etape-1.jpg';
  import brsEtape2 from '$assets/images/brs-etape-2.jpg';
  import brsEtape3 from '$assets/images/brs-etape-3.jpg';
  import brsEtape4 from '$assets/images/brs-etape-4.jpg';
  import brsEtape5 from '$assets/images/brs-etape-5.jpg';
</script>

<svelte:head>
  <title>Boris - Tout savoir sur le BRS</title>
</svelte:head>

<div class="background-gradient">
  <Section
    title="Tout savoir sur le BRS"
    titleElement="h1">
    <p>
      Le Bail Réel Solidaire (BRS) est un dispositif mis en place par l’État
      permettant à des ménages qui ne pourraient pas devenir propriétaires d'un
      logement au prix du marché d’accéder à la propriété de leur <b>
        résidence principale.
      </b>
    </p>

    <p>
      En effet, les logements mis en vente en BRS sont <b>
        30 à 50% moins chers
      </b>
      que ceux mis en vente dans le marché traditionnel. Les prix sont
      <b>encadrés et contrôlés par l'État</b>
      . Cela est rendu possible notamment parce que les propriétaires d'un logement
      en BRS achètent leur logement à 100%, mais pas le terrain sur lequel celui-ci
      est construit. En échange, les propriétaires d'un logement d'un BRS s'acquittent
      d'une redevance mensuelle contenue.
    </p>

    <p>
      En tant que propriétaire d'un logement en BRS, vous disposez de <b>
        tous les droits d'un·e propriétaire
      </b>
      , et pouvez notamment revendre votre logement (avec une plus-value toutefois
      encadrée) ou le transmettre à vos proches. Le dispositif se veut ainsi solidaire
      car il permet aux générations futures d'accéder à la propriété dans des conditions
      similaires, de manière abordable.
    </p>

    <p>
      Le BRS existe depuis 2017 et les acquéreurs sont <b>
        accompagnés tout au long de leur procédure
      </b>
      d'achat par un organisme dédié.
    </p>
  </Section>

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

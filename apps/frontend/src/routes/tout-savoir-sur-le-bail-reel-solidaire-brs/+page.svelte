<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Hero from '$components/pages/step-page/Hero.svelte';
  import Promesses from '$components/pages/step-page/Promesses.svelte';
  import Promess from '$components/pages/step-page/Promess.svelte';
  import Steps from '$components/pages/step-page/Steps.svelte';
  import PageCta from '$components/common/PageCta.svelte';

  import { default as BrsEtape1 } from '$assets/illustrations/brs-etape-1.svg?raw';
  import { default as BrsEtape2 } from '$assets/illustrations/brs-etape-2.svg?raw';
  import { default as BrsEtape3 } from '$assets/illustrations/brs-etape-3.svg?raw';
  import { default as BrsEtape4 } from '$assets/illustrations/brs-etape-4.svg?raw';
  import { default as BrsEtape5 } from '$assets/illustrations/brs-etape-5.svg?raw';
  import Step from '$components/pages/step-page/Step.svelte';
  import { steps } from './[slug]/content';
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

  <Promesses title="Le BRS en 3 points clés.">
    <Promess>
      <p>
        <b>
          Les logements mis en vente en BRS sont 30 à 50% moins chers que ceux
          mis en vente dans le marché traditionnel.
        </b>
      </p>
      <p>
        Les prix sont encadrés et contrôlés par l'État. Cela est rendu possible
        notamment parce que les propriétaires d'un logement en BRS achètent leur
        logement à 100%, mais pas le terrain sur lequel celui-ci est construit.
      </p>
      <p>
        En échange, les propriétaires d'un logement d'un BRS s'acquittent d'une
        redevance mensuelle contenue.
      </p>
    </Promess>
    <Promess>
      <p>
        <b>
          En tant que propriétaire d'un logement en BRS, vous pouvez notamment
          revendre votre logement (avec une plus-value toutefois encadrée) ou le
          transmettre à vos proches.
        </b>
      </p>
      <p>
        Le dispositif se veut ainsi solidaire car il permet aux générations
        futures d'accéder à la propriété dans des conditions similaires, de
        manière abordable.
      </p>
    </Promess>
    <Promess>
      <p>
        Les premiers logements en BRS ont vu le jour en 2019 et depuis le
        dispositif se déploie sur l’ensemble du territoire national.
      </p>
      <p>
        Les acquéreurs sont accompagnés tout au long de leur procédure d'achat
        par un organisme dédié.
      </p>
    </Promess>
  </Promesses>

  <Steps>
    <Step
      title="Je me renseigne sur le dispositif du BRS."
      illustration={BrsEtape1}
      linkLabel="Tout savoir sur le BRS"
      href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[0].slug}`}
      position={1}>
      <p>
        Découvrez les informations relatives au Bail Réel Solidaire : les
        avantages du BRS, les contreparties, les critères d’éligibilité et les
        parties prenantes d’un projet en BRS.
      </p>
    </Step>

    <Step
      title="Je trouve mon logement en BRS."
      illustration={BrsEtape2}
      linkLabel="Construire son projet immobilier"
      href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[1].slug}`}
      position={2}>
      <p>
        Définissez votre projet d’achat, trouvez le logement de vos rêves en
        BRS, construisez votre dossier et candidatez pour l'obtenir.
      </p>
    </Step>

    <Step
      title="Je cherche des financements."
      illustration={BrsEtape3}
      linkLabel="Définir son projet financier"
      href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[2].slug}`}
      position={3}>
      <p>
        Assurez-vous de pouvoir financer votre achat, payer les frais en tant
        que propriétaire en BRS grâce à vos fonds propres, un emprunt bancaire
        et des aides éventuelles et projetez-vous à plus long terme.
      </p>
    </Step>

    <Step
      title="Je deviens propriétaire."
      illustration={BrsEtape4}
      linkLabel="S'assurer du bon déroulement de l'achat"
      href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[3].slug}`}
      position={4}>
      <p>
        Vérifiez toutes les étapes après avoir trouvé un logement, les documents
        à fournir ainsi que comment choisir son ou sa notaire pour signer l'acte
        de vente.
      </p>
    </Step>

    <Step
      title="Je suis chez moi !"
      illustration={BrsEtape5}
      linkLabel="Découvrez les spécificités pour l’après achat"
      href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[4].slug}`}
      position={5}
      isLast>
      <p>
        Profitez de votre logement et assurez-vous de bien connaître les
        spécificités liées au BRS : l’assurance logement BRS, réalisation des
        travaux, la vie en copropriété et la revente du logement.
      </p>
    </Step>
  </Steps>
  <PageCta />
</GradientBackgroundWrapper>

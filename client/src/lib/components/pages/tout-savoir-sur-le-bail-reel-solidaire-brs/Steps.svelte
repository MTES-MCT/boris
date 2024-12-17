<script>
  import { default as BrsEtape1 } from '$assets/illustrations/brs-etape-1.svg?raw';
  import { default as BrsEtape2 } from '$assets/illustrations/brs-etape-2.svg?raw';
  import { default as BrsEtape3 } from '$assets/illustrations/brs-etape-3.svg?raw';
  import { default as BrsEtape4 } from '$assets/illustrations/brs-etape-4.svg?raw';
  import { default as BrsEtape5 } from '$assets/illustrations/brs-etape-5.svg?raw';
  import Card from '$components/pages/tout-savoir-sur-le-bail-reel-solidaire-brs/Step.svelte';
</script>

<section class="fr-container">
  <Card
    title="Je me renseigne sur le dispositif du BRS."
    content="Découvrez les informations relatives au Bail Réel Solidaire : les avantages du BRS, les contreparties, les critères d’éligibilité et les parties prenantes d’un projet en BRS."
    illustration={BrsEtape1}
    linkLabel="Tout savoir sur le BRS"
    href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-decouvre-le-dispositif"
    position={1} />

  <Card
    title="Je trouve mon logement en BRS."
    content="Définissez votre projet d’achat, trouvez le logement de vos rêves en BRS, construisez votre dossier et candidatez pour l'obtenir."
    illustration={BrsEtape2}
    linkLabel="Construire son projet immobilier"
    href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-trouve-mon-logement"
    position={2} />

  <Card
    title="Je cherche des financements."
    content="Assurez-vous de pouvoir financer votre achat, payer les frais en tant que propriétaire en BRS grâce à vos fonds propres, un emprunt bancaire et des aides éventuelles et projetez-vous à plus long terme."
    illustration={BrsEtape3}
    linkLabel="Définir son projet financier"
    href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-cherche-des-financements"
    position={3} />

  <Card
    title="Je deviens propriétaire."
    content="Vérifiez toutes les étapes après avoir trouvé un logement, les documents à fournir ainsi que comment choisir son ou sa notaire pour signer l'acte de vente."
    illustration={BrsEtape4}
    linkLabel="S'assurer du bon déroulement de l'achat"
    href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-deviens-proprietaire"
    position={4} />

  <Card
    title="Je suis chez moi !"
    content="Profitez de votre logement et assurez-vous de bien connaître les spécificités liées au BRS : l’assurance logement BRS, réalisation des travaux, la vie en copropriété et la revente du logement."
    illustration={BrsEtape5}
    linkLabel="Découvrez les spécificités pour l’après achat"
    href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-suis-chez-moi"
    position={5}
    isLast />
</section>

<style lang="postcss">
  section {
    display: flex;
    flex-direction: column;
    gap: var(--10w);
    margin-block-start: var(--10w);

    @media (--md-viewport) {
      gap: 0;
      margin-block-start: var(--15w);
      margin-block-end: var(--10w);
    }
  }
</style>

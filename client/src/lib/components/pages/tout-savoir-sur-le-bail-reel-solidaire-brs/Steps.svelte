<script>
  import { default as BrsEtape1 } from '$assets/illustrations/brs-etape-1.svg?raw';
  import { default as BrsEtape2 } from '$assets/illustrations/brs-etape-2.svg?raw';
  import { default as BrsEtape3 } from '$assets/illustrations/brs-etape-3.svg?raw';
  import { default as BrsEtape4 } from '$assets/illustrations/brs-etape-4.svg?raw';
  import { default as BrsEtape5 } from '$assets/illustrations/brs-etape-5.svg?raw';
  import Card from '$components/pages/tout-savoir-sur-le-bail-reel-solidaire-brs/Step.svelte';
  import { steps } from '$routes/tout-savoir-sur-le-bail-reel-solidaire-brs/[slug]/content';
</script>

<section class="fr-container">
  <Card
    title="Je me renseigne sur le dispositif du BRS."
    content="Découvrez les informations relatives au Bail Réel Solidaire : les avantages du BRS, les contreparties, les critères d’éligibilité et les parties prenantes d’un projet en BRS."
    illustration={BrsEtape1}
    linkLabel="Tout savoir sur le BRS"
    href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[0].slug}`}
    position={1} />

  <Card
    title="Je trouve mon logement en BRS."
    content="Définissez votre projet d’achat, trouvez le logement de vos rêves en BRS, construisez votre dossier et candidatez pour l'obtenir."
    illustration={BrsEtape2}
    linkLabel="Construire son projet immobilier"
    href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[1].slug}`}
    position={2} />

  <Card
    title="Je cherche des financements."
    content="Assurez-vous de pouvoir financer votre achat, payer les frais en tant que propriétaire en BRS grâce à vos fonds propres, un emprunt bancaire et des aides éventuelles et projetez-vous à plus long terme."
    illustration={BrsEtape3}
    linkLabel="Définir son projet financier"
    href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[2].slug}`}
    position={3} />

  <Card
    title="Je deviens propriétaire."
    content="Vérifiez toutes les étapes après avoir trouvé un logement, les documents à fournir ainsi que comment choisir son ou sa notaire pour signer l'acte de vente."
    illustration={BrsEtape4}
    linkLabel="S'assurer du bon déroulement de l'achat"
    href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[3].slug}`}
    position={4} />

  <Card
    title="Je suis chez moi !"
    content="Profitez de votre logement et assurez-vous de bien connaître les spécificités liées au BRS : l’assurance logement BRS, réalisation des travaux, la vie en copropriété et la revente du logement."
    illustration={BrsEtape5}
    linkLabel="Découvrez les spécificités pour l’après achat"
    href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[4].slug}`}
    position={5}
    isLast />
</section>

<style lang="postcss">
  section {
    display: flex;
    flex-direction: column;
    gap: var(--8w);
    margin-block-start: var(--8w);

    @media (--md-viewport) {
      gap: 0;
      margin-block-start: var(--15w);
      margin-block-end: var(--10w);
    }
  }
</style>

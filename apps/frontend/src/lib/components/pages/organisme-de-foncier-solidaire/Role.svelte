<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import Tile from '$components/common/Tile.svelte';

  import { default as MascotteThinking } from '$assets/icons/mascotte-thinking.svg?raw';
  import Alert from '$components/common/Alert.svelte';
  import TitleWithMascotte from '$components/pages/organisme-de-foncier-solidaire/TitleWithMascotte.svelte';
</script>

<div class="wrapper bg-white">
  <Section>
    <TitleWithMascotte
      title="Le rôle des OFS"
      mascotte={MascotteThinking} />

    <div class="container">
      <div class="actions">
        <Tile
          title="Achat"
          description="Acquisition des terrains pour construire des logements vendus en bail réel solidaire"
          pictogram="money" />

        <Tile
          title="Sélection"
          description="Processus de sélection des ménages éligibles à l'acquisition"
          pictogram="community" />

        <Tile
          title="Signature"
          description="Formalisation de la vente en bail réel solidaire avec les ménages acquéreurs"
          pictogram="contract" />

        <Tile
          title="Partage"
          description="Partage de la propriété des terrains avec les ménages acquéreurs"
          pictogram="environment" />

        <Tile
          title="Gestion"
          description="Suivi de la gestion du bien et des potentielles reventes ou transmission du logement"
          pictogram="binders" />
      </div>
      <div class="content">
        <h3 class="fr-mb-0">La mission des OFS</h3>
        <div>
          <p>
            Les Organismes de Foncier Solidaire (OFS) ont pour mission de
            réaliser des logements et de les vendre sous le régime spécifique du
            bail réel solidaire (BRS), favorisant ainsi l'accession à la
            propriété des ménages.
          </p>
          <p class="fr-mb-0">
            Pour réaliser cette mission, l'organisme de fonctier solidaire (OFS) <span
              class="fr-text--bold">
              achète et conserve des terrains
            </span>
            , sur lesquels il bâtit des logements, qu'il met ensuite en vente à des
            ménages
            <a
              href="/simulateur-eligibilite"
              class="fr-link">
              éligibles
            </a>
            afin qu'ils puissent devenir propriétaires via un
            <span class="fr-text--bold">
              bail réel solidaire, dont la durée est très longue
            </span>
            (de 18 à 99 ans). Ce dispositif permet ainsi à l'organisme de foncier
            solidaire (OFS) et au ménage de partager la propriété du logement, ce
            qui se traduit par un prix réduit à l'achat. Attention ! Le dispositif
            du bail réel solidaire (BRS) n'est pas exempt de contrepartie.
          </p>
        </div>

        <Alert type="info">
          <p class="fr-text--bold">
            Vous pouvez consulter <a
              href="/tout-savoir-sur-le-bail-reel-solidaire-brs"
              class="fr-link">
              notre page dédiée
            </a>
            pour en savoir plus sur le bail réel solidaire (BRS).
          </p>
        </Alert>

        <a
          href="/simulateur-eligibilite"
          class="fr-btn fr-btn--lg">
          Simuler mon éligibilité au Bail Réel Solidaire
        </a>
      </div>
    </div>
  </Section>
</div>

<style lang="postcss">
  .wrapper {
    margin-block: 5rem;
  }

  .actions {
    --gap: 1rem;
    --width: calc(100% - var(--gap));

    display: flex;
    gap: var(--gap);
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 4rem;

    :global(.fr-tile) {
      flex: 1 1 var(--width);
      max-width: var(--width);
    }

    @media (--xs-viewport) {
      --width: calc(50% - var(--gap));
    }

    @media (--md-viewport) {
      --gap: 2rem;
      --width: calc(33.33% - var(--gap));

      margin-bottom: 7rem;
    }
  }

  .content {
    display: flex;
    gap: 2rem;
    flex-direction: column;
    align-items: center;
    text-align: center;

    @media (--md-viewport) {
      gap: 3rem;
    }
  }
</style>

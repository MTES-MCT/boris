<script lang="ts">
  import Data from '$components/pages/simulateur-eligibilite/Data.svelte';
</script>

<section class="fr-container">
  <div class="wrapper">
    <div class="blue-overlay rounded-box-lg"></div>
    <div class="content rounded-box-lg background-color-white">
      <h3 class="fr-h4 heading color-blue-primary">
        Les plafonds de ressources d’éligibilité au Bail Réel Solidaire.
      </h3>
      <p>
        Les plafonds en vigueur depuis janvier 2025 sont définis à partir de
        votre catégorie de ménage et la zone de votre futur bien. Elle
        correspond à la tension immobilière, du plus tendu où les prix sont les
        plus haut, Abis, au moins tendu, C.
      </p>
      <a
        class="fr-link fr-link--icon-right"
        target="_blank"
        href="https://www.service-public.fr/simulateur/calcul/zonage-abc">
        Pour connaître votre zone
      </a>
      <p></p>
      <p>A quelle catégorie de ménage appartenez-vous ?</p>

      <Data />
    </div>
  </div>
</section>

<style lang="postcss">
  .wrapper {
    position: relative;
    max-width: 588px;
    margin: var(--15w) auto var(--10w) auto;

    &::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: calc(50% - 2px);
      height: var(--15w);
      width: var(--path-thickness);
      background-color: var(--color-blue-primary);
    }
  }

  .content {
    padding: 24px;
    z-index: 2;
    position: relative;
  }

  @media (--sm-viewport) {
    .blue-overlay {
      width: 100%;
      max-width: 588px;
      height: 100%;
      position: absolute;
      bottom: var(--3w);
      right: var(--3w);
      background-color: var(--color-teal-light);
      z-index: 1;
    }
  }
</style>

<script lang="ts">
  import ShadowedBox from '$components/common/ShadowedBox.svelte';
  import Data from '$components/pages/simulateur-eligibilite/Data.svelte';
</script>

<ShadowedBox>
  <h3 class="fr-h4 heading !text-blue-primary">
    Les plafonds de ressources d'éligibilité au Bail Réel Solidaire.
  </h3>
  <p>
    Les plafonds en vigueur depuis janvier 2025 sont définis à partir de votre
    catégorie de ménage et la zone de votre futur bien. Elle correspond à la
    tension immobilière, du plus tendu où les prix sont les plus haut, Abis, au
    moins tendu, C.
  </p>
  <a
    class="fr-link fr-link--icon-right"
    target="_blank"
    rel="noopener"
    href="https://www.service-public.fr/simulateur/calcul/zonage-abc">
    Pour connaître votre zone
  </a>
  <p></p>
  <p>A quelle catégorie de ménage appartenez-vous ?</p>

  <Data />

  <div class="fr-pt-4w">
    <a
      href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000437021/2025-02-12/"
      class="fr-link"
      target="_blank"
      rel="noopener">
      Textes de référence
    </a>
  </div>
</ShadowedBox>

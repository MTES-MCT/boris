<script lang="ts">
  let { data, children } = $props();
</script>

<main class="fr-container fr-py-8w">
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
      <div class="fr-card fr-card--no-arrow">
        <div class="fr-card__body">
          <div class="fr-card__content">
            <p class="fr-badge fr-badge--blue-ecume fr-badge--no-icon">Espace OFS</p>
            <p class="fr-mt-2w fr-text--sm">Connexion réservée aux utilisateurs OFS.</p>
            {@render children()}
            <div class="fr-mt-4w">
              <a class="fr-link" href={data.publicSiteUrl}>Retour au site BoRiS</a>
            </div>
            <p class="fr-mt-2w fr-text--sm">En cas de difficulté d’accès, contactez <a class="fr-link" href={`mailto:${data.supportEmail}`}>{data.supportEmail}</a>.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

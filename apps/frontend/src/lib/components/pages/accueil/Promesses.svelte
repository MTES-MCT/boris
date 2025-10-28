<script>
  import '@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons-map/icons-map.min.css';

  import Section from '$components/common/Section.svelte';
  import Disclaimer from '$components/common/Disclaimer.svelte';
</script>

<Section>
  <div
    class="fr-container relative fr-mb-12w fr-px-4w fr-px-md-3w fr-py-2w text-center background-color-white">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div
        class="flex flex-column justify-between fr-col-12 fr-col-md-6 fr-col-lg-3 fr-my-3w">
        <div>
          <div
            class="icon relative inline-block fr-p-2w rounded background-color-blue-light">
            <span
              class="fr-icon-community-line fr-icon--lg color-blue-primary"
              aria-hidden="true">
            </span>
          </div>
          <p class="fr-my-2w fr-my-md-4w fr-text--sm align-self-center">
            Vous achetez uniquement le logement tandis qu'un <a
              href="/organismes-de-foncier-solidaire"
              class="fr-link fr-text--sm">
              organisme de foncier solidaire (OFS)
            </a>
            agréé par l'Etat garde la propriété du terrain.
          </p>
        </div>
        <a
          class="fr-link fr-text--sm align-self-center"
          href="/tout-savoir-sur-le-bail-reel-solidaire-brs">
          En savoir plus
        </a>
      </div>
      <div
        class="flex flex-column justify-between fr-col-12 fr-col-md-6 fr-col-lg-3 fr-my-3w">
        <div>
          <div
            class="icon relative inline-block fr-p-2w rounded background-color-blue-light">
            <span
              class="fr-icon-france-line fr-icon--lg color-blue-primary"
              aria-hidden="true">
            </span>
          </div>
          <p class="fr-my-2w fr-my-md-4w fr-text--sm align-self-center">
            Une offre de logements abordables proposée par les Organismes
            Fonciers Solidaires qui se déploie sur l'ensemble du territoire
          </p>
        </div>
        <a
          class="fr-link fr-text--sm align-self-center"
          href="/logements-brs-disponibles">
          Trouver un logement en BRS
        </a>
      </div>
      <div
        class="flex flex-column justify-between fr-col-12 fr-col-md-6 fr-col-lg-3 fr-my-3w">
        <div>
          <div
            class="icon relative inline-block fr-p-2w rounded background-color-blue-light">
            <span
              class="fr-icon-sofa-line fr-icon--lg color-blue-primary"
              aria-hidden="true">
            </span>
          </div>
          <p class="fr-my-2w fr-my-md-4w fr-text--sm align-self-center">
            Vous profitez pleinement de votre logement en résidence principale
            et à condition d'être éligible au dispositif.
          </p>
        </div>
        <a
          class="fr-link fr-text--sm align-self-center"
          href="/tout-savoir-sur-le-bail-reel-solidaire-brs">
          En savoir plus
        </a>
      </div>
      <div
        class="flex flex-column justify-between fr-col-12 fr-col-md-6 fr-col-lg-3 fr-my-3w">
        <div>
          <div
            class="icon relative inline-block fr-p-2w rounded background-color-blue-light">
            <span
              class="fr-icon-service-line fr-icon--lg color-blue-primary"
              aria-hidden="true">
            </span>
          </div>
          <p class="fr-my-2w fr-my-md-4w fr-text--sm align-self-center">
            Vous devez vous acquitter mensuellement d'une redevance contenue
            auprès de l'
            <a
              href="/organismes-de-foncier-solidaire"
              class="fr-link fr-text--sm">
              organisme de foncier solidaire (OFS)
            </a>
            avec qui vous partagez la propriété.
          </p>
        </div>
        <a
          class="fr-link fr-text--sm align-self-center"
          href="/tout-savoir-sur-le-bail-reel-solidaire-brs">
          En savoir plus
        </a>
      </div>
    </div>
  </div>

  <Disclaimer content="la clef pour devenir propriétaire en BRS." />
</Section>

<style lang="postcss">
  .fr-container {
    --max-width: 400px;

    @media (--sm-viewport) {
      --max-width: 576px;
    }

    @media (--md-viewport) {
      --max-width: 1044px;
    }

    max-width: var(--max-width);
    margin-top: -9.5rem;
    border-radius: var(--border-radius-sm);
    border: solid 1px var(--color-blue-primary);
  }
</style>

<script>
  import Section from '$components/common/Section.svelte';
  import Disclaimer from '$components/common/Disclaimer.svelte';
</script>

<Section>
  <div class="fr-container fr-background-default--grey">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="column fr-col-12 fr-col-md-6 fr-col-lg-3">
        <div>
          <div class="icon">
            <span
              class="fr-icon-community-line color-blue-primary"
              aria-hidden="true">
            </span>
          </div>
          <p>
            Vous achetez uniquement le logement tandis qu'un Organisme de
            Foncier Solidaire (OFS) agréé par l'Etat garde la propriété du
            terrain.
          </p>
        </div>
        <a
          class="fr-link"
          href="/tout-savoir-sur-le-bail-reel-solidaire-brs">
          En savoir plus
        </a>
      </div>
      <div class="column fr-col-12 fr-col-md-6 fr-col-lg-3">
        <div>
          <div class="icon">
            <span
              class="fr-icon-france-line color-blue-primary"
              aria-hidden="true">
            </span>
          </div>
          <p>
            Une offre de logements abordables proposée par les Organismes
            Fonciers Solidaires qui se déploie sur l’ensemble du territoire
          </p>
        </div>
        <a
          class="fr-link"
          href="/organismes-fonciers-solidaires">
          Voir la liste des OFS
        </a>
      </div>
      <div class="column fr-col-12 fr-col-md-6 fr-col-lg-3">
        <div>
          <div class="icon">
            <span
              class="fr-icon-sofa-line color-blue-primary"
              aria-hidden="true">
            </span>
          </div>
          <p>
            Vous profitez pleinement de votre logement en résidence principale
            et à condition d’être éligible au dispositif.
          </p>
        </div>
        <a
          class="fr-link"
          href="/tout-savoir-sur-le-bail-reel-solidaire-brs">
          En savoir plus
        </a>
      </div>
      <div class="column fr-col-12 fr-col-md-6 fr-col-lg-3">
        <div>
          <div class="icon">
            <span
              class="fr-icon-service-line color-blue-primary"
              aria-hidden="true">
            </span>
          </div>
          <p>
            Vous devez vous acquitter mensuellement d’une redevance contenue
            auprès de l’OFS avec qui vous partagez la propriété.
          </p>
        </div>
        <a
          class="fr-link"
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
    position: relative;
    max-width: 400px;
    margin-block-start: calc(-1 * var(--19w));
    margin-block-end: var(--12w);
    border-radius: var(--border-radius-sm);
    border: solid 1px var(--color-blue-primary);
    padding-block: var(--2w);
  }

  .column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-block: var(--2w);
    padding-inline: var(--3w);

    p,
    a {
      align-self: center;
      font-size: 0.875rem;
    }
  }

  .icon {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--5w);
    margin-bottom: var(--2w);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: calc(50% - var(--5w) / 2);
      width: var(--5w);
      height: var(--5w);
      background-color: var(--color-blue-light);
      border-radius: 50%;
    }
  }

  @media (--sm-viewport) {
    .fr-container {
      max-width: 576px;
    }

    .column {
      margin-block: var(--3w);
    }
  }

  @media (--md-viewport) {
    .fr-container {
      max-width: 1044px;
      padding-block: 0;
    }

    .icon {
      margin-bottom: var(--4w);
    }

    .column {
      margin-block: var(--5w);
    }
  }
</style>

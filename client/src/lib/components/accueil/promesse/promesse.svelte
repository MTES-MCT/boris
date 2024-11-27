<script>
  import Section from '$components/section/section.svelte';
  import Logo from '$components/accueil/promesse/logo.svelte';
  import { default as MascotteWaving } from '$assets/icons/mascotte-waving.svg?raw';
</script>

<Section>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="column fr-col-12 fr-col-md-6 fr-col-lg-3">
        <div>
          <div class="icon">
            <span
              class="fr-icon-community-line"
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
          href="#">
          En savoir plus
        </a>
      </div>
      <div class="column fr-col-12 fr-col-md-6 fr-col-lg-3">
        <div>
          <div class="icon">
            <span
              class="fr-icon-france-line"
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
              class="fr-icon-sofa-line"
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
          href="#">
          En savoir plus
        </a>
      </div>
      <div class="column fr-col-12 fr-col-md-6 fr-col-lg-3">
        <div>
          <div class="icon">
            <span
              class="fr-icon-service-line"
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
          href="#">
          En savoir plus
        </a>
      </div>
    </div>
  </div>

  <div class="disclaimer">
    <div class="mascotte-waving">
      {@html MascotteWaving}
    </div>
    <Logo />
    <p>la clef pour devenir propriétaire en BRS.</p>
  </div>
</Section>

<style lang="postcss">
  .fr-container {
    position: relative;
    max-width: 400px;
    margin-block-start: calc(-1 * var(--19w));
    margin-block-end: var(--12w);
    background-color: white;
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

    span {
      color: var(--color-blue-primary);
    }

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

  .disclaimer {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-block-end: var(--5w);

    .mascotte-waving {
      position: absolute;
      width: 82px;
      top: -50px;
      left: calc(50%);
    }

    p {
      font-size: 1.25rem;
      font-weight: 700;
      margin-top: var(--1v);
    }
  }

  @media (--sm-viewport) {
    .fr-container {
      max-width: 576px;
    }

    .column {
      margin-block: var(--3w);
    }

    .disclaimer {
      p {
        font-size: 1.5rem;
      }
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

    .disclaimer {
      margin-block-end: var(--15w);

      p {
        font-size: 2rem;
      }
    }
  }
</style>

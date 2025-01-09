<script lang="ts">
  import Section from '$components/common/Section.svelte';
</script>

<Section>
  <h2 class="fr-h3 heading color-blue-primary">
    Les grandes étapes de notre projet.
  </h2>

  <div class="grid">
    <div class="column">
      <div class="content">
        <p class="date">Mai 2023 - Aout 2023</p>
        <p class="title"><b>Phase d'investigation</b></p>
        <p>
          L'équipe du projet (1 intrapreneur + 1 coach) ont testé la pertinence
          du projet à travers des interviews d'une vingtaine de personnes
          (acheteurs en BRS, bénéficiaires potentiels, banques, OFS…) et des
          travaux de recherche.
        </p>
      </div>
    </div>
    <div class="column">
      <div class="content">
        <p class="date">Septembre 2023 - Juin 2024</p>
        <p class="title"><b>Phase de construction</b></p>
        <p>
          Pendant 6 mois, nous avons testé l'idée en créant un prototype
          fonctionnel (notamment ce site web et le simulateur d'éligibilité).
          L'objectif fut ensuite de tester auprès des futurs usagers la
          pertinence de la solution, sur la période Mars-Juin 2024. Sur ces
          trois mois nous avons eu nos 600 premières simulations, et avons au
          final pu accompagner 20 ménages vers l’accession au BRS. Ces résultats
          ont permis de débloquer de nouveaux fonds pour passer à l’étape
          supérieure.
        </p>
      </div>
    </div>
    <div class="column">
      <div class="content">
        <p class="date">Août 2024 - Aujourd’hui</p>
        <p class="title"><b>Phase d’accélération</b></p>
        <p>
          Notre équipe s’est renforcée avec l’arrivée de notre chargée de
          déploiement, notre développeur et notre designeuse, dans l’optique de
          toucher et d’aider un maximum de ménages à devenir propriétaire en
          BRS.
        </p>
      </div>
    </div>
    <div class="column">
      <div class="content">
        <p class="date">Et après ?</p>
        <p>
          Nous avons la ferme intention de développer cette plateforme pour
          répondre aux enjeux des ménages dans leur recherche d'un logement à
          prix abordable. Nous continuerons à ajouter des informations utiles
          aux acquéreurs à chaque étape de leur parcours, au fur et à mesure de
          notre évolution.
        </p>
      </div>
    </div>
  </div>
</Section>

<style lang="postcss">
  .heading {
    text-align: center;
    margin-block: var(--5w);
  }

  .grid {
    position: relative;
    display: flex;
    flex-direction: column;

    &::before {
      content: '';
      position: absolute;
      top: calc(-1 * var(--2w));
      left: calc(var(--1w) - 1px);
      background-color: var(--color-blue-primary);
      width: 2px;
      height: 100%;
    }
  }

  .column {
    flex: 1;
  }

  p {
    position: relative;
    font-size: 0.875rem;
    padding-inline-start: var(--4w);
  }

  .date {
    font-weight: 700;
    margin-bottom: var(--1w);

    &::before {
      content: '';
      position: absolute;
      top: calc(50% - var(--1w));
      left: 0;
      background-color: var(--color-blue-primary);
      width: var(--2w);
      height: var(--2w);
      border-radius: var(--1w);
    }
  }

  .title {
    margin-block-end: var(--1w);
  }

  @media (--md-viewport) {
    .heading {
      margin-block: var(--10w);
    }

    .grid {
      flex-direction: row;
      gap: var(--3w);

      &::before {
        top: 47px;
        left: calc(-1 * var(--2w));
        width: calc(100% + var(--4w));
        height: 2px;
      }
    }

    .date {
      padding-block-end: var(--6w);
    }

    p {
      padding-inline-start: 0;
    }

    .date {
      &::before {
        top: calc(50% + var(--1v));
      }
    }
  }

  @media (--xl-viewport) {
    .grid {
      &::before {
        left: calc(-1 * var(--8w));
        width: calc(100% + var(--16w));
      }
    }
  }
</style>

<script lang="ts">
  import Section from '$components/common/Section.svelte';
</script>

<Section>
  <h3 aria-level="2">Les grandes étapes de notre projet.</h3>

  <div class="grid">
    <div class="column">
      <div class="content">
        <p class="date">Avril 2023</p>
        <p class="description">
          Un agent public identifie un enjeu qui pourrait bénéficier de
          l'approche Startup d'État.
        </p>
      </div>
    </div>
    <div class="column">
      <div class="content">
        <p class="date">Juin-août 2023</p>
        <p class="description">
          Lancement de la phase d'investigation <br />
          L'équipe du projet (1 intrapreneur + 1 coach) ont testé la pertinence du
          projet à travers des interviews d'une vingtaine de personnes (acheteurs
          en BRS, bénéficiaires potentiels, banques, OFS…) et des travaux de recherche.
        </p>
      </div>
    </div>
    <div class="column">
      <div class="content">
        <p class="date">Août 2023</p>
        <p class="description">
          Comité d'investissement <br />
          À partir des conclusions de la phase d'investigation, le comité d'investissement
          a validé la pertinence du projet et l'entrée en phase de construction pour
          6 à 8 mois.
        </p>
      </div>
    </div>
    <div class="column">
      <div class="content">
        <p class="date">Sept. 2023 - Mai 2024</p>
        <p class="description">
          Phase de construction <br />
          Pendant 6 mois, nous testons l'idée en créant un prototype fonctionnel
          (notamment ce site web et le simulateur d'éligibilité). L'objectif est
          de tester auprès des futurs usagers la pertinence de la solution.
        </p>
      </div>
    </div>
    <div class="column">
      <div class="content">
        <p class="date">Et après ?</p>
        <p class="description">
          Après un nouveau comité d'investissement qui clôturera la phase de
          construction, nous avons la ferme intention de développer cette
          plateforme pour répondre aux enjeux des ménages dans leur recherche
          d'un logement à prix abordable. Nous continuerons à ajouter des
          informations utiles aux acquéreurs à chaque étape de leur parcours.
        </p>
      </div>
    </div>
  </div>
</Section>

<style lang="postcss">
  h3 {
    color: var(--color-blue-primary);
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

  @media (--md-viewport) {
    h3 {
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

    p {
      padding-inline-start: 0;
      padding-block-end: var(--6w);
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

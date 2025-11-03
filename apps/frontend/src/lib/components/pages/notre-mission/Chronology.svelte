<script lang="ts">
  import Section from '$components/common/Section.svelte';
</script>

<div>
  <Section>
    <h2 class="text-center fr-mb-5w fr-mb-8w color-blue-primary">
      Les grandes étapes de notre projet.
    </h2>

    <div class="grid relative flex flex-column sm_flex-row gap-3w">
      <div class="flex-1">
        <div class="content">
          <p
            class="date relative fr-text--sm fr-text--bold fr-mb-1v fr-pl-4w fr-pl-md-0 fr-pb-md-6w">
            Mai 2023 - Aout 2023
          </p>
          <p
            class="title fr-text--sm fr-text--bold fr-mb-1v fr-pl-4w fr-pl-md-0">
            Phase d'investigation
          </p>
          <p class="fr-text--sm fr-mb-1v fr-pl-4w fr-pl-md-0">
            L'équipe du projet (1 intrapreneur + 1 coach) ont testé la
            pertinence du projet à travers des interviews d'une vingtaine de
            personnes (acheteurs en BRS, bénéficiaires potentiels, banques, <a
              href="/organismes-de-foncier-solidaire"
              class="fr-link fr-text--sm">
              organismes de foncier solidaire (OFS)
            </a>
            , etc.) et des travaux de recherche.
          </p>
        </div>
      </div>
      <div class="flex-1">
        <div class="content">
          <p
            class="date relative fr-text--sm fr-text--bold fr-mb-1v fr-pl-4w fr-pl-md-0 fr-pb-md-6w">
            Septembre 2023 - Juin 2024
          </p>
          <p
            class="title fr-text--sm fr-text--bold fr-mb-1v fr-pl-4w fr-pl-md-0">
            Phase de construction
          </p>
          <p class="fr-text--sm fr-mb-1v fr-pl-4w fr-pl-md-0">
            Pendant 6 mois, nous avons testé l'idée en créant un prototype
            fonctionnel (notamment ce site web et le simulateur d'éligibilité).
            L'objectif fut ensuite de tester auprès des futurs usagers la
            pertinence de la solution, sur la période Mars-Juin 2024. Sur ces
            trois mois nous avons eu nos 600 premières simulations, et avons au
            final pu accompagner 20 ménages vers l'accession au BRS. Ces
            résultats ont permis de débloquer de nouveaux fonds pour passer à
            l'étape supérieure.
          </p>
        </div>
      </div>
      <div class="flex-1">
        <div class="content">
          <p
            class="date relative fr-text--sm fr-text--bold fr-mb-1v fr-pl-4w fr-pl-md-0 fr-pb-md-6w">
            Août 2024 - Aujourd'hui
          </p>
          <p
            class="title fr-text--sm fr-text--bold fr-mb-1v fr-pl-4w fr-pl-md-0">
            Phase d'accélération
          </p>
          <p class="fr-text--sm fr-mb-1v fr-pl-4w fr-pl-md-0">
            Notre équipe s'est renforcée avec l'arrivée de notre chargée de
            déploiement, notre développeur et notre designeuse, dans l'optique
            de toucher et d'aider un maximum de ménages à devenir propriétaire
            en BRS.
          </p>
        </div>
      </div>
      <div class="flex-1">
        <div class="content">
          <p
            class="date relative fr-text--sm fr-text--bold fr-mb-1v fr-pl-4w fr-pl-md-0 fr-pb-md-6w">
            Et après ?
          </p>
          <p class="fr-text--sm fr-mb-1v fr-pl-4w fr-pl-md-0">
            Nous avons la ferme intention de développer cette plateforme pour
            répondre aux enjeux des ménages dans leur recherche d'un logement à
            prix abordable. Nous continuerons à ajouter des informations utiles
            aux acquéreurs à chaque étape de leur parcours, au fur et à mesure
            de notre évolution.
          </p>
        </div>
      </div>
    </div>
  </Section>
</div>

<style lang="postcss">
  .grid {
    &::before {
      content: '';
      position: absolute;
      top: -1rem;
      left: calc(0.5rem - 1px);
      background-color: var(--color-blue-primary);
      width: 2px;
      height: 100%;
    }
  }

  .date {
    &::before {
      content: '';
      position: absolute;
      top: calc(50% - 0.5rem);
      left: 0;
      background-color: var(--color-blue-primary);
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
    }
  }

  @media (--sm-viewport) {
    .grid {
      &::before {
        top: 47px;
        left: -1rem;
        width: calc(100% + 2rem);
        height: 2px;
      }
    }

    .date {
      &::before {
        top: calc(50% + 0.25rem);
      }
    }
  }

  @media (--xl-viewport) {
    .grid {
      &::before {
        left: -4rem;
        width: calc(100% + 8rem);
      }
    }
  }
</style>

<script lang="ts">
  import { eligibilityData } from '$lib/utils/constants';
  import Result from '$components/pages/simulateur-eligibilite/Result.svelte';

  let value = $state<number | undefined>(undefined);
</script>

<section class="fr-container">
  <div class="wrapper">
    <div class="blue-overlay rounded-box-lg"></div>
    <div class="content rounded-box-lg fr-background-default--grey">
      <h4 aria-level="3">
        Les plafonds de ressources d’éligibilité au Bail Réel Solidaire.
      </h4>
      <p>
        Les plafonds en vigueur depuis janvier 2024 sont définis à partir de
        votre catégorie de ménage et la zone de votre futur bien. Elle
        correspond à la tension immobilière, du plus tendu où les prix sont les
        plus haut, Abis, au moins tendu, C.
      </p>
      <a
        class="fr-link fr-icon-arrow-right-line fr-link--icon-right"
        target="_blank"
        href="https://www.service-public.fr/simulateur/calcul/zonage-abc">
        Pour connaître votre zone
      </a>
      <div class="fr-select-group fr-mt-3w">
        <label
          class="fr-label"
          for="select">
          A quelle catégorie de ménage appartenez-vous ?
        </label>
        <select
          class="fr-select"
          id="select"
          name="select"
          bind:value>
          <option
            value=""
            selected
            disabled
            hidden>
            Sélectionner votre catégorie de ménage
          </option>
          {#each eligibilityData as eligibility}
            {#each eligibility.options as option}
              <option value={eligibility.value}>
                {`${eligibility.category} - ${option}`}
              </option>
            {/each}
            {#if eligibility.options.length === 0}
              <option value={eligibility.value}>{eligibility.category}</option>
            {/if}
          {/each}
        </select>
      </div>

      {#if value}
        <Result {value} />
      {/if}
    </div>
  </div>
</section>

<style lang="postcss">
  h4 {
    color: var(--color-blue-primary);
  }

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

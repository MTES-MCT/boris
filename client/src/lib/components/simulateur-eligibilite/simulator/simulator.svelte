<script lang="ts">
  import { eligibilityData } from '$lib/utils/constants';
  import Grid from '$lib/components/simulateur-eligibilite/simulator/grid.svelte';

  let value = $state<number | undefined>(2);
</script>

<section class="fr-container">
  <div class="content">
    <h3>Les plafonds de ressources d’éligibilité au Bail Réel Solidaire.</h3>
    <p>
      Les plafonds en vigueur depuis janvier 2024 sont définis à partir de votre
      catégorie de ménage et la zone de votre futur bien. Elle correspond à la
      tension immobilière, du plus tendu où les prix sont les plus haut, Abis,
      au moins tendu, C.
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
      <Grid {value} />
    {/if}
  </div>
</section>

<style lang="postcss">
  h3 {
    font-size: 1.25rem;
    color: var(--color-blue-primary);
  }

  .content {
    position: relative;
    max-width: 588px;
    margin: var(--15w) auto var(--10w) auto;
    padding: 24px;
    border-top-left-radius: var(--border-radius-lg);
    border-top-right-radius: var(--border-radius-lg);
    background-color: white;
    transform-style: preserve-3d;
    z-index: 2;

    &::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: calc(50% - 2px);
      height: var(--15w);
      width: var(--path-thickness);
      background-color: var(--color-blue-primary);
      transform: translateZ(-2px);
    }
  }

  @media (--sm-viewport) {
    h3 {
      font-size: 1.5rem;
    }

    .content {
      transform-style: preserve-3d;

      &::after {
        content: '';
        position: absolute;
        bottom: var(--3w);
        right: var(--3w);
        width: 100%;
        height: 100%;
        border-top-left-radius: var(--border-radius-lg);
        border-top-right-radius: var(--border-radius-lg);
        background-color: var(--color-teal-light);
        transform: translateZ(-1px);
      }
    }
  }
</style>

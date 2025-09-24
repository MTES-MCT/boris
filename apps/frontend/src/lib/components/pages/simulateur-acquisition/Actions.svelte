<script lang="ts">
  import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';

  import acquisitionSimulatorManger from '$lib/managers/acquisition-simulator.svelte';

  const { previousStep, nextStep, goToPreviousStep, goToNextStep } = $derived(
    acquisitionSimulatorManger,
  );
</script>

<nav
  class:no-previous={!previousStep}
  aria-label="liens vers les autres étapes du simulateur d'acquisition">
  {#if previousStep}
    <button
      class="fr-btn fr-btn--lg fr-btn--secondary previous"
      onclick={goToPreviousStep}>
      <div class="surtitle">
        <span
          class="fr-icon-arrow-left-line"
          aria-hidden="true">
        </span>
        <p>
          <b>Étape précédente</b>
        </p>
      </div>
      <p class="fr-text--sm">{previousStep.title}</p>
    </button>
  {/if}

  {#if nextStep}
    <button
      class="fr-btn fr-btn--lg next"
      onclick={goToNextStep}>
      <div class="surtitle">
        <p>
          <b>Étape suivante</b>
        </p>
        <span
          class="fr-icon-arrow-right-line"
          aria-hidden="true">
        </span>
      </div>
      <p class="fr-text--sm">{nextStep.title}</p>
    </button>
  {/if}
</nav>

<style lang="postcss">
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.no-previous {
      justify-content: flex-end;
    }
  }

  button {
    display: flex;
    flex-direction: column;
    text-align: left;

    &.previous {
      align-items: flex-end;
    }

    &.next {
      align-items: flex-start;
    }
  }

  .surtitle {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  .fr-icon-arrow-right-line:before,
  .fr-icon-arrow-left-line:before {
    --icon-size: 1rem;
  }
</style>

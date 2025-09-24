<script lang="ts">
  import '@gouvfr/dsfr/dist/component/stepper/stepper.min.css';

  import type { Heading } from '$lib/utils/definitions';

  type Props = {
    title: string;
    nextStepTitle?: string;
    currentStep: number;
    stepCount: number;
    titleElement?: Heading;
  };

  const {
    title,
    nextStepTitle,
    currentStep,
    stepCount,
    titleElement = 'h2',
  }: Props = $props();
</script>

<div class="fr-stepper">
  <svelte:element
    this={titleElement}
    class="fr-stepper__title">
    {title}
    <span class="fr-stepper__state">
      Étape {currentStep} sur {stepCount}
    </span>
  </svelte:element>
  <div
    class="fr-stepper__steps"
    data-fr-current-step={currentStep}
    data-fr-steps={stepCount}>
  </div>
  <p class="fr-stepper__details">
    {#if nextStepTitle}
      <span class="fr-text--bold">Étape suivante :</span>
      {nextStepTitle}
    {/if}
  </p>
</div>

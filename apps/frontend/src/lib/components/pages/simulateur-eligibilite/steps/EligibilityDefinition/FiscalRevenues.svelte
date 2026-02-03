<script lang="ts">
  import z, { ZodError } from 'zod';
  import type { FormFieldError } from '$lib/utils/definitions';
  import { formatFormErrors } from '$lib/utils/helpers';

  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Action from '$components/common/Simulator/Action.svelte';
  import Input from '$components/common/Input.svelte';

  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import {
    formattedThousandsToNumber,
    formatThousands,
    formatYearMinusN,
  } from '$lib/utils/formatters';

  const {
    formattedTaxableIncome,
    householdSize,
    currentPhase,
    nextPhase,
    goToNextPhase,
    previousPhase,
    goToPreviousPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  let errors: FormFieldError = $state({});

  let FormData = z.object({
    formattedTaxableIncome: z
      .string('Veuillez saisir un chiffre supérieur à 0.')
      .refine((value) => {
        return formattedThousandsToNumber(value) > 0;
      }, 'Veuillez saisir un chiffre supérieur à 0.'),
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    // TODO: Define type here with DTOs (same as in step1 from acquisition simulator)
    const payload = {
      formattedTaxableIncome,
    };

    try {
      FormData.parse(payload);
      errors = {};

      eligibilitySimulatorManager.formattedTaxableIncome =
        formattedTaxableIncome;

      goToNextPhase();
    } catch (e) {
      console.log(e);
      errors = formatFormErrors((e as ZodError).issues);
    }
  };
</script>

<Form onSubmit={handleSubmit}>
  <fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
      <h3 class="fr-h4">{currentPhase?.title as string}</h3>
    </div>
  </fieldset>

  {#if householdSize === 1}
    <div class="fr-fieldset__element fr-mb-4w">
      <Input
        value={formattedTaxableIncome}
        label={`Quel est le revenu fiscal de référence présent sur votre avis d'imposition l'année ${formatYearMinusN(1)}, concernant les revenus de l'année ${formatYearMinusN(2)}) ?`}
        type="text"
        currency
        icon="euro-line"
        required
        skipHTML5Required
        id="taxable-income"
        step={1}
        placeholder="Exemple: 25 000€"
        onChange={(e) => {
          eligibilitySimulatorManager.formattedTaxableIncome = formatThousands(
            (e.target as HTMLInputElement).value,
          );
        }}
        error={errors.formattedTaxableIncome}
        errorDataTestId="formatted-taxable-income-error-message" />
    </div>
  {/if}

  <Actions>
    <Action
      direction="previous"
      label={previousPhase?.title as string}
      onClick={goToPreviousPhase}
      {loading} />
    <Action
      direction="next"
      label={nextPhase?.title as string}
      type="submit"
      {loading} />
  </Actions>
</Form>

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
  } from '$lib/utils/formatters';

  import {
    stepsContent,
    type DeclarationType,
  } from '$lib/utils/eligibility-simulator';
  import Select from '$components/common/Select.svelte';

  const {
    formattedTaxableIncome,
    singlePersonInHousehold,
    declarationType,
    firstCoBuyerFormattedTaxableIncome,
    secondCoBuyerFormattedTaxableIncome,
    taxableIncome,
    currentPhase,
    nextPhase,
    goToNextPhase,
    previousPhase,
    goToPreviousPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  let errors: FormFieldError = $state({});

  let formData = $derived.by(() => {
    let schema = z.object({});

    if (singlePersonInHousehold) {
      schema = schema.extend({
        formattedTaxableIncome: z
          .string(stepsContent.formattedTaxableIncome.errorMessage)
          .refine((value) => {
            return formattedThousandsToNumber(value) > 0;
          }, stepsContent.formattedTaxableIncome.errorMessage),
      });
    } else {
      schema = schema.extend({
        declarationType: z.enum(
          ['SEUL_SOUHAIT_SEUL', 'SEUL_SOUHAIT_PARTENAIRE', 'COMMUN'],
          {
            message: 'Veuillez sélectionner une option',
          },
        ),
      });

      if (declarationType !== 'SEUL_SOUHAIT_PARTENAIRE') {
        schema = schema.extend({
          formattedTaxableIncome: z
            .string(stepsContent.formattedTaxableIncome.errorMessage)
            .refine((value) => {
              return formattedThousandsToNumber(value) > 0;
            }, stepsContent.formattedTaxableIncome.errorMessage),
        });
      } else {
        schema = schema.extend({
          firstCoBuyerFormattedTaxableIncome: z
            .string(
              stepsContent.firstCoBuyerFormattedTaxableIncome.errorMessage,
            )
            .refine((value) => {
              return formattedThousandsToNumber(value) > 0;
            }, stepsContent.firstCoBuyerFormattedTaxableIncome.errorMessage),
          secondCoBuyerFormattedTaxableIncome: z
            .string(
              stepsContent.secondCoBuyerFormattedTaxableIncome.errorMessage,
            )
            .refine((value) => {
              return formattedThousandsToNumber(value) > 0;
            }, stepsContent.secondCoBuyerFormattedTaxableIncome.errorMessage),
        });
      }
    }

    return schema;
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    // TODO: Define type here with DTOs (same as in step1 from acquisition simulator)
    const payload = {
      formattedTaxableIncome,
      declarationType,
      firstCoBuyerFormattedTaxableIncome,
      secondCoBuyerFormattedTaxableIncome,
    };

    try {
      formData.parse(payload);
      errors = {};

      goToNextPhase();
    } catch (e) {
      errors = formatFormErrors((e as ZodError).issues);
    }
  };
</script>

<Form onSubmit={handleSubmit}>
  <fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
      <h3 class="fr-h4">{currentPhase?.title as string}</h3>
    </div>

    {#if singlePersonInHousehold}
      {@render formattedTaxableIncomeInput()}
    {:else}
      <div class="fr-fieldset__element fr-mb-4w">
        <Select
          label={stepsContent.declarationType.label}
          required
          options={stepsContent.declarationType.options.map((stepContent) => ({
            ...stepContent,
            selected: declarationType === stepContent.value,
          }))}
          onChange={(e) => {
            const { value } = e.target as HTMLSelectElement;

            if (value) {
              delete errors.declarationType;
            }

            eligibilitySimulatorManager.declarationType =
              value === '' ? undefined : (value as DeclarationType);
          }}
          error={errors.declarationType}
          errorDataTestId={stepsContent.declarationType.errorDataTestId} />
      </div>

      {#if declarationType}
        {#if declarationType !== 'SEUL_SOUHAIT_PARTENAIRE'}
          {@render formattedTaxableIncomeInput()}
        {:else}
          <div class="fr-fieldset__element fr-mb-4w">
            <Input
              value={firstCoBuyerFormattedTaxableIncome}
              label={stepsContent.firstCoBuyerFormattedTaxableIncome.label}
              rawLabel
              type="text"
              currency
              icon="euro-line"
              required
              skipHTML5Required
              id="first-co-buyer-taxable-income"
              step={1000}
              maxlength={7}
              placeholder="Exemple: 25 000€"
              onChange={(e) => {
                eligibilitySimulatorManager.firstCoBuyerFormattedTaxableIncome =
                  formatThousands((e.target as HTMLInputElement).value);
              }}
              dataTestId={stepsContent.firstCoBuyerFormattedTaxableIncome
                .inputDataTestId}
              error={errors.firstCoBuyerFormattedTaxableIncome}
              errorDataTestId={stepsContent.firstCoBuyerFormattedTaxableIncome
                .errorDataTestId} />
          </div>
          <div class="fr-fieldset__element fr-mb-4w">
            <Input
              value={secondCoBuyerFormattedTaxableIncome}
              label={stepsContent.secondCoBuyerFormattedTaxableIncome.label}
              rawLabel
              type="text"
              currency
              icon="euro-line"
              required
              skipHTML5Required
              id="second-co-buyer-taxable-income"
              step={1000}
              maxlength={7}
              placeholder="Exemple: 26 000€"
              onChange={(e) => {
                eligibilitySimulatorManager.secondCoBuyerFormattedTaxableIncome =
                  formatThousands((e.target as HTMLInputElement).value);
              }}
              dataTestId={stepsContent.secondCoBuyerFormattedTaxableIncome
                .inputDataTestId}
              error={errors.secondCoBuyerFormattedTaxableIncome}
              errorDataTestId={stepsContent.secondCoBuyerFormattedTaxableIncome
                .errorDataTestId} />
          </div>
        {/if}
      {/if}
    {/if}
  </fieldset>

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

{#snippet formattedTaxableIncomeInput()}
  <div class="fr-fieldset__element fr-mb-4w">
    <Input
      value={formattedTaxableIncome}
      label={declarationType === 'COMMUN'
        ? stepsContent.formattedTaxableIncome.labelInCommon
        : stepsContent.formattedTaxableIncome.label}
      rawLabel
      type="text"
      currency
      icon="euro-line"
      required
      skipHTML5Required
      id="taxable-income"
      step={1000}
      maxlength={7}
      placeholder="Exemple: 25 000€"
      onChange={(e) => {
        eligibilitySimulatorManager.formattedTaxableIncome = formatThousands(
          (e.target as HTMLInputElement).value,
        );
      }}
      dataTestId={stepsContent.formattedTaxableIncome.inputDataTestId}
      error={errors.formattedTaxableIncome}
      errorDataTestId={stepsContent.formattedTaxableIncome.errorDataTestId} />
  </div>
{/snippet}

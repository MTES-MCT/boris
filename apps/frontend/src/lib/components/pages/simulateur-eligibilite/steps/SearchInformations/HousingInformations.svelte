<script lang="ts">
  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Action from '$components/common/Simulator/Action.svelte';
  import Autocomplete from '$components/common/Autocomplete.svelte';
  import type {
    FormFieldError,
    GeocodedResponse,
  } from '$lib/utils/definitions';
  import { formatFormErrors } from '$lib/utils/helpers';
  import z, { ZodError } from 'zod';
  import {
    stepsContent,
    type HousingType,
  } from '$lib/utils/eligibility-simulator';
  import Select from '$components/common/Select.svelte';

  let {
    autocompleteValue,
    selectedLocation,
    housingType,
    currentPhase,
    nextPhase,
    goToNextPhase,
    previousStep,
    goToPreviousPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  let errors = $state<FormFieldError>({});

  const FormData = z.object({
    autocompleteValue: z
      .string({
        message: stepsContent.location.errorMessage,
      })
      .min(3, stepsContent.location.errorMessage),
    housingType: z.enum(['T1', 'T2', 'T3', 'T4', 'T5'], {
      message: stepsContent.housingType.errorMessage,
    }),
  });

  const onLocationSelect = async (
    suggestion: GeocodedResponse['properties'],
  ) => {
    eligibilitySimulatorManager.selectedLocation = suggestion;
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const payload = {
      autocompleteValue: selectedLocation?.label,
      housingType,
    };

    try {
      FormData.parse(payload);
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

    <div class="fr-fieldset__element fr-mb-4w">
      <Autocomplete
        bind:value={autocompleteValue}
        label={stepsContent.location.label}
        placeholder={stepsContent.location.placeholder}
        error={errors.autocompleteValue}
        dataTestId={stepsContent.location.dataTestId}
        errorDataTestId={stepsContent.location.errorDataTestId}
        onSelect={onLocationSelect} />
    </div>

    <div class="fr-fieldset__element">
      <Select
        label={stepsContent.housingType.label}
        options={stepsContent.housingType.options.map((stepContent) => ({
          ...stepContent,
          selected: housingType === stepContent.value,
        }))}
        onChange={(e) => {
          const { value } = e.target as HTMLSelectElement;

          if (value) {
            delete errors.housingType;
          }

          eligibilitySimulatorManager.housingType = value as HousingType;
        }}
        error={errors.housingType}
        errorDataTestId={stepsContent.housingType.errorDataTestId} />
    </div>
  </fieldset>

  <Actions>
    <Action
      direction="previous"
      label={previousStep?.title as string}
      onClick={goToPreviousPhase}
      {loading} />
    <Action
      direction="next"
      label={nextPhase?.title as string}
      type="submit"
      {loading} />
  </Actions>
</Form>

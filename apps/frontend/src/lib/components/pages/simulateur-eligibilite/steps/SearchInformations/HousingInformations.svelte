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
  import {
    formatFormErrors,
    getGeocodedResponseLabel,
  } from '$lib/utils/helpers';
  import z, { ZodError } from 'zod';
  import {
    stepsContent,
    type HousingType,
  } from '$lib/utils/eligibility-simulator';
  import Select from '$components/common/Select.svelte';
  import Badge from '$components/common/Badge.svelte';
  import type { UpdateEligibilitySimulationDto } from '$lib/utils/api-types';

  let autocompleteValue = $state('');

  let {
    selectedLocations,
    housingType,
    currentPhase,
    nextPhase,
    updateEligibilitySimulation,
    previousStep,
    goToPreviousPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  let errors = $state<FormFieldError>({});

  const FormData = z.object({
    selectedLocations: z
      .array(z.any())
      .min(1, stepsContent.location.errorMessage)
      .max(3, stepsContent.location.errorMessage),
    housingType: z.enum(['T1', 'T2', 'T3', 'T4', 'T5'], {
      message: stepsContent.housingType.errorMessage,
    }),
  });

  const onLocationSelect = async (
    suggestion: GeocodedResponse['properties'],
  ) => {
    autocompleteValue = '';

    const existingLocation = selectedLocations.find(
      (location) => location?.label === suggestion?.label,
    );

    if (!existingLocation) {
      selectedLocations.push(suggestion);
    }
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const payload = {
      selectedLocations,
      housingType,
    };

    try {
      FormData.parse(payload);
      errors = {};

      updateEligibilitySimulation({
        locations: selectedLocations?.map((item) => ({
          ...item,
          latitude: item?.y,
          longitude: item?.x,
          postalCode: item?.postcode,
        })),
        housingType,
      });
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
        hint={stepsContent.location.hint}
        label={stepsContent.location.label}
        placeholder={stepsContent.location.placeholder}
        disabled={selectedLocations.length === 3}
        error={errors.selectedLocations}
        dataTestId={stepsContent.location.dataTestId}
        errorDataTestId={stepsContent.location.errorDataTestId}
        onSelect={onLocationSelect} />
      <div class="flex gap-2 flex-wrap mt-2">
        {#each selectedLocations as location, i}
          <Badge
            status="info"
            onClose={() => {
              selectedLocations.splice(i, 1);
            }}
            normalCase>
            {getGeocodedResponseLabel(location)}
          </Badge>
        {/each}
      </div>
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

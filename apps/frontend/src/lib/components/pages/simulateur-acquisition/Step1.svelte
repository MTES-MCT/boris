<script lang="ts">
  import z, { ZodError } from 'zod';

  import type {
    FormFieldError,
    GeocodedResponse,
  } from '$lib/utils/definitions';
  import type {
    CreateAcquisitionSimulationDto,
    MunicipalityView,
  } from '$lib/utils/api-types';
  import type { Zone } from '$lib/utils/lissage-ptz';
  import {
    formatFormErrors,
    getGeocodedResponseLabel,
  } from '$lib/utils/helpers';

  import Input from '$components/common/Input.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Form from '$components/common/Simulator/Form.svelte';
  import Autocomplete from '$components/common/Autocomplete.svelte';
  import Radio from '$components/common/Radio.svelte';
  import RadioFieldset from '$components/common/RadioFieldset.svelte';
  import Action from '$components/common/Simulator/Action.svelte';
  import Wrapper from '$components/common/Simulator/Wrapper.svelte';
  import Description from '$components/common/Simulator/Description.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  let {
    currentStep,
    steps,
    housingPrice,
    autocompleteValue,
    surface,
    housingType,
    brsZone,
    loading,
    nextStep,
    acquisitionSimulation,
    createAcquisitionSimulation,
    updateAcquisitionSimulation,
  } = $derived(acquisitionSimulatorManager);

  let errors: FormFieldError = $state({});

  const FormData = z.object({
    housingPrice: z
      .number({
        message: 'Veuillez remplir ce champs.',
      })
      .positive('Veuillez saisir un chiffre supérieur à 0.'),
    brsZone: z.string({
      message: 'Veuillez selectionner un lieu valide.',
    }),
    surface: z
      .number({
        message: 'Veuillez remplir ce champs.',
      })
      .positive('Veuillez saisir un chiffre supérieur à 0.'),
    housingType: z.string({
      message: 'Veuillez selectionner le type du bien.',
    }),
  });

  const onLocationSelect = async (
    suggestion: GeocodedResponse['properties'],
  ) => {
    acquisitionSimulatorManager.autocompleteValue =
      getGeocodedResponseLabel(suggestion);

    const response = await fetch(`api/municipalities/${suggestion?.citycode}`);
    const municipality: MunicipalityView = await response.json();

    acquisitionSimulatorManager.brsZone = municipality.zone as Zone;
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const payload: CreateAcquisitionSimulationDto = {
      housingPrice: housingPrice as number,
      brsZone: brsZone as CreateAcquisitionSimulationDto['brsZone'],
      surface: surface as number,
      housingType: housingType as CreateAcquisitionSimulationDto['housingType'],
    };

    try {
      FormData.parse(payload);
      errors = {};

      if (!acquisitionSimulation) {
        await createAcquisitionSimulation(payload);
      } else {
        await updateAcquisitionSimulation(payload);
      }
    } catch (e) {
      errors = formatFormErrors((e as ZodError).issues);
    }
  };
</script>

<Wrapper>
  <Description
    title="Simulateur d'acquisition"
    stepTitle={`${currentStep.step}. ${currentStep.title}`}
    nextStepTitle={nextStep?.title}
    currentStep={currentStep.step}
    stepCount={steps.length}>
    <p>
      Indiquez les principales caractéristiques du logement que vous souhaitez
      acquérir. Ces informations permettront d'estimer les frais associés à
      votre projet et les facilités d'emprunt auxquelles vous avez droit.
    </p>
  </Description>
  <Form onSubmit={handleSubmit}>
    <div class="fieldset-container">
      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={housingPrice}
            label="Prix du logement (€) *"
            labelTooltip="Prix de vente affiché par l'opérateur ou le promoteur, hors frais annexes."
            placeholder="Exemple: 200 000 €"
            id="housing-price"
            type="number"
            min={0}
            error={errors.housingPrice}
            onChange={(e) => {
              const value = (e.target as HTMLInputElement).value;

              if (value) {
                const numericValue = value.replace(/\D/g, '').slice(0, 9);
                (e.target as HTMLInputElement).value = numericValue;
                acquisitionSimulatorManager.housingPrice = Number(numericValue);
              }
            }} />
        </div>

        <div class="fr-fieldset__element fr-mb-4w">
          <Autocomplete
            bind:value={autocompleteValue}
            label="Ville ou code postal du logement *"
            placeholder="Exemple: Quimper ou 23200"
            error={errors.brsZone}
            onSelect={onLocationSelect} />
        </div>

        <div class="fr-fieldset__element">
          <Input
            value={surface}
            id="surface"
            label="Surface (m²) *"
            placeholder="Exemple: 50 m²"
            error={errors.surface}
            onChange={(e) => {
              const value = (e.target as HTMLInputElement).value;

              if (value) {
                const numericValue = value.replace(/\D/g, '').slice(0, 3);
                (e.target as HTMLInputElement).value = numericValue;
                acquisitionSimulatorManager.surface = Number(numericValue);
              }
            }} />
        </div>
      </fieldset>

      <RadioFieldset
        legend="Type de bien *"
        legendTooltip={`
        <div class="fr-p-2w">
          Le taux des frais de notaire dépend du type de bien.
          <ul>
            <li>Neuf: logement jamais habité.</li>
            <li>Ancien: logement déjà occupé.</li>
          </ul>
        </div>
      `}
        error={errors.housingType}>
        <Radio
          label="Neuf"
          checked={housingType === 'new'}
          oninput={() => (acquisitionSimulatorManager.housingType = 'new')} />
        <Radio
          label="Ancien"
          checked={housingType === 'old'}
          oninput={() => (acquisitionSimulatorManager.housingType = 'old')} />
      </RadioFieldset>
    </div>

    {#if nextStep}
      <Actions justifyEnd>
        <Action
          direction="next"
          label={nextStep.title}
          type="submit"
          {loading} />
      </Actions>
    {/if}
  </Form>
</Wrapper>

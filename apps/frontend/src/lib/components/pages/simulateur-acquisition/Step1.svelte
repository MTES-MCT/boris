<script lang="ts">
  import z, { ZodError } from 'zod';

  import type {
    AutocompleteSuggestion,
    FormFieldError,
  } from '$lib/utils/definitions';
  import { formatFormErrors } from '$lib/utils/helpers';

  import Input from '$components/common/Input.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Autocomplete from '$components/common/Autocomplete.svelte';
  import Radio from '$components/common/Radio.svelte';
  import RadioFieldset from '$components/common/RadioFieldset.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
  import Wrapper from '$components/pages/simulateur-acquisition/Wrapper.svelte';
  import Description from '$components/pages/simulateur-acquisition/Description.svelte';

  import acquisitionSimulatorManger from '$lib/managers/acquisition-simulator.svelte';

  let { housingPrice, autocompleteValue, surface, housingType, nextStep } =
    $derived(acquisitionSimulatorManger);

  let errors: FormFieldError = $state({});

  const FormData = z.object({
    housingPrice: z
      .number({
        message: 'Veuillez remplir ce champs.',
      })
      .positive('Veuillez saisir un chiffre supérieur à 0.'),
    // brsZone: z.string({
    //   message: 'Veuillez selectionner un lieu valide.',
    // }),
    surface: z
      .number({
        message: 'Veuillez remplir ce champs.',
      })
      .positive('Veuillez saisir un chiffre supérieur à 0.'),
    housingType: z.string({
      message: 'Veuillez selectionner le type du bien.',
    }),
  });

  const onLocationSelect = async (suggestion: AutocompleteSuggestion) => {
    acquisitionSimulatorManger.selectedLocation = suggestion;

    // const response = await fetch(
    //   `api/brs-zones?longitude=${suggestion.x}&latitude=${suggestion.y}`,
    // );

    // acquisitionSimulatorManger.brsZone = await response.json();
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    try {
      FormData.parse({
        housingPrice: acquisitionSimulatorManger.housingPrice,
        // brsZone: acquisitionSimulatorManger.brsZone,
        surface: acquisitionSimulatorManger.surface,
        housingType: acquisitionSimulatorManger.housingType,
      });

      errors = {};

      acquisitionSimulatorManger.goToNextStep();
    } catch (e) {
      errors = formatFormErrors((e as ZodError).issues);
    }
  };
</script>

<Wrapper>
  <Description
    content="Indiquez les principales caractéristiques du logement que vous souhaitez
      acquérir. Ces informations permettront d'estimer les frais associés à
      votre projet et les facilités d'emprunt auxquelles vous avez droit." />
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
                acquisitionSimulatorManger.housingPrice = Number(numericValue);
              }
            }} />
        </div>

        <div class="fr-fieldset__element fr-mb-4w">
          <Autocomplete
            bind:value={autocompleteValue}
            excludedPois={['commune', 'département', 'région']}
            label="Ville ou code postal du logement *"
            placeholder="Exemple: Quimper ou 23200"
            error={errors.brsZone}
            onSelect={onLocationSelect} />
        </div>

        <div class="fr-fieldset__element fr-mb-4w">
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
                acquisitionSimulatorManger.surface = Number(numericValue);
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
        <div class="radios-container">
          <Radio
            label="Neuf"
            checked={housingType === 'new'}
            oninput={() => (acquisitionSimulatorManger.housingType = 'new')} />
          <Radio
            label="Ancien"
            checked={housingType === 'old'}
            oninput={() => (acquisitionSimulatorManger.housingType = 'old')} />
        </div>
      </RadioFieldset>
    </div>

    {#if nextStep}
      <Actions justifyEnd>
        <Action
          direction="next"
          label={nextStep.title}
          type="submit" />
      </Actions>
    {/if}
  </Form>
</Wrapper>

<style lang="postcss">
  .radios-container {
    display: flex;
  }
</style>

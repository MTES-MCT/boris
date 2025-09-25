<script lang="ts">
  import z from 'zod';

  import type { AutocompleteSuggestion } from '$lib/utils/definitions';

  import Input from '$components/common/Input.svelte';
  import Actions from './Actions.svelte';
  import Form from './Form.svelte';

  import acquisitionSimulatorManger from '$lib/managers/acquisition-simulator.svelte';
  import Autocomplete from '$components/common/Autocomplete.svelte';
  import Tooltip from '$components/common/Tooltip.svelte';
  import Radio from '$components/common/Radio.svelte';

  const FormData = z.object({
    housingPrice: z.number().positive().min(50000),
  });

  let { housingPrice, autocompleteValue, surface, housingType } = $derived(
    acquisitionSimulatorManger,
  );

  const onLocationSelect = async (suggestion: AutocompleteSuggestion) => {
    acquisitionSimulatorManger.selectedLocation = suggestion;

    const response = await fetch(
      `api/brs-zones?longitude=${suggestion.x}&latitude=${suggestion.y}`,
    );

    acquisitionSimulatorManger.brsZone = await response.json();
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    console.log('submit');
  };
</script>

<p>
  Indiquez les principales caractéristiques du logement que vous souhaitez
  acquérir. Ces informations permettront d'estimer les frais associés à votre
  projet et les facilités d'emprunt auxquelles vous avez droit.
</p>
<Form onSubmit={handleSubmit}>
  <div class="fieldset-container">
    <fieldset class="fr-fieldset">
      <div class="fr-fieldset__element fr-mb-4w">
        <Input
          value={housingPrice}
          label="Prix du logement (€) *"
          labelTooltip="Prix de vente affiché par l'opérateur ou le promoteur, hors frais annexes."
          placeholder="200000"
          id="housing-price"
          type="number"
          min={10000}
          step={1000}
          error="Ce champs est requis"
          onChange={(e) => {
            acquisitionSimulatorManger.housingPrice = Number(
              (e.target as HTMLInputElement).value,
            );
          }} />
      </div>

      <div class="fr-fieldset__element fr-mb-4w">
        <Autocomplete
          bind:value={autocompleteValue}
          excludedPois={['commune', 'département', 'région']}
          label="Ville ou code postal du logement *"
          placeholder="Quimper ou 23200"
          onSelect={onLocationSelect} />
      </div>

      <div class="fr-fieldset__element fr-mb-4w">
        <Input
          value={surface}
          id="surface"
          label="Surface (m²) *"
          placeholder="50"
          onChange={(e) => {
            const value = (e.target as HTMLInputElement).value;

            if (value) {
              const numericValue = value.replace(/\D/g, '').slice(0, 3);
              (e.target as HTMLInputElement).value = numericValue;
              acquisitionSimulatorManger.surface = Number(numericValue);
            }
          }} />
      </div>

      <div class="fr-fieldset__element fr-mb-4w">
        <label class="fr-label fr-mb-1w">
          <span><b>Type de bien *</b></span>
          <Tooltip>
            <div class="fr-p-2w">
              Le taux des frais de notaire dépend du type de bien.
              <ul>
                <li>Neuf: logement jamais habité.</li>
                <li>Ancien: logement déjà occupé.</li>
              </ul>
            </div>
          </Tooltip>
        </label>
        <div class="fr-input-wrap">
          <Radio
            label="Neuf"
            checked={housingType === 'new'}
            oninput={() => (acquisitionSimulatorManger.housingType = 'new')} />
          <Radio
            label="Ancien"
            checked={housingType === 'old'}
            oninput={() => (acquisitionSimulatorManger.housingType = 'old')} />
        </div>
      </div>
    </fieldset>
  </div>

  <button type="submit">Submit</button>

  <!-- <Actions /> -->
</Form>

<style lang="postcss">
  label {
    display: flex;
    gap: 0.25rem;
  }
</style>

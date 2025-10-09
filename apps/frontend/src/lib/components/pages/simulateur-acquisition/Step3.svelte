<script lang="ts">
  import z, { ZodError } from 'zod';

  import type { FormFieldError } from '$lib/utils/definitions';
  import { formatFormErrors } from '$lib/utils/helpers';

  import Wrapper from '$components/pages/simulateur-acquisition/Wrapper.svelte';
  import Description from '$components/pages/simulateur-acquisition/Description.svelte';
  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Input from '$components/common/Input.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
  import { formatEuro } from '$lib/utils/formatters';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  let errors: FormFieldError = $state({});

  const FormData = z.object({
    notaryFees: z
      .number()
      .gte(0, 'Veuillez saisir un chiffre supérieur à 0.')
      .optional(),
    oneTimeExpenses: z
      .number()
      .gte(0, 'Veuillez saisir un chiffre supérieur à 0.')
      .optional(),
  });

  let {
    housingType,
    notaryFees,
    oneTimeExpenses,
    estimatedNotaryFees,
    nextStep,
    previousStep,
    goToPreviousStep,
    goToNextStep,
  } = $derived(acquisitionSimulatorManager);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    try {
      FormData.parse({
        notaryFees,
        oneTimeExpenses,
      });

      errors = {};

      goToNextStep();
    } catch (e) {
      errors = formatFormErrors((e as ZodError).issues);
    }
  };
</script>

<Wrapper>
  <Description
    content="Précisez les différents frais liés à l'achat du logement : frais de notaire,
    de garantie, d'agence ou autres frais ponctuels. Si certains montants sont
    inconnus, le simulateur peut les estimer automatiquement. Cette section vous
    permet de ne pas avoir de mauvaise surprise avec des frais non anticipés." />

  <Form onSubmit={handleSubmit}>
    <div class="fieldset-container">
      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={notaryFees}
            label="Frais de notaire (€)"
            labelTooltip={`
              <div>
                Frais obligatoires lors de l'achat, couvrant taxes et
                rémunération du notaire.
                <ul>
                  <li>Pour un achat neuf: 2,3% du prix du logement</li>
                  <li>Pour de l'ancien: 7,8%.</li>
                </ul>
              </div>
            `}
            type="number"
            id="notary-fees"
            hint="Laissez le champs vide pour estimation automatique."
            error={errors.notaryFees}
            forceNoMarginBottom
            placeholder="Exemple: 10 000€"
            onChange={(e) => {
              const { value } = e.target as HTMLInputElement;

              if (value === '') {
                acquisitionSimulatorManager.notaryFees = undefined;
              } else {
                acquisitionSimulatorManager.notaryFees = Number(value);
              }
            }} />
          {#if !notaryFees || notaryFees < 0}
            <span class="fr-text--sm">
              Estimation
              <b>
                {formatEuro(estimatedNotaryFees)}
              </b>
              <b>({housingType === 'new' ? '2,3%' : '7,8%'})</b>
              du prix du logement)
            </span>
          {/if}
        </div>

        <div class="fr-fieldset__element">
          <Input
            value={oneTimeExpenses}
            label="Frais ponctuels (€)"
            labelTooltip="Coût du déménagement, ouverture des compteurs, frais d'agence immobilière, etc. Hors frais de garantie et de prêt."
            type="number"
            id="one-time-expenses"
            hint="Laissez le champs vide ou saisissez 0 si vous n'avez pas de frais ponctuels."
            error={errors.oneTimeExpenses}
            forceNoMarginBottom
            placeholder="Exemple: 7 500€"
            onChange={(e) => {
              const { value } = e.target as HTMLInputElement;

              if (value === '') {
                acquisitionSimulatorManager.oneTimeExpenses = undefined;
              } else {
                acquisitionSimulatorManager.oneTimeExpenses = Number(value);
              }
            }} />
        </div>
      </fieldset>
    </div>

    <Actions>
      <Action
        direction="previous"
        label={previousStep?.title as string}
        onClick={goToPreviousStep} />
      <Action
        direction="next"
        label={nextStep?.title as string}
        type="submit" />
    </Actions>
  </Form>
</Wrapper>

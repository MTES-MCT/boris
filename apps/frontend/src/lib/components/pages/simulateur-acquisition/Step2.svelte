<script lang="ts">
  import z, { ZodError } from 'zod';

  import type { FormFieldError } from '$lib/utils/definitions';

  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Input from '$components/common/Input.svelte';

  import acquisitionSimulatorManger from '$lib/managers/acquisition-simulator.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
  import { formatFormErrors } from '$lib/utils/helpers';

  let { ownContribution, nextStep, previousStep, goToPreviousStep } = $derived(
    acquisitionSimulatorManger,
  );

  let errors: FormFieldError = $state({});

  const FormData = z.object({
    ownContribution: z
      .number()
      .gte(0, 'Veuillez saisir un chiffre supérieur à 0.'),
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    try {
      FormData.parse({
        ownContribution: acquisitionSimulatorManger.ownContribution,
      });

      errors = {};

      acquisitionSimulatorManger.goToNextStep();
    } catch (e) {
      errors = formatFormErrors((e as ZodError).issues);
    }
  };

  $inspect(ownContribution);
</script>

<p>
  Renseignez le montant de votre apport personnel. Cela nous permet de calculer
  la part du financement que vous pouvez couvrir sans emprunter, et d'ajuster le
  besoin de crédit à solliciter.
</p>
<Form onSubmit={handleSubmit}>
  <div class="fieldset-container">
    <fieldset class="fr-fieldset">
      <div class="fr-fieldset__element fr-mb-4w">
        <Input
          value={ownContribution}
          label="Montant de votre apport (€)"
          labelTooltip="Somme dont vous disposez pour le projet (épargne, donation,
              aide familiale, etc.)."
          id="own-contribution"
          error={errors.ownContribution}
          type="number"
          placeholder="10 000€"
          onChange={(e) => {
            acquisitionSimulatorManger.ownContribution = Number(
              (e.target as HTMLInputElement).value,
            );
          }} />
      </div>
    </fieldset>
  </div>

  {#if nextStep}
    <Actions>
      <Action
        direction="previous"
        label={previousStep?.title as string}
        onClick={goToPreviousStep} />
      <Action
        direction="next"
        label={nextStep.title}
        type="submit" />
    </Actions>
  {/if}
</Form>

<script lang="ts">
  import z, { ZodError } from 'zod';

  import type { FormFieldError } from '$lib/utils/definitions';
  import { formatFormErrors } from '$lib/utils/helpers';

  import acquisitionSimulatorManger from '$lib/managers/acquisition-simulator.svelte';

  import Wrapper from '$components/pages/simulateur-acquisition/Wrapper.svelte';
  import Description from '$components/pages/simulateur-acquisition/Description.svelte';
  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Input from '$components/common/Input.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';

  let { interestRate, previousStep, nextStep, goToPreviousStep } = $derived(
    acquisitionSimulatorManger,
  );

  let errors: FormFieldError = $state({});

  const FormData = z.object({
    interestRate: z
      .number({
        message: 'Veuillez remplir ce champs.',
      })
      .positive('Veuillez saisir un chiffre supérieur à 0.'),
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    try {
      FormData.parse({
        interestRate: acquisitionSimulatorManger.interestRate,
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
    content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  <Form onSubmit={handleSubmit}>
    <div class="fieldset-container">
      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element">
          <p class="fr-h6"><u>Paramètres du prêt</u></p>
        </div>

        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={interestRate}
            label="Taux d'intérêt de votre crédit (%)"
            labelTooltip="Taux annuel effectif global (TAEG) proposé par votre banque.
              Indiquez 0 si vous n'avez pas encore d'offre."
            type="number"
            id="interest-rate"
            min={0}
            step={0.01}
            placeholder="3.25"
            error={errors.interestRate}
            onChange={(e) => {
              acquisitionSimulatorManger.interestRate = Number(
                (e.target as HTMLInputElement).value,
              );
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

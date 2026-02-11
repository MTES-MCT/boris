<script lang="ts">
  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Action from '$components/common/Simulator/Action.svelte';
  import type { FormFieldError } from '$lib/utils/definitions';
  import z, { ZodError } from 'zod';
  import Input from '$components/common/Input.svelte';
  import { stepsContent } from '$lib/utils/eligibility-simulator';
  import { formatFormErrors } from '$lib/utils/helpers';

  const {
    firstName,
    lastName,
    email,
    currentPhase,
    nextStep,
    goToNextPhase,
    previousPhase,
    goToPreviousPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  let errors: FormFieldError = $state({});

  let formData = z.object({
    firstName: z.string({
      message: 'Veuillez saisir votre prénom',
    }),
    lastName: z.string({
      message: 'Veuillez saisir votre nom',
    }),
    email: z.email({
      message: 'Veuillez saisir une adresse email valide',
    }),
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const payload = {
      firstName,
      lastName,
      email,
    };

    try {
      formData.parse(payload);
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
  </fieldset>

  <div class="fr-fieldset__element fr-mb-4w">
    <Input
      value={firstName}
      label={stepsContent.firstName.label}
      type="text"
      required
      skipHTML5Required
      id="first-name"
      maxlength={255}
      placeholder="Exemple: Arnaud"
      onChange={(e) => {
        eligibilitySimulatorManager.firstName = (
          e.target as HTMLInputElement
        ).value;
      }}
      error={errors.firstName}
      errorDataTestId={stepsContent.firstName.errorDataTestId} />
  </div>

  <div class="fr-fieldset__element fr-mb-4w">
    <Input
      value={lastName}
      label={stepsContent.lastName.label}
      type="text"
      required
      skipHTML5Required
      id="last-name"
      maxlength={255}
      placeholder="Exemple: Dupont"
      onChange={(e) => {
        eligibilitySimulatorManager.lastName = (
          e.target as HTMLInputElement
        ).value;
      }}
      error={errors.lastName}
      errorDataTestId={stepsContent.lastName.errorDataTestId} />
  </div>

  <div class="fr-fieldset__element fr-mb-4w">
    <Input
      value={email}
      label={stepsContent.email.label}
      type="text"
      required
      skipHTML5Required
      id="email"
      maxlength={255}
      placeholder="Exemple: arnaud.dupont@example.com"
      onChange={(e) => {
        eligibilitySimulatorManager.email = (
          e.target as HTMLInputElement
        ).value;
      }}
      error={errors.email}
      errorDataTestId={stepsContent.email.errorDataTestId} />
  </div>

  <Actions>
    <Action
      direction="previous"
      label={previousPhase?.title as string}
      onClick={goToPreviousPhase}
      {loading} />
    <Action
      direction="next"
      label={nextStep?.title as string}
      type="submit"
      {loading} />
  </Actions>
</Form>

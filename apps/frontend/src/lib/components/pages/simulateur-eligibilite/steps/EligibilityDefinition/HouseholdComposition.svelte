<script lang="ts">
  import z, { ZodError } from 'zod';
  import type { FormFieldError } from '$lib/utils/definitions';
  import { formatFormErrors } from '$lib/utils/helpers';

  import Select from '$components/common/Select.svelte';
  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Action from '$components/common/Simulator/Action.svelte';
  import Input from '$components/common/Input.svelte';

  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';

  import { questions } from '$lib/utils/eligibility-simulator';

  const {
    currentPhase,
    householdSize,
    hasDisability,
    dependantsAmount,
    birthday,
    coBuyerBirthday,
    nextPhase,
    goToNextPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  let errors: FormFieldError = $state({});
  let selectedHouseholdSize: number | undefined = $derived.by(() => {
    if (!householdSize) {
      return undefined;
    } else if (householdSize < 7) {
      return householdSize;
    } else {
      return -1;
    }
  });

  let inputHouseholdSize: number | undefined = $derived.by(() => {
    if (!householdSize || (householdSize && householdSize < 7)) {
      return undefined;
    } else {
      return householdSize;
    }
  });

  let singlePersonInHousehold: boolean = $derived(selectedHouseholdSize === 1);
  let twoToSixPersonsInHousehold: boolean = $derived(
    selectedHouseholdSize !== undefined &&
      selectedHouseholdSize >= 2 &&
      selectedHouseholdSize <= 6,
  );
  let moreThanSixPersonsInHousehold: boolean = $derived(
    selectedHouseholdSize === -1,
  );

  let formData = $derived.by(() => {
    let schema = z.object({
      selectedHouseholdSize: z.number({
        message: 'Veuillez sélectionner une option',
      }),
    });

    if (singlePersonInHousehold) {
      schema = schema.extend({
        hasDisability: z.boolean({
          message: 'Veuillez sélectionner une option',
        }),
      });
    } else if (twoToSixPersonsInHousehold) {
      schema = schema.extend({
        dependantsAmount: z.number({
          message: 'Veuillez sélectionner une option',
        }),
        hasDisability: z.boolean({
          message: 'Veuillez sélectionner une option',
        }),
      });

      if (selectedHouseholdSize === 2 && dependantsAmount === 0) {
        schema = schema.extend({
          birthday: z.iso.date({
            message: 'Veuillez saisir une date valide',
          }),
          coBuyerBirthday: z.iso.date({
            message: 'Veuillez saisir une date valide',
          }),
        });
      }
    } else if (moreThanSixPersonsInHousehold) {
      schema = schema.extend({
        inputHouseholdSize: z
          .number({
            message: 'Veuillez saisir un chiffre supérieur à .',
          })
          .refine((value) => {
            return value > 6;
          }, 'Veuillez saisir un chiffre supérieur à 6.'),
      });
    }

    return schema;
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    // TODO: Define type here with DTOs (same as in step1 from acquisition simulator)
    const payload = {
      selectedHouseholdSize,
      inputHouseholdSize,
      dependantsAmount,
      hasDisability,
      birthday,
      coBuyerBirthday,
    };

    try {
      formData.parse(payload);
      errors = {};

      eligibilitySimulatorManager.householdSize = Math.max(
        selectedHouseholdSize || 0,
        inputHouseholdSize || 0,
      );

      goToNextPhase();
    } catch (e) {
      console.log(e);
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
      <Select
        label={questions.selectedHouseholdSize.label}
        required
        options={questions.selectedHouseholdSize.options.map((question) => ({
          ...question,
          selected: selectedHouseholdSize === question.value,
        }))}
        onChange={(e) => {
          const { value } = e.target as HTMLSelectElement;

          selectedHouseholdSize = value ? Number(value) : undefined;
        }}
        error={errors.selectedHouseholdSize}
        errorDataTestId={questions.selectedHouseholdSize.dataTestId} />
    </div>

    {#if singlePersonInHousehold}
      <div class="fr-fieldset__element fr-mb-4w">
        <Select
          label={questions.singlePersonInHouseholdHasDisability.label}
          required
          options={questions.singlePersonInHouseholdHasDisability.options.map(
            (question) => ({
              ...question,
              selected: hasDisability === question.value,
            }),
          )}
          onChange={(e) => {
            const { value } = e.target as HTMLSelectElement;

            eligibilitySimulatorManager.hasDisability =
              value === '' ? undefined : value === 'true' ? true : false;
          }}
          error={errors.hasDisability}
          errorDataTestId={questions.singlePersonInHouseholdHasDisability
            .dataTestId} />
      </div>
    {:else if twoToSixPersonsInHousehold}
      <div class="fr-fieldset__element fr-mb-4w">
        <Select
          label={questions.dependantsAmount.label}
          required
          options={questions.dependantsAmount.options.map((question) => ({
            ...question,
            selected: dependantsAmount === question.value,
          }))}
          onChange={(e) => {
            const { value } = e.target as HTMLSelectElement;

            eligibilitySimulatorManager.dependantsAmount = value
              ? Number(value)
              : undefined;
          }}
          error={errors.dependantsAmount}
          errorDataTestId={questions.dependantsAmount.dataTestId} />
      </div>
      <div class="fr-fieldset__element fr-mb-4w">
        <Select
          label={questions.twoToSixPersonsInHouseholdHasDisability.label}
          required
          options={questions.twoToSixPersonsInHouseholdHasDisability.options.map(
            (question) => ({
              ...question,
              selected: hasDisability === question.value,
            }),
          )}
          onChange={(e) => {
            const { value } = e.target as HTMLSelectElement;

            eligibilitySimulatorManager.hasDisability =
              value === '' ? undefined : value === 'true' ? true : false;
          }}
          error={errors.hasDisability}
          errorDataTestId={questions.twoToSixPersonsInHouseholdHasDisability
            .dataTestId} />
      </div>
      {#if selectedHouseholdSize === 2 && dependantsAmount === 0}
        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={birthday}
            label={questions.birthday.label}
            required
            skipHTML5Required
            type="date"
            max={new Date().toLocaleDateString('fr-ca')}
            onChange={(e) => {
              const { value } = e.target as HTMLInputElement;

              eligibilitySimulatorManager.birthday = value;
            }}
            error={errors.birthday}
            errorDataTestId={questions.birthday.dataTestId} />
        </div>
        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={coBuyerBirthday}
            label={questions.coBuyerBirthday.label}
            required
            skipHTML5Required
            type="date"
            max={new Date().toLocaleDateString('fr-ca')}
            onChange={(e) => {
              const { value } = e.target as HTMLInputElement;
              console.log(value);

              eligibilitySimulatorManager.coBuyerBirthday = value;
            }}
            error={errors.coBuyerBirthday}
            errorDataTestId={questions.coBuyerBirthday.dataTestId} />
        </div>
      {/if}
    {:else if moreThanSixPersonsInHousehold}
      <div class="fr-fieldset__element">
        <Input
          value={inputHouseholdSize}
          label={questions.inputHouseholdSize.label}
          required
          skipHTML5Required
          type="number"
          id="input-household-size"
          step={1}
          placeholder="Exemple: 8"
          onChange={(e) => {
            const value = (e.target as HTMLInputElement).value;

            if (value) {
              const numericValue = value.replace(/\D/g, '').slice(0, 9);
              (e.target as HTMLInputElement).value = numericValue;
              inputHouseholdSize = Number(numericValue);
            }
          }}
          error={errors.inputHouseholdSize}
          errorDataTestId={questions.inputHouseholdSize.dataTestId} />
      </div>
    {/if}
  </fieldset>

  <Actions justifyEnd>
    <Action
      direction="next"
      label={nextPhase?.title as string}
      type="submit"
      {loading} />
  </Actions>
</Form>

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

  import { stepsContent } from '$lib/utils/eligibility-simulator';

  const {
    currentPhase,
    householdSize,
    selectedHouseholdSize,
    singlePersonInHousehold,
    twoToSixPersonsInHousehold,
    moreThanSixPersonsInHousehold,
    hasDisability,
    dependantsAmount,
    birthday,
    coBuyerBirthday,
    eligibilitySimulation,
    createEligibilitySimulation,
    updateEligibilitySimulation,
    nextPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  let errors: FormFieldError = $state({});

  let inputHouseholdSize: number | undefined = $derived.by(() => {
    if (!householdSize || (householdSize && householdSize < 7)) {
      return undefined;
    } else {
      return householdSize;
    }
  });

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
      schema = schema
        .extend({
          dependantsAmount: z.number({
            message: 'Veuillez sélectionner une option',
          }),
          hasDisability: z.boolean({
            message: 'Veuillez sélectionner une option',
          }),
        })
        .refine(
          ({ selectedHouseholdSize, dependantsAmount }) => {
            return dependantsAmount < selectedHouseholdSize;
          },
          {
            message:
              stepsContent.dependantsAmount
                .moreDependantsThanHouseholdSizeErrorMessage,
            path: ['dependantsAmount'],
          },
        );

      if (selectedHouseholdSize === 2 && dependantsAmount === 0) {
        schema = schema.safeExtend({
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

      if (eligibilitySimulation) {
        updateEligibilitySimulation({
          householdSize,
          hasDisability,
          dependantsAmount,
          birthday,
          coBuyerBirthday,
        });
      } else {
        createEligibilitySimulation();
      }
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
      <Select
        label={stepsContent.selectedHouseholdSize.label}
        required
        options={stepsContent.selectedHouseholdSize.options.map(
          (stepContent) => ({
            ...stepContent,
            selected: selectedHouseholdSize === stepContent.value,
          }),
        )}
        onChange={(e) => {
          const { value } = e.target as HTMLSelectElement;

          if (value) {
            delete errors.selectedHouseholdSize;
          }

          eligibilitySimulatorManager.selectedHouseholdSize = value
            ? Number(value)
            : undefined;
        }}
        error={errors.selectedHouseholdSize}
        errorDataTestId={stepsContent.selectedHouseholdSize.errorDataTestId} />
    </div>

    {#if singlePersonInHousehold}
      <div class="fr-fieldset__element fr-mb-4w">
        <Select
          label={stepsContent.singlePersonInHouseholdHasDisability.label}
          required
          options={stepsContent.singlePersonInHouseholdHasDisability.options.map(
            (stepContent) => ({
              ...stepContent,
              selected: hasDisability === stepContent.value,
            }),
          )}
          onChange={(e) => {
            const { value } = e.target as HTMLSelectElement;

            if (value) {
              delete errors.hasDisability;
            }

            eligibilitySimulatorManager.hasDisability =
              value === '' ? undefined : value === 'true' ? true : false;
          }}
          error={errors.hasDisability}
          errorDataTestId={stepsContent.singlePersonInHouseholdHasDisability
            .errorDataTestId} />
      </div>
    {:else if twoToSixPersonsInHousehold}
      <div class="fr-fieldset__element fr-mb-4w">
        <Select
          label={stepsContent.dependantsAmount.label}
          required
          options={stepsContent.dependantsAmount.options.map((stepContent) => ({
            ...stepContent,
            selected: dependantsAmount === stepContent.value,
          }))}
          onChange={(e) => {
            const { value } = e.target as HTMLSelectElement;

            if (value) {
              delete errors.dependantsAmount;
            }

            eligibilitySimulatorManager.dependantsAmount = value
              ? Number(value)
              : undefined;
          }}
          error={errors.dependantsAmount}
          errorDataTestId={stepsContent.dependantsAmount.errorDataTestId} />
      </div>
      <div class="fr-fieldset__element fr-mb-4w">
        <Select
          label={stepsContent.twoToSixPersonsInHouseholdHasDisability.label}
          required
          options={stepsContent.twoToSixPersonsInHouseholdHasDisability.options.map(
            (stepContent) => ({
              ...stepContent,
              selected: hasDisability === stepContent.value,
            }),
          )}
          onChange={(e) => {
            const { value } = e.target as HTMLSelectElement;

            if (value) {
              delete errors.hasDisability;
            }

            eligibilitySimulatorManager.hasDisability =
              value === '' ? undefined : value === 'true' ? true : false;
          }}
          error={errors.hasDisability}
          errorDataTestId={stepsContent.twoToSixPersonsInHouseholdHasDisability
            .errorDataTestId} />
      </div>
      {#if selectedHouseholdSize === 2 && dependantsAmount === 0}
        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={birthday}
            label={stepsContent.birthday.label}
            required
            skipHTML5Required
            type="date"
            max={new Date().toLocaleDateString('fr-ca')}
            onChange={(e) => {
              const { value } = e.target as HTMLInputElement;

              eligibilitySimulatorManager.birthday = value;
            }}
            error={errors.birthday}
            errorDataTestId={stepsContent.birthday.errorDataTestId} />
        </div>
        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={coBuyerBirthday}
            label={stepsContent.coBuyerBirthday.label}
            required
            skipHTML5Required
            type="date"
            max={new Date().toLocaleDateString('fr-ca')}
            onChange={(e) => {
              const { value } = e.target as HTMLInputElement;

              eligibilitySimulatorManager.coBuyerBirthday = value;
            }}
            error={errors.coBuyerBirthday}
            errorDataTestId={stepsContent.coBuyerBirthday.errorDataTestId} />
        </div>
      {/if}
    {:else if moreThanSixPersonsInHousehold}
      <div class="fr-fieldset__element">
        <Input
          value={inputHouseholdSize}
          label={stepsContent.inputHouseholdSize.label}
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
          errorDataTestId={stepsContent.inputHouseholdSize.errorDataTestId} />
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

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
    }

    return schema;
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    // TODO: Define type here with DTOs (same as in step1 from acquisition simulator)
    const payload = {
      selectedHouseholdSize,
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

  $inspect(birthday, coBuyerBirthday);
</script>

<Form onSubmit={handleSubmit}>
  <fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
      <h3 class="fr-h4">{currentPhase?.title as string}</h3>
    </div>

    <div class="fr-fieldset__element fr-mb-4w">
      <Select
        label="Combien de personnes composent votre foyer ?"
        required
        options={[
          {
            value: undefined,
            label: 'Veuillez sélectionner une option',
            selected: selectedHouseholdSize === undefined,
          },
          {
            value: 1,
            label: '1 personne',
            selected: selectedHouseholdSize === 1,
          },
          {
            value: 2,
            label: '2 personnes',
            selected: selectedHouseholdSize === 2,
          },
          {
            value: 3,
            label: '3 personnes',
            selected: selectedHouseholdSize === 3,
          },
          {
            value: 4,
            label: '4 personnes',
            selected: selectedHouseholdSize === 4,
          },
          {
            value: 5,
            label: '5 personnes',
            selected: selectedHouseholdSize === 5,
          },
          {
            value: 6,
            label: '6 personnes',
            selected: selectedHouseholdSize === 6,
          },
          {
            value: -1,
            label: 'Plus de 6 personnes',
            selected: selectedHouseholdSize === -1,
          },
        ]}
        onChange={(e) => {
          const { value } = e.target as HTMLSelectElement;

          selectedHouseholdSize = value ? Number(value) : undefined;
        }}
        error={errors.selectedHouseholdSize}
        errorDataTestId="select-household-size-error-message" />
    </div>

    {#if singlePersonInHousehold}
      <div class="fr-fieldset__element fr-mb-4w">
        <Select
          label="Êtes-vous en situation de handicap ?"
          required
          options={[
            {
              value: undefined,
              label: 'Veuillez sélectionner une option',
              selected: hasDisability === undefined,
            },
            {
              value: true,
              label: 'Oui',
              selected: hasDisability === true,
            },
            {
              value: false,
              label: 'Non',
              selected: hasDisability === false,
            },
          ]}
          onChange={(e) => {
            const { value } = e.target as HTMLSelectElement;

            eligibilitySimulatorManager.hasDisability =
              value === '' ? undefined : value === 'true' ? true : false;
          }}
          error={errors.hasDisability}
          errorDataTestId="select-has-disability-error-message" />
      </div>
    {:else if twoToSixPersonsInHousehold}
      <div class="fr-fieldset__element fr-mb-4w">
        <Select
          label="Combien avez-vous de personnes à charge (enfants compris) ?"
          required
          options={[
            {
              value: undefined,
              label: 'Veuillez sélectionner une option',
              selected: dependantsAmount === undefined,
            },
            {
              value: 0,
              label: '0 personne',
              selected: dependantsAmount === 0,
            },
            {
              value: 1,
              label: '1 personne',
              selected: dependantsAmount === 1,
            },
            {
              value: 2,
              label: '2 personnes',
              selected: dependantsAmount === 2,
            },
            {
              value: 3,
              label: '3 personnes',
              selected: dependantsAmount === 3,
            },
            {
              value: 4,
              label: '4 personnes',
              selected: dependantsAmount === 4,
            },
            {
              value: 5,
              label: '5 personnes',
              selected: dependantsAmount === 5,
            },
            {
              value: 6,
              label: '6 personnes',
              selected: dependantsAmount === 6,
            },
            {
              value: -1,
              label: 'Plus de 6 personnes',
              selected: dependantsAmount === -1,
            },
          ]}
          onChange={(e) => {
            const { value } = e.target as HTMLSelectElement;

            eligibilitySimulatorManager.dependantsAmount = value
              ? Number(value)
              : undefined;
          }}
          error={errors.dependantsAmount}
          errorDataTestId="select-dependants-amount-error-message" />
      </div>
      <div class="fr-fieldset__element fr-mb-4w">
        <Select
          label="Dans votre foyer (vous y compris), est-ce qu'une ou plusieurs personnes sont en situation de handicap ?"
          required
          options={[
            {
              value: undefined,
              label: 'Veuillez sélectionner une option',
              selected: hasDisability === undefined,
            },
            {
              value: true,
              label: 'Oui',
              selected: hasDisability === true,
            },
            {
              value: false,
              label: 'Non',
              selected: hasDisability === false,
            },
          ]}
          onChange={(e) => {
            const { value } = e.target as HTMLSelectElement;

            eligibilitySimulatorManager.hasDisability =
              value === '' ? undefined : value === 'true' ? true : false;
          }}
          error={errors.hasDisability}
          errorDataTestId="select-has-disability-error-message" />
      </div>
      {#if selectedHouseholdSize === 2 && dependantsAmount === 0}
        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={birthday}
            label="Quelle est votre date de naissance ?"
            required
            skipHTML5Required
            type="date"
            max={new Date().toLocaleDateString('fr-ca')}
            onChange={(e) => {
              const { value } = e.target as HTMLInputElement;

              eligibilitySimulatorManager.birthday = value;
            }}
            error={errors.birthday}
            errorDataTestId="input-birthday-error-message" />
        </div>
        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={coBuyerBirthday}
            label="Quelle est la date de naissance de votre co-acquéreur·euse ?"
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
            errorDataTestId="input-co-buyer-birthday-error-message" />
        </div>
      {/if}
    {:else if moreThanSixPersonsInHousehold}
      <div class="fr-fieldset__element">
        <Input
          value={inputHouseholdSize}
          label="Pouvez vous indiquer précisément le nombre de personnes qui composent votre foyer ?"
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
          error={errors.inputHouseholdSize} />
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

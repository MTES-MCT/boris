<script lang="ts">
  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Action from '$components/common/Simulator/Action.svelte';
  import z, { ZodError } from 'zod';
  import {
    stepsContent,
    type EmploymentStatus,
    type PositionType,
    type ContractType,
  } from '$lib/utils/eligibility-simulator';
  import type { FormFieldError } from '$lib/utils/definitions';
  import { formatFormErrors } from '$lib/utils/helpers';
  import Select from '$components/common/Select.svelte';
  import Input from '$components/common/Input.svelte';

  const {
    currentPhase,
    hadBrsKnowledge,
    employmentStatus,
    laposteEmployer,
    canSendInformationsToLaposte,
    positionType,
    positionStage,
    hasCompanyMoreThan10Employees,
    hasCompanyMoreThan50Employees,
    allowFinancingAndOwnershipAdvices,
    positionContractType,
    nextStep,
    goToNextPhase,
    previousPhase,
    goToPreviousPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  let errors: FormFieldError = $state({});

  let formData = $derived.by(() => {
    let schema = z.object({
      hadBrsKnowledge: z.boolean({
        message: stepsContent.hadBrsKnowledge.errorMessage,
      }),
      employmentStatus: z.enum(
        [
          'SALARIE_PRIVE_NON_AGRICOLE',
          'SALARIE_AGRICOLE',
          'SALARIE_PUBLIC_OU_FONCTIONNAIRE',
          'INDEPENDANT',
          'SALARIE_GROUPE_LA_POSTE',
          'SANS_ACTIVITE_PROFESSIONNELLE',
          'RETRAITE',
        ],
        {
          message: stepsContent.employmentStatus.errorMessage,
        },
      ),
    });

    const publicSectorSchema = {
      positionType: z.enum(
        ['CADRE', 'NON_CADRE', 'NO_CATEGORIE_PROFESSIONNELLE'],
        {
          message: stepsContent.positionType.errorMessage,
        },
      ),
      positionStage: z.boolean({
        message: stepsContent.positionStage.errorMessage,
      }),
    };

    if (employmentStatus === 'SALARIE_GROUPE_LA_POSTE') {
      schema = schema.extend({
        laposteEmployer: z
          .string({
            message: stepsContent.laposteEmployer.errorMessage,
          })
          .refine((value) => {
            console.log(value);
            return value.length > 0;
          }, stepsContent.laposteEmployer.errorMessage),
        canSendInformationsToLaposte: z.boolean({
          message: stepsContent.canSendInformationsToLaposte.errorMessage,
        }),
        ...publicSectorSchema,
      });
    } else if (employmentStatus === 'SALARIE_PUBLIC_OU_FONCTIONNAIRE') {
      schema = schema.extend(publicSectorSchema);
    } else if (employmentStatus === 'SALARIE_PRIVE_NON_AGRICOLE') {
      schema = schema.extend({
        hasCompanyMoreThan10Employees: z.boolean({
          message: stepsContent.hasCompanyMoreThan10Employees.errorMessage,
        }),
        positionContractType: z.enum(['CDI', 'CDD'], {
          message: stepsContent.positionContractType.errorMessage,
        }),
      });

      if (hasCompanyMoreThan10Employees) {
        schema = schema.extend({
          allowFinancingAndOwnershipAdvices: z.boolean({
            message:
              stepsContent.allowFinancingAndOwnershipAdvices.errorMessage,
          }),
        });
      }
    } else if (employmentStatus === 'SALARIE_AGRICOLE') {
      schema = schema.extend({
        hasCompanyMoreThan50Employees: z.boolean({
          message: stepsContent.hasCompanyMoreThan50Employees.errorMessage,
        }),
        positionContractType: z.enum(['CDI', 'CDD'], {
          message: stepsContent.positionContractType.errorMessage,
        }),
      });

      if (hasCompanyMoreThan50Employees) {
        schema = schema.extend({
          allowFinancingAndOwnershipAdvices: z.boolean({
            message:
              stepsContent.allowFinancingAndOwnershipAdvices.errorMessage,
          }),
        });
      }
    }

    return schema;
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const payload = {
      hadBrsKnowledge,
      employmentStatus,
      laposteEmployer,
      canSendInformationsToLaposte,
      positionType,
      positionStage,
      hasCompanyMoreThan10Employees,
      hasCompanyMoreThan50Employees,
      allowFinancingAndOwnershipAdvices,
      positionContractType,
    };

    try {
      formData.parse(payload);
      errors = {};
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

    <div class="fr-fieldset__element fr-mb-4w">
      <Select
        label={stepsContent.hadBrsKnowledge.label}
        required
        options={stepsContent.hadBrsKnowledge.options.map((stepContent) => ({
          ...stepContent,
          selected: hadBrsKnowledge === stepContent.value,
        }))}
        onChange={(e) => {
          const { value } = e.target as HTMLSelectElement;

          if (value) {
            delete errors.hadBrsKnowledge;
          }

          eligibilitySimulatorManager.hadBrsKnowledge =
            value === '' ? undefined : value === 'true' ? true : false;
        }}
        error={errors.hadBrsKnowledge}
        errorDataTestId={stepsContent.hadBrsKnowledge.errorDataTestId} />
    </div>

    <div class="fr-fieldset__element fr-mb-4w">
      <Select
        label={stepsContent.employmentStatus.label}
        required
        options={stepsContent.employmentStatus.options.map((stepContent) => ({
          ...stepContent,
          selected: employmentStatus === stepContent.value,
        }))}
        onChange={(e) => {
          const { value } = e.target as HTMLSelectElement;

          if (value) {
            delete errors.employmentStatus;
          }

          eligibilitySimulatorManager.employmentStatus =
            value as EmploymentStatus;
        }}
        error={errors.employmentStatus}
        errorDataTestId={stepsContent.employmentStatus.errorDataTestId} />
    </div>

    {#if employmentStatus === 'SALARIE_GROUPE_LA_POSTE'}
      {@render laPoste()}
    {:else if employmentStatus === 'SALARIE_PUBLIC_OU_FONCTIONNAIRE'}
      {@render publicSector()}
    {:else if employmentStatus === 'SALARIE_PRIVE_NON_AGRICOLE'}
      {@render privateSector()}
    {:else if employmentStatus === 'SALARIE_AGRICOLE'}
      {@render agricoleSector()}
    {/if}
  </fieldset>

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

{#snippet laPoste()}
  <div class="fr-fieldset__element fr-mb-4w">
    <Input
      value={laposteEmployer}
      label={stepsContent.laposteEmployer.label}
      required
      skipHTML5Required
      id="laposte-employer"
      dataTestId={stepsContent.laposteEmployer.inputDataTestId}
      placeholder="Exemple: La Banque Postale"
      hint="Exemple: Maison mère, La Banque Postale, Chronopost, etc."
      maxlength={100}
      onChange={(e) => {
        eligibilitySimulatorManager.laposteEmployer = (
          e.target as HTMLInputElement
        ).value;
      }}
      error={errors.laposteEmployer}
      errorDataTestId={stepsContent.laposteEmployer.errorDataTestId} />
  </div>

  <div class="fr-fieldset__element fr-mb-4w">
    <Select
      label={stepsContent.canSendInformationsToLaposte.label}
      required
      options={stepsContent.canSendInformationsToLaposte.options.map(
        (stepContent) => ({
          ...stepContent,
          selected: canSendInformationsToLaposte === stepContent.value,
        }),
      )}
      onChange={(e) => {
        const { value } = e.target as HTMLSelectElement;

        if (value) {
          delete errors.canSendInformationsToLaposte;
        }

        eligibilitySimulatorManager.canSendInformationsToLaposte =
          value === '' ? undefined : value === 'true' ? true : false;
      }}
      error={errors.canSendInformationsToLaposte}
      errorDataTestId={stepsContent.canSendInformationsToLaposte
        .errorDataTestId} />
  </div>

  {@render publicSector()}
{/snippet}

{#snippet publicSector()}
  <div class="fr-fieldset__element fr-mb-4w">
    <Select
      label={stepsContent.positionType.label}
      required
      options={stepsContent.positionType.options.map((stepContent) => ({
        ...stepContent,
        selected: positionType === stepContent.value,
      }))}
      onChange={(e) => {
        const { value } = e.target as HTMLSelectElement;

        if (value) {
          delete errors.positionType;
        }

        eligibilitySimulatorManager.positionType = value as PositionType;
      }}
      error={errors.positionType}
      errorDataTestId={stepsContent.positionType.errorDataTestId} />
  </div>

  <div class="fr-fieldset__element fr-mb-4w">
    <Select
      label={stepsContent.positionStage.label}
      required
      options={stepsContent.positionStage.options.map((stepContent) => ({
        ...stepContent,
        selected: positionStage === stepContent.value,
      }))}
      onChange={(e) => {
        const { value } = e.target as HTMLSelectElement;

        if (value) {
          delete errors.positionStage;
        }

        eligibilitySimulatorManager.positionStage =
          value === '' ? undefined : value === 'true' ? true : false;
      }}
      error={errors.positionStage}
      errorDataTestId={stepsContent.positionStage.errorDataTestId} />
  </div>
{/snippet}

{#snippet privateSector()}
  <div class="fr-fieldset__element fr-mb-4w">
    <Select
      label={stepsContent.hasCompanyMoreThan10Employees.label}
      required
      options={stepsContent.hasCompanyMoreThan10Employees.options.map(
        (stepContent) => ({
          ...stepContent,
          selected: hasCompanyMoreThan10Employees === stepContent.value,
        }),
      )}
      onChange={(e) => {
        const { value } = e.target as HTMLSelectElement;

        if (value) {
          delete errors.hasCompanyMoreThan10Employees;
        }

        eligibilitySimulatorManager.hasCompanyMoreThan10Employees =
          value === '' ? undefined : value === 'true' ? true : false;
      }}
      error={errors.hasCompanyMoreThan10Employees}
      errorDataTestId={stepsContent.hasCompanyMoreThan10Employees
        .errorDataTestId} />
  </div>

  {#if hasCompanyMoreThan10Employees}
    {@render financingAndOwnershipAdvices()}
  {/if}

  {@render positionContractTypeSnippet()}
{/snippet}

{#snippet agricoleSector()}
  <div class="fr-fieldset__element fr-mb-4w">
    <Select
      label={stepsContent.hasCompanyMoreThan50Employees.label}
      required
      options={stepsContent.hasCompanyMoreThan50Employees.options.map(
        (stepContent) => ({
          ...stepContent,
          selected: hasCompanyMoreThan50Employees === stepContent.value,
        }),
      )}
      onChange={(e) => {
        const { value } = e.target as HTMLSelectElement;

        if (value) {
          delete errors.hasCompanyMoreThan50Employees;
        }

        eligibilitySimulatorManager.hasCompanyMoreThan50Employees =
          value === '' ? undefined : value === 'true' ? true : false;
      }}
      error={errors.hasCompanyMoreThan50Employees}
      errorDataTestId={stepsContent.hasCompanyMoreThan50Employees
        .errorDataTestId} />
  </div>

  {#if hasCompanyMoreThan50Employees}
    {@render financingAndOwnershipAdvices()}
  {/if}

  {@render positionContractTypeSnippet()}
{/snippet}

{#snippet financingAndOwnershipAdvices()}
  <div class="fr-fieldset__element fr-mb-4w">
    <p class="fr-mb-2w">
      Etant donné votre situation professionnelle, vous êtes également éligible
      au service de <a
        href="https://www.actionlogement.fr/le-conseil-en-accession?ept-publisher=boris&ept-name=boris-partenariat&eseg-name=site&eseg-item=test-eligibilite"
        class="fr-link">
        Conseil en financement et en accession
      </a>
      de notre partenaire Action Logement.
    </p>
    <Select
      label={stepsContent.allowFinancingAndOwnershipAdvices.label}
      required
      options={stepsContent.allowFinancingAndOwnershipAdvices.options.map(
        (stepContent) => ({
          ...stepContent,
          selected: allowFinancingAndOwnershipAdvices === stepContent.value,
        }),
      )}
      onChange={(e) => {
        const { value } = e.target as HTMLSelectElement;

        if (value) {
          delete errors.allowFinancingAndOwnershipAdvices;
        }

        eligibilitySimulatorManager.allowFinancingAndOwnershipAdvices =
          value === '' ? undefined : value === 'true' ? true : false;
      }}
      error={errors.allowFinancingAndOwnershipAdvices}
      errorDataTestId={stepsContent.allowFinancingAndOwnershipAdvices
        .errorDataTestId} />
  </div>
{/snippet}

{#snippet positionContractTypeSnippet()}
  <div class="fr-fieldset__element fr-mb-4w">
    <Select
      label={stepsContent.positionContractType.label}
      required
      options={stepsContent.positionContractType.options.map((stepContent) => ({
        ...stepContent,
        selected: positionContractType === stepContent.value,
      }))}
      onChange={(e) => {
        const { value } = e.target as HTMLSelectElement;

        if (value) {
          delete errors.positionContractType;
        }

        eligibilitySimulatorManager.positionContractType =
          value as ContractType;
      }}
      error={errors.positionContractType}
      errorDataTestId={stepsContent.positionContractType.errorDataTestId} />
  </div>
{/snippet}

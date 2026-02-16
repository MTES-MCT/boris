<script lang="ts">
  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Action from '$components/common/Simulator/Action.svelte';
  import { steps, stepsContent } from '$lib/utils/eligibility-simulator';
  import EligibilityDetail from '$components/pages/simulateur-eligibilite/steps/EligibilityResult/EligibilityDetail.svelte';

  const {
    householdSize,
    singlePersonInHousehold,
    moreThanSixPersonsInHousehold,
    hasDisability,
    dependantsAmount,
    declarationType,
    formattedTaxableIncome,
    firstCoBuyerFormattedTaxableIncome,
    secondCoBuyerFormattedTaxableIncome,
    propertySituation,
    hasRefusedConnection,
    currentPhase,
    previousStep,
    goToPreviousPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  let previousPhaseTitle = $derived.by(() => {
    if (hasRefusedConnection) {
      return steps[1].title;
    }

    return previousStep?.title as string;
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
  };
</script>

<Form onSubmit={handleSubmit}>
  <fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
      <h3 class="fr-h4">{currentPhase?.title as string}</h3>
    </div>

    <div class="fr-fieldset__element">
      {@render householdComposition()}
      {@render fiscalRevenues()}
      {@render propertySituationSnippet()}
    </div>

    <p>
      Vous pouvez modifier vos réponses en revenant aux étapes précédentes du
      simulateur.
    </p>

    <div class="separator !mb-12"></div>

    <EligibilityDetail hideConnectionCta />
  </fieldset>

  <Actions>
    <Action
      direction="previous"
      label={previousPhaseTitle}
      onClick={goToPreviousPhase}
      {loading} />
  </Actions>
</Form>

{#snippet householdComposition()}
  {#if singlePersonInHousehold}
    <p>
      <span data-testid={stepsContent.synthesis.householdSize.dataTestId}>
        {@html stepsContent.synthesis.householdSize.singlePerson}
      </span>
      <span data-testid={stepsContent.synthesis.hasDisability.dataTestId}>
        {@html stepsContent.synthesis.hasDisability.singlePerson[
          hasDisability ? 'yes' : 'no'
        ]}
      </span>
    </p>
  {:else}
    <p>
      <span data-testid={stepsContent.synthesis.householdSize.dataTestId}>
        {@html stepsContent.synthesis.householdSize.severalPersons(
          householdSize as number,
        )}
      </span>
      {#if !moreThanSixPersonsInHousehold}
        <span data-testid={stepsContent.synthesis.dependantsAmount.dataTestId}>
          {@html stepsContent.synthesis.dependantsAmount.severalPersons(
            dependantsAmount as number,
          )}
        </span>
        <span data-testid={stepsContent.synthesis.hasDisability.dataTestId}>
          {@html stepsContent.synthesis.hasDisability.severalPersons[
            hasDisability ? 'yes' : 'no'
          ]}
        </span>
      {/if}
    </p>
  {/if}
{/snippet}

{#snippet fiscalRevenues()}
  {#if singlePersonInHousehold}
    <p data-testid={stepsContent.synthesis.fiscalRevenues.dataTestId}>
      {@html stepsContent.synthesis.fiscalRevenues.singlePerson(
        formattedTaxableIncome as string,
      )}
    </p>
  {:else if declarationType === 'SEUL_SOUHAIT_SEUL'}
    <p
      class="!mb-0"
      data-testid={stepsContent.synthesis.declarationType.dataTestId}>
      {@html stepsContent.synthesis.declarationType.severalPersons
        .seulSouhaitSeul}
    </p>
    <p data-testid={stepsContent.synthesis.fiscalRevenues.dataTestId}>
      {@html stepsContent.synthesis.fiscalRevenues.severalPersons.seulSouhaitSeul(
        formattedTaxableIncome as string,
      )}
    </p>
  {:else if declarationType === 'SEUL_SOUHAIT_PARTENAIRE'}
    <p
      class="!mb-0"
      data-testid={stepsContent.synthesis.declarationType.dataTestId}>
      {@html stepsContent.synthesis.declarationType.severalPersons
        .seulSouhaitPartenaire}
    </p>
    <p data-testid={stepsContent.synthesis.fiscalRevenues.dataTestId}>
      {@html stepsContent.synthesis.fiscalRevenues.severalPersons.seulSouhaitPartenaire(
        firstCoBuyerFormattedTaxableIncome as string,
        secondCoBuyerFormattedTaxableIncome as string,
      )}
    </p>
  {:else if declarationType === 'COMMUN'}
    <p
      class="!mb-0"
      data-testid={stepsContent.synthesis.declarationType.dataTestId}>
      {@html stepsContent.synthesis.declarationType.severalPersons.commun}
    </p>
    <p data-testid={stepsContent.synthesis.fiscalRevenues.dataTestId}>
      {@html stepsContent.synthesis.fiscalRevenues.severalPersons.commun(
        formattedTaxableIncome as string,
      )}
    </p>
  {/if}
{/snippet}

{#snippet propertySituationSnippet()}
  <p data-testid={stepsContent.synthesis.propertySituation.dataTestId}>
    {#if propertySituation === 'PROPRIETAIRE'}
      {@html stepsContent.synthesis.propertySituation.owner}
    {:else if propertySituation === 'LOCATAIRE_SOCIAL'}
      {@html stepsContent.synthesis.propertySituation.socialTenant}
    {:else if propertySituation === 'LOCATAIRE_PRIVE'}
      {@html stepsContent.synthesis.propertySituation.privateTenant}
    {:else if propertySituation === 'HEBERGE'}
      {@html stepsContent.synthesis.propertySituation.housed}
    {:else}
      {@html stepsContent.synthesis.propertySituation.other}
    {/if}
  </p>
{/snippet}

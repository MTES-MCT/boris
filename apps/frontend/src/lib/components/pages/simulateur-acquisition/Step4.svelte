<script lang="ts">
  import acquisitionSimulatorManger from '$lib/managers/acquisition-simulator.svelte';

  import Wrapper from '$components/pages/simulateur-acquisition/Wrapper.svelte';
  import Description from '$components/pages/simulateur-acquisition/Description.svelte';
  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
  import OperationSynthesis from './OperationSynthesis.svelte';
  import Notice from '$components/common/Notice.svelte';

  let {
    housingPrice,
    ownContribution,
    notaryFees,
    estimatedNotaryFees,
    // loanFees,
    // estimatedLoanFees,
    realEstateFees,
    estimatedRealEstateFees,
    oneTimeExpenses,
    totalCost,
    loanAmount,
    nextStep,
    previousStep,
    goToPreviousStep,
    goToNextStep,
  } = $derived(acquisitionSimulatorManger);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    goToNextStep();
  };
</script>

<Wrapper>
  <Description
    content="Voici un premier récapitulatif de votre apport, du prix du logement et de tous les frais annexes. Cette synthèse vous aide à visualiser le budget global nécessaire et le montant exact à emprunter pour finaliser votre projet." />
  <Form onSubmit={handleSubmit}>
    <div class="fieldset-container">
      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element fr-mb-4w">
          <OperationSynthesis
            housingPrice={housingPrice as number}
            ownContribution={ownContribution as number}
            notaryFees={notaryFees || estimatedNotaryFees}
            realEstateFees={realEstateFees || estimatedRealEstateFees}
            oneTimeExpenses={oneTimeExpenses as number}
            totalCost={totalCost as number}
            loanAmount={loanAmount as number} />
        </div>

        <div class="fr-fieldset__element">
          <Notice
            content="Vous pourrez télécharger la synthèse de votre simulation à la fin du parcours." />
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

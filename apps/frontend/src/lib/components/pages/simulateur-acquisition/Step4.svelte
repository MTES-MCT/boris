<script lang="ts">
  import acquisitionSimulatorManger from '$lib/managers/acquisition-simulator.svelte';

  import Wrapper from '$components/pages/simulateur-acquisition/Wrapper.svelte';
  import Description from '$components/pages/simulateur-acquisition/Description.svelte';
  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Table from '$components/common/Table.svelte';
  import { formatEuro } from '$lib/utils/formatters';

  let {
    housingPrice,
    ownContribution,
    notaryFees,
    estimatedNotaryFees,
    loanFees,
    estimatedLoanFees,
    realEstateFees,
    estimatedRealEstateFees,
    oneTimeExpenses,
    totalFees,
    ownContributionAfterFees,
    loanAmount,
    nextStep,
    previousStep,
    goToPreviousStep,
  } = $derived(acquisitionSimulatorManger);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    console.log('handleSubmit');
  };
</script>

<Wrapper>
  <Description
    content="Voici un premier récapitulatif de votre apport, du prix du logement et de tous les frais annexes. Cette synthèse vous aide à visualiser le budget global nécessaire et le montant exact à emprunter pour finaliser votre projet." />
  <Form onSubmit={handleSubmit}>
    <div class="fieldset-container">
      <fieldset class="fr-fieldset">
        <legend class="fr-h4">4. Synthèse de l'apport et des frais</legend>
        <Table
          theads={['Poste', 'Montant']}
          tbodies={[
            ['Prix du logement', housingPrice ? formatEuro(housingPrice) : '-'],
          ]} />
        <button
          type="button"
          class="fr-btn fr-btn--secondary fr-btn--download"
          onclick={() => window.print()}>
          Télécharger le récapitulatif
        </button>
      </fieldset>
    </div>
  </Form>
</Wrapper>

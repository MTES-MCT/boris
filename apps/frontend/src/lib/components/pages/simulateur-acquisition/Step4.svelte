<script lang="ts">
  import acquisitionSimulatorManger from '$lib/managers/acquisition-simulator.svelte';

  import Wrapper from '$components/pages/simulateur-acquisition/Wrapper.svelte';
  import Description from '$components/pages/simulateur-acquisition/Description.svelte';
  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Table from '$components/common/Table.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
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
          theads={[]}
          tbodies={[
            ['Prix du logement', formatEuro(housingPrice || 0)],
            ['Apport personnel', formatEuro(ownContribution || 0)],
            ['Frais de notaire', formatEuro(notaryFees || estimatedNotaryFees)],
            [
              'Frais de garantie/prêt',
              // formatEuro(loanFees || estimatedLoanFees),
              'Définir le calcul',
            ],
            [
              "Frais d'agence",
              formatEuro(realEstateFees || estimatedRealEstateFees),
            ],
            ['Total', formatEuro((housingPrice as number) + totalFees)],
            [
              'Apport restant après frais',
              formatEuro(Math.max(ownContributionAfterFees, 0)),
            ],
            ["Besoin d'emprunt", formatEuro(loanAmount)],
          ]}
          size="lg" />
        <button
          type="button"
          class="fr-btn fr-btn--secondary fr-btn--download fr-mb-4w not-printable"
          onclick={() => window.print()}>
          Télécharger le récapitulatif
        </button>
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

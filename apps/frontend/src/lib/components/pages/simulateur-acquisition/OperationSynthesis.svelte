<script lang="ts">
  import { formatEuro } from '$lib/utils/formatters';
  import Block from '$components/pages/simulateur-acquisition/synthesis/Block.svelte';
  import Row from '$components/pages/simulateur-acquisition/synthesis/Row.svelte';
  import RowContainer from '$components/pages/simulateur-acquisition/synthesis/RowContainer.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  const {
    housingPrice,
    ownContribution,
    notaryFees,
    estimatedNotaryFees,
    realEstateFees,
    estimatedRealEstateFees,
    oneTimeExpenses,
    totalCost,
    loanAmount,
  } = $derived(acquisitionSimulatorManager);
</script>

<Block isLast>
  <RowContainer>
    <Row
      title="Montant du logement"
      value={formatEuro(housingPrice as number)}
      status="info" />
    <Row
      title="Frais de notaire"
      value={`+ ${formatEuro(notaryFees || estimatedNotaryFees || 0)}`}
      status="info" />
    {#if realEstateFees || estimatedRealEstateFees}
      <Row
        title="Frais d'agence"
        value={`+ ${formatEuro(realEstateFees || estimatedRealEstateFees || 0)}`}
        status="info" />
    {/if}
    {#if oneTimeExpenses}
      <Row
        title="Autres frais ponctuels"
        value={`+ ${formatEuro(oneTimeExpenses || 0)}`}
        status="info" />
    {/if}

    <div class="separator"></div>

    <Row
      title="Coût total de l'opération"
      value={`= ${formatEuro(totalCost)}`}
      status="success" />
    {#if ownContribution}
      <Row
        title="Apport personnel"
        value={`- ${formatEuro(ownContribution || 0)}`}
        status="new" />
    {/if}

    <div class="separator"></div>

    <Row
      title="Montant de l'emprunt"
      value={`= ${formatEuro(loanAmount)}`}
      status="success" />

    <Row
      title="Frais de garantie/prêt"
      value={`+ ${formatEuro(loanAmount * 0.008 || 0)}`}
      status="info"
      tooltip="Frais liés à la mise en place de votre prêt immobilier (caution, garantie, dossier). Généralement autour de 0,8% du montant emprunté + frais de dossier. Environ 70% de cette somme vous serons reversés lorsque que vous aurez remboursé l'intégralité de votre prêt." />
  </RowContainer>
</Block>

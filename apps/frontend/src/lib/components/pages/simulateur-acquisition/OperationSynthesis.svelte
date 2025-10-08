<script lang="ts">
  import Tooltip from '$components/common/Tooltip.svelte';
  import { formatEuro } from '$lib/utils/formatters';
  import Element from '$components/pages/simulateur-acquisition/Synthesis/Element.svelte';
  import Row from '$components/pages/simulateur-acquisition/Synthesis/Row.svelte';
  import RowContainer from '$components/pages/simulateur-acquisition/Synthesis/RowContainer.svelte';

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

<Element isLast>
  <RowContainer>
    <Row
      title="Montant du logement"
      value={formatEuro(housingPrice as number)}
      status="info" />
    <Row
      title="Frais de notaire"
      value={formatEuro(notaryFees || estimatedNotaryFees || 0)}
      status="info"
      operator="+" />
    {#if realEstateFees || estimatedRealEstateFees}
      <Row
        title="Frais d'agence"
        value={formatEuro(realEstateFees || estimatedRealEstateFees || 0)}
        status="info"
        operator="+" />
    {/if}
    {#if oneTimeExpenses}
      <Row
        title="Autres frais ponctuels"
        value={formatEuro(oneTimeExpenses || 0)}
        status="info"
        operator="+" />
    {/if}

    <div class="separator"></div>

    <Row
      title="Coût total de l'opération"
      value={formatEuro(totalCost)}
      status="success"
      operator="=" />
    {#if ownContribution}
      <Row
        title="Apport personnel"
        value={formatEuro(ownContribution || 0)}
        status="new"
        operator="-" />
    {/if}

    <div class="separator"></div>

    <Row
      title="Montant de l'emprunt"
      value={formatEuro(loanAmount)}
      status="success"
      operator="=" />

    <Row
      title="Frais de garantie/prêt"
      value={formatEuro(loanAmount * 0.008 || 0)}
      status="info"
      operator="+"
      tooltip="Frais liés à la mise en place de votre prêt immobilier (caution, garantie, dossier). Généralement autour de 0,8% du montant emprunté + frais de dossier. Environ 70% de cette somme vous serons reversés lorsque que vous aurez remboursé l'intégralité de votre prêt." />
  </RowContainer>
</Element>

{#snippet row(
  label: string,
  amount: string,
  highlighted: boolean = false,
  tooltip: string = '',
)}
  <div
    class="row"
    class:highlighted>
    <p class="fr-mb-0">
      {#if highlighted}
        <b>
          {label}
        </b>
      {:else}
        {label}
      {/if}
      {#if tooltip}
        <Tooltip>
          <div class="fr-p-2w">
            {@html tooltip}
          </div>
        </Tooltip>
      {/if}
    </p>
    <span><b>{amount}</b></span>
  </div>
{/snippet}

<style lang="postcss">
  .row {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding-inline: 0.75rem;
    padding-block: 0.25rem;

    &.highlighted {
      border-radius: var(--border-radius-sm);
      background-color: var(--background-contrast-info);
      padding-block: 0.5rem;
    }

    p {
      display: flex;
      gap: 0.5rem;
    }
  }
</style>

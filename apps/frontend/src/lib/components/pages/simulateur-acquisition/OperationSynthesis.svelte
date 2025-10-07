<script lang="ts">
  import Tooltip from '$components/common/Tooltip.svelte';
  import { formatEuro } from '$lib/utils/formatters';
  import Element from './synthesis/Element.svelte';
  import Row from './synthesis/Row.svelte';
  import RowContainer from './synthesis/RowContainer.svelte';

  type Props = {
    housingPrice: number;
    ownContribution: number;
    notaryFees: number;
    realEstateFees: number;
    oneTimeExpenses: number;
    totalCost: number;
    loanAmount: number;
  };

  const {
    housingPrice,
    ownContribution,
    notaryFees,
    realEstateFees,
    oneTimeExpenses,
    totalCost,
    loanAmount,
  }: Props = $props();
</script>

<Element isLast>
  <RowContainer>
    <Row
      title="Montant du logement"
      value={formatEuro(housingPrice)}
      status="info" />
    <Row
      title="Frais de notaire"
      value={formatEuro(notaryFees || 0)}
      status="info"
      operator="+" />
    {#if realEstateFees}
      <Row
        title="Frais d'agence"
        value={formatEuro(realEstateFees || 0)}
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

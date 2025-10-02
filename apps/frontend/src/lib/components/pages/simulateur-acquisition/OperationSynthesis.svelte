<script lang="ts">
  import Tooltip from '$components/common/Tooltip.svelte';
  import { formatEuro } from '$lib/utils/formatters';

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

{@render row('Montant du logement', formatEuro(housingPrice))}
{@render row('Frais de notaire', `+ ${formatEuro(notaryFees || 0)}`)}
{#if realEstateFees}
  {@render row("Frais d'agence", `+ ${formatEuro(realEstateFees || 0)}`)}
{/if}
{#if oneTimeExpenses}
  {@render row(
    'Autres frais ponctuels',
    `+ ${formatEuro(oneTimeExpenses || 0)}`,
  )}
{/if}

<div class="separator"></div>

{@render row("Coût total de l'opération", formatEuro(totalCost), true)}
{#if ownContribution}
  {@render row('Apport personnel', `- ${formatEuro(ownContribution || 0)}`)}
{/if}

<div class="separator"></div>
{@render row("Montant de l'emprunt", formatEuro(loanAmount), true)}
{@render row(
  'Frais de garantie/prêt',
  `+ ${formatEuro(loanAmount * 0.008 || 0)}`,
  false,
  "Frais liés à la mise en place de votre prêt immobilier (caution, garantie, dossier). Généralement autour de 0,8% du montant emprunté + frais de dossier. Environ 70% de cette somme vous serons reversés lorsque que vous aurez remboursé l'intégralité de votre prêt.",
)}

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

  .separator {
    height: 1px;
    width: 100%;
    background-color: black;
    margin-block: 1rem;
  }
</style>

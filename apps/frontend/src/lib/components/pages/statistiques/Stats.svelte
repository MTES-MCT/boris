<script lang="ts">
  import Disclaimer from '$components/common/Disclaimer.svelte';
  import Tile from '$components/common/Tile.svelte';
  import { formatEuro, formatNumber } from '$lib/utils/formatters';
  import type { EligibilityStatsItem } from '$lib/types/statistics';

  type Props = {
    investedAmount: number;
    purchasePlanAmount: string;
    ofssAmount: number;
    eligibility: EligibilityStatsItem[];
    hideDisclaimer?: boolean;
    householdsData: {
      total: number;
      brsUnawarePercentage: number;
      totalsRealEstateSituation: {
        realEstateSituation: string;
        count: string;
      }[];
    };
  };

  const {
    investedAmount,
    purchasePlanAmount,
    ofssAmount,
    eligibility,
    hideDisclaimer = false,
    householdsData,
  }: Props = $props();

  const eligibilityData = $derived.by(() => {
    const countByBucket = eligibility.reduce<Record<string, number>>(
      (accumulator, item) => {
        accumulator[item.eligibility] = Number(item.count);

        return accumulator;
      },
      {},
    );

    const totalEligible =
      (countByBucket.A_AND_ABIS ?? 0) +
      (countByBucket.B1 ?? 0) +
      (countByBucket.B2_AND_C ?? 0);
    const total = totalEligible + (countByBucket.NONE ?? 0);

    return {
      total,
      eligiblePercentage: total === 0 ? 0 : (totalEligible / total) * 100,
    };
  });
</script>

{#if !hideDisclaimer}
  <Disclaimer content="en chiffres clés" />
{/if}

<div
  class="flex flex-wrap gap-4 lg:gap-8 justify-center mt-16 mb-16 w-[calc(100%-1rem)] mx-auto">
  <div class="w-full md:w-[calc(50%-1rem)]">
    <Tile
      title={formatEuro(investedAmount)}
      description="d'argent public investi sur notre plateforme."
      pictogram="money" />
  </div>

  <div class="w-full md:w-[calc(50%-1rem)]">
    <Tile
      title={formatNumber(eligibilityData.total)}
      pictogram="application">
      <p class="fr-tile__desc">simulations</p>
      <p class="fr-tile__detail !block">
        {@render detailedPercentage({
          percentage: eligibilityData.eligiblePercentage,
          detail: 'des simulations concernent des ménages éligibles.',
        })}
      </p>
    </Tile>
  </div>

  <div class="w-full hidden md:block">
    {@render horizontalTile(true)}
  </div>

  <div class="w-full block md:hidden">
    {@render horizontalTile()}
  </div>

  <div class="w-full md:w-[calc(50%-1rem)]">
    <Tile
      title={purchasePlanAmount}
      description="ménages avec un projet d'achat"
      pictogram="environment" />
  </div>
  <div class="w-full md:w-[calc(50%-1rem)]">
    <Tile
      title={`${ofssAmount}`}
      description="Organismes de foncier solidaire (OFS) partenaires"
      pictogram="ecosystem" />
  </div>
</div>

{#snippet detailedPercentage({
  percentage,
  detail,
}: {
  percentage: number;
  detail: string;
})}
  <span class="fr-text--bold">
    {formatNumber(percentage)}%
  </span>

  {detail}
{/snippet}

{#snippet horizontalTile(flipped: boolean = false)}
  <Tile
    title={formatNumber(householdsData.total)}
    horizontal={flipped}
    pictogram="community">
    <p class="fr-tile__desc">
      ménages recontactés après simulation d'éligibilité
    </p>
    <p class="fr-tile__detail !block">
      {@render detailedPercentage({
        percentage: householdsData.brsUnawarePercentage,
        detail: 'des ménages ne connaissaient pas le BRS avant BoRiS.',
      })}

      {#each householdsData.totalsRealEstateSituation as item}
        <br />
        {@render detailedPercentage({
          percentage: Number(item.count),
          detail: `des ménages déclarent être ${item.realEstateSituation}`,
        })}
      {/each}
    </p>
  </Tile>
{/snippet}

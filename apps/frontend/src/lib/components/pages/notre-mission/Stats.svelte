<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import Disclaimer from '$components/common/Disclaimer.svelte';
  import type { Statistic } from '$lib/utils/definitions';
  import Tile from '$components/common/Tile.svelte';
  import { formatEuro, formatNumber } from '$lib/utils/formatters';
  import type { PageData } from '../../../../routes/notre-mission/$types';

  type Props = {
    investedAmount: PageData['investedAmount'];
    purchasePlanAmount: PageData['purchasePlanAmount'];
    ofssAmount: PageData['ofssAmount'];
    eligibility: PageData['eligibility'];
    brsKnowledge: PageData['brsKnowledge'];
    realEstateSituation: PageData['realEstateSituation'];
  };

  const {
    investedAmount,
    purchasePlanAmount,
    ofssAmount,
    eligibility,
    brsKnowledge,
    realEstateSituation,
  }: Props = $props();

  const eligibilityData = $derived.by(() => {
    const total = eligibility.reduce(
      (sum, item) => sum + Number(item.count),
      0,
    );

    const totalEligible = eligibility
      .filter((item) => item.eligibility !== '3')
      .reduce((sum, item) => sum + Number(item.count), 0);

    return {
      total,
      eligiblePercentage: (totalEligible / total) * 100,
    };
  });

  const householdsData = $derived.by(() => {
    const total = brsKnowledge.reduce(
      (sum, item) => sum + Number(item.count),
      0,
    );

    const totalUnawareOfBrs = brsKnowledge
      .filter((item) => item.brsKnowledge === 'Non')
      .reduce((sum, item) => sum + Number(item.count), 0);

    const totalsRealEstateSituation = realEstateSituation
      .filter(
        (item) =>
          item.realEstateSituation !== null &&
          item.realEstateSituation !== 'dans une autre situation immobilière',
      )
      .map((item) => {
        return {
          realEstateSituation: item.realEstateSituation,
          count: (Number(item.count) / total) * 100,
        };
      });

    totalsRealEstateSituation.push({
      realEstateSituation: 'dans une autre situation immobilière',
      count:
        100 -
        totalsRealEstateSituation.reduce(
          (sum, item) => sum + Number(item.count),
          0,
        ),
    });

    return {
      total: total,
      brsUnawarePercentage: (totalUnawareOfBrs / total) * 100,
      totalsRealEstateSituation,
    };
  });

  $inspect(householdsData);
</script>

<Section id="statistiques">
  <div
    class="max-w-[768px] mx-auto p-4 md:p-10 rounded-tl-xl rounded-tr-xl bg-white">
    <Disclaimer content="en chiffres clés" />

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
          pictogram="community">
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
          pictogram="binders" />
      </div>
    </div>
  </div>
</Section>

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
          percentage: item.count,
          detail: `des ménages sont ${item.realEstateSituation}`,
        })}
      {/each}
    </p>
  </Tile>
{/snippet}

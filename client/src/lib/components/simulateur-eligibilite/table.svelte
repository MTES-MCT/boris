<script lang="ts">
  import Tooltip from '$components/tooltip/tooltip.svelte';
  import { eligibilityData } from '$lib/utils/constants';
  import { formatEuro } from '$lib/utils/formatters';
</script>

<div
  class="fr-table fr-table--bordered"
  id="table-bordered-component">
  <div class="fr-table__wrapper">
    <div class="fr-table__container">
      <div class="fr-table__content">
        <table id="table-bordered">
          <caption>Plafonds en vigueur depuis le premier Janvier 2024</caption>
          <thead>
            <tr>
              <th scope="col">Catégorie de ménage</th>
              <th scope="col">Zone A (et A bis)</th>
              <th scope="col">Zone B1</th>
              <th scope="col">Zone B2 et C</th>
            </tr>
          </thead>
          <tbody>
            {#each eligibilityData as data, i}
              <tr
                id={`table-bordered-row-key-${i + 1}`}
                data-row-key={i + 1}>
                <td class="menage-category-datacell">
                  <span>{data.category.small}</span>
                  {#if data.contentHtml}
                    <Tooltip>{@html data.contentHtml}</Tooltip>
                  {/if}
                </td>
                <td>{formatEuro(data.zoneAandAbis)}</td>
                <td>{formatEuro(data.zoneB1)}</td>
                <td>{formatEuro(data.zoneB2andC)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .fr-table caption {
    font-size: 1rem;
    font-weight: normal;
  }

  .menage-category-datacell {
    display: flex;
    gap: var(--2w);
  }
</style>

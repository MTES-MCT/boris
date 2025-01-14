<script lang="ts">
  import Tooltip from '$components/common/Tooltip.svelte';
  import { eligibilityData } from '$lib/utils/constants';
  import { formatEuro } from '$lib/utils/formatters';
</script>

{#each eligibilityData as data}
  <div class="category">
    <h4 class="fr-mb-0">{data.category}</h4>
    {#if data.options.length}
      <Tooltip>
        <ul>
          {@html `<li>${data.options.join('</li><li><b>ou </b>')}</li>`}
        </ul>
      </Tooltip>
    {/if}
  </div>
  <div class="grid">
    <div class="row">
      <p class="zone fr-mb-0"><b>Zones A et Abis</b></p>
      <p class="zone fr-mb-0"><b>Zone B1</b></p>
      <p class="zone fr-mb-0"><b>Zone B2 et C</b></p>
    </div>
    <div class="row values">
      <p class="value fr-mb-0 fr-artwork-background">
        {formatEuro(data.zoneAandAbis)}
      </p>
      <p class="value fr-mb-0 fr-artwork-background">
        {formatEuro(data.zoneB1)}
      </p>
      <p class="value fr-mb-0 fr-artwork-background">
        {formatEuro(data.zoneB2andC)}
      </p>
    </div>
  </div>
{/each}

<style lang="postcss">
  .grid {
    display: flex;
    gap: var(--1v);
  }

  .row {
    display: flex;
    flex-direction: column;
    gap: var(--1v);
    flex: 1;
  }

  p {
    text-align: center;
    font-size: 0.875rem;
  }

  ul {
    text-align: left;
    list-style: none;
    padding-inline: var(--2w);
  }

  .category {
    background-color: var(--color-blue-deep);
    padding: var(--1w) 0;
    margin-block-start: var(--3w);
    margin-block-end: var(--1v);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--2w);
  }

  h5 {
    display: inline;
    text-align: center;
  }

  .zone {
    border: solid 2px var(--color-blue-deep);
    padding: var(--1w) 0;
  }

  .value {
    background-color: var(--grey-975-75);
    border: solid 2px var(--grey-975-75);
    padding: var(--1w) 0;
  }

  @media (--xxs-viewport) {
    p {
      font-size: 1rem;
    }

    .zone {
      padding: var(--1w) var(--2w);
    }

    .value {
      padding: var(--1w) var(--2w);
    }
  }

  @media (--xs-viewport) {
    .grid {
      flex-direction: column;
    }

    .row {
      flex-direction: row;
    }

    p {
      flex: 1;
    }
  }
</style>

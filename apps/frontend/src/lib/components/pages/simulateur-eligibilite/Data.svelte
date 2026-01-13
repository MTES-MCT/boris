<script lang="ts">
  import Tooltip from '$components/common/Tooltip.svelte';
  import { eligibilityData } from '$lib/utils/constants';
  import { formatEuro } from '$lib/utils/formatters';
</script>

{#each eligibilityData as data}
  <div
    class="py-2 px-0 bg-blue-deep flex justify-center items-center gap-4 mt-6 mb-1">
    <h3 class="fr-mb-0 fr-h4">{data.category}</h3>
    {#if data.options.length}
      <Tooltip>
        <ul class="text-left !list-none !p-2">
          {@html `<li>${data.options.join('</li><li><b>ou </b>')}</li>`}
        </ul>
      </Tooltip>
    {/if}
  </div>
  <div class="flex gap-1 sm:flex-col">
    <div class="flex flex-col gap-1 flex-1 sm:flex-row">
      <p
        class="text-center !text-sm xs:!text-base flex-1 py-2 px-0 border-2 border-blue-deep fr-mb-0">
        <b>Zones A et Abis</b>
      </p>
      <p
        class="text-center !text-sm xs:!text-base flex-1 py-2 px-0 border-2 border-blue-deep fr-mb-0">
        <b>Zone B1</b>
      </p>
      <p
        class="text-center !text-sm xs:!text-base flex-1 py-2 px-0 border-2 border-blue-deep fr-mb-0">
        <b>Zone B2 et C</b>
      </p>
    </div>
    <div class="flex flex-col gap-1 flex-1 sm:flex-row bg-white">
      <p
        class="text-center !text-sm xs:!text-base flex-1 py-2 px-0 border-2 border-(--grey-975-75) fr-mb-0 bg-(--grey-975-75)">
        {formatEuro(data.zoneAandAbis)}
      </p>
      <p
        class="text-center !text-sm xs:!text-base flex-1 py-2 px-0 border-2 border-(--grey-975-75) fr-mb-0 bg-(--grey-975-75)">
        {formatEuro(data.zoneB1)}
      </p>
      <p
        class="text-center !text-sm xs:!text-base flex-1 py-2 px-0 border-2 border-(--grey-975-75) fr-mb-0 bg-(--grey-975-75)">
        {formatEuro(data.zoneB2andC)}
      </p>
    </div>
  </div>
{/each}

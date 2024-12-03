<script>
  import Accordion from '$components/accordion/accordion.svelte';
  import { formatEuro } from '$lib/utils/formatters';
  import { eligibilityData } from '$lib/utils/constants';
</script>

<p>Plafonds en vigueur depuis le premier Janvier 2024</p>

{#each eligibilityData as data}
  <Accordion label={data.category.long}>
    <div class="content">
      <p>{data.content}</p>
      <ul>
        <li>
          Zone A (et A bis): <b>{formatEuro(data.zoneAandAbis)}</b>
        </li>
        <li>
          Zone B1: <b>{formatEuro(data.zoneB1)}</b>
        </li>
        <li>
          Zone B1: <b>{formatEuro(data.zoneB2andC)}</b>
        </li>
      </ul>
    </div>
  </Accordion>
{/each}

<style lang="postcss">
  .content {
    padding-inline: var(--2w);
  }
</style>

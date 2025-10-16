<script lang="ts">
  import { default as MascotteShowing } from '$assets/icons/mascotte-showing.svg?raw';
  import Badge from '$components/common/Badge.svelte';
  import Tile from '$components/common/Tile.svelte';
  import type { Region } from '$lib/utils/definitions';
  import TitleWithMascotte from './TitleWithMascotte.svelte';

  type Props = {
    regions: Region[];
  };

  const { regions }: Props = $props();
</script>

<div class="fr-container rounded-box-lg background-color-white">
  <div class="wrapper">
    <TitleWithMascotte
      title="Liste des OFS"
      mascotte={MascotteShowing}
      reversed />

    <p>
      Voici la <b>liste des OFS agréés en France</b>
      , classés par région puis par ordre alphabétique.
    </p>

    <ul>
      {#each regions as region}
        <li class="region-item">
          <Badge
            hideIcon
            status="success">
            {region.name}
          </Badge>

          <ul class="ofs-list">
            {#each region.ofss as ofs}
              <li>
                <Badge
                  {...ofs.websiteUrl ? { status: 'info' } : {}}
                  hideIcon
                  uppercase={false}>
                  {#if ofs.websiteUrl}
                    <a
                      class="fr-link fr-text--sm"
                      href={ofs.websiteUrl}
                      target="_blank">
                      {ofs.name}
                    </a>{:else}
                    {ofs.name}
                  {/if}
                </Badge>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style class="wrapper">
  .wrapper {
    padding-block: 2rem;
    padding-inline: 0.25rem;

    @media (--sm-viewport) {
      padding-inline: 2rem;
    }
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 0;
  }

  .region-item {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border-radius: var(--border-radius-sm);
    padding: 1.5rem;
    box-shadow: 0 6px 12px rgba(134, 144, 162, 0.3);
  }

  .ofs-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 0.75rem;

    li {
      padding-bottom: 0;
    }
  }
</style>

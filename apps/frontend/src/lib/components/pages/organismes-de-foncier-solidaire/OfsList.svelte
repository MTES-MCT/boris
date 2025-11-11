<script lang="ts">
  import type { Region } from '$lib/utils/definitions';

  import { default as MascotteShowing } from '$assets/icons/mascotte-showing.svg?raw';
  import Badge from '$components/common/Badge.svelte';
  import TitleWithMascotte from './TitleWithMascotte.svelte';
  import ofsMap from '$assets/images/map-ofs.jpg';

  type Props = {
    regions: Region[];
  };

  const { regions }: Props = $props();
</script>

<div class="fr-container rounded-box-lg bg-white mb-12">
  <div class="py-4 px-1 md:px-4">
    <TitleWithMascotte
      title="Liste des OFS"
      mascotte={MascotteShowing}
      reversed />

    <p>
      Voici la <b>
        liste des organismes de foncier solidaire (OFS) agréés en France
      </b>
      , classés par région puis par ordre alphabétique. Certains organismes de foncier
      solidaire (OFS) ont un lien qui redirige vers leur site web.
    </p>

    <p class="fr-text--lg fr-text--bold fr-mb-0">Légende:</p>
    <ul class="fr-mb-4w !list-none !p-0">
      <li class="fr-mb-1v">
        <Badge
          normalCase
          accent="green-menthe"
          icon="road-map-line">
          Nom de la région
        </Badge>
      </li>
      <li class="fr-mb-1v">
        <Badge
          normalCase
          accent="yellow-tournesol"
          icon="community-line">
          Organisme de foncier solidaire (OFS)
        </Badge>
        <span class="fr-text--sm fr-text--bold">
          qui propose des logements en bail réel solidaire (BRS) à vendre.
        </span>
      </li>
      <li>
        <Badge
          normalCase
          accent="purple-glycine"
          icon="draft-line">
          Organisme de foncier solidaire (OFS)
        </Badge>
        <span class="fr-text--sm fr-text--bold">
          qui a obtenu l'agrément mais ne propose pas encore de logement en bail
          réel solidaire (BRS) à vendre.
        </span>
      </li>
    </ul>

    <div class="separator fr-mb-4w"></div>

    <ul class="!list-none !p-0 flex flex-col gap-6">
      {#each regions as region}
        <li
          class="flex flex-col gap-4 p-4 md:p-6 border border-(--border-default-grey) shadow-lg rounded-lg">
          <Badge
            icon="road-map-line"
            accent="green-menthe"
            normalCase>
            {region.name}
          </Badge>

          <ul class="!list-none !p-0 flex flex-wrap gap-2">
            {#each region.ofss as ofs}
              <li class="!pb-0">
                <Badge
                  accent={ofs.producesBrs
                    ? 'yellow-tournesol'
                    : 'purple-glycine'}
                  icon={ofs.producesBrs ? 'community-line' : 'draft-line'}
                  normalCase>
                  {#if ofs.websiteUrl}
                    <a
                      href={ofs.websiteUrl}
                      target="_blank">
                      {ofs.name}
                    </a>
                  {:else}
                    {ofs.name}
                  {/if}
                </Badge>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>

    <div class="separator fr-my-4w"></div>

    <div class="max-w-[600px] mx-auto">
      <img
        class="w-full"
        src={ofsMap}
        alt="" />
    </div>
  </div>
</div>

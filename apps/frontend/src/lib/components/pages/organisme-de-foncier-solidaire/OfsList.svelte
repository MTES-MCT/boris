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

<div class="fr-container rounded-box-lg background-color-white">
  <div class="fr-py-4w fr-px-1v fr-px-md-4w">
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

    <div class="fr-p-2w fr-mb-4w border-heavy-blue-france border-radius-sm">
      <p class="fr-text--lg fr-text--bold fr-mb-0">Légende:</p>
      <ul class="fr-mb-0">
        <li class="fr-mb-1v">
          <Badge
            uppercase={false}
            accent="green-menthe"
            hideIcon>
            <span class="fr-icon fr-icon--sm fr-icon-road-map-line"></span>
            <span class="fr-pl-1w">Nom de la région</span>
          </Badge>
        </li>
        <li class="fr-mb-1v">
          <Badge
            uppercase={false}
            accent="yellow-tournesol">
            <span class="fr-icon fr-icon--sm fr-icon-community-line"></span>
            <span class="fr-pl-1w">Organisme de foncier solidaire (OFS)</span>
          </Badge>
          <span class="fr-text--sm fr-text--bold color-yellow-tournesol">
            qui propose des logements en bail réel solidaire (BRS) à vendre.
          </span>
        </li>
        <li>
          <Badge
            uppercase={false}
            accent="purple-glycine">
            <span class="fr-icon fr-icon--sm fr-icon-draft-line"></span>
            <span class="fr-pl-1w">Organisme de foncier solidaire (OFS)</span>
          </Badge>
          <span class="fr-text--sm fr-text--bold color-purple-glycine">
            qui a obtenu l'agrément mais ne propose pas encore de logement en
            bail réel solidaire (BRS) à vendre.
          </span>
        </li>
      </ul>
    </div>

    <div class="separator fr-mb-4w"></div>

    <ul class="regions-list flex flex-column gap-3w list-style-none fr-p-0">
      {#each regions as region}
        <li
          class="region-item flex flex-column gap-2w fr-p-2w border-default-grey border-radius-sm box-shadow-primary">
          <Badge
            accent="green-menthe"
            uppercase={false}>
            <span class="fr-icon fr-icon--sm fr-icon-road-map-line"></span>
            <span class="fr-pl-1w">{region.name}</span>
          </Badge>

          <ul class="ofs-list flex flex-wrap gap-1w list-style-none fr-p-0">
            {#each region.ofss as ofs}
              <li class="fr-pb-0">
                <Badge
                  accent={ofs.producesBrs
                    ? 'yellow-tournesol'
                    : 'purple-glycine'}
                  uppercase={false}>
                  <span
                    class={`fr-icon fr-icon--sm fr-icon-${ofs.producesBrs ? 'community-line' : 'draft-line'}`}>
                  </span>
                  {#if ofs.websiteUrl}
                    <a
                      class="fr-text--sm fr-pl-1w"
                      href={ofs.websiteUrl}
                      target="_blank">
                      {ofs.name}
                    </a>
                  {:else}
                    <span class="fr-pl-1w">
                      {ofs.name}
                    </span>
                  {/if}
                </Badge>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>

    <div class="separator fr-my-4w"></div>

    <div class="map-container fr-m-auto">
      <img
        class="width-100"
        src={ofsMap}
        alt="" />
    </div>
  </div>
</div>

<style lang="postcss">
  .map-container {
    max-width: 600px;
  }
</style>

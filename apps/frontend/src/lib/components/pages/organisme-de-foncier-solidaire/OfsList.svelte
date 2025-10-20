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
  <div class="wrapper">
    <TitleWithMascotte
      title="Liste des OFS"
      mascotte={MascotteShowing}
      reversed />

    <p class="description">
      Voici la <b>
        liste des organismes de foncier solidaire (OFS) agréés en France
      </b>
      , classés par région puis par ordre alphabétique. Certains organismes de foncier
      solidaire (OFS) ont un lien qui redirige vers leur site web.
    </p>

    <div class="legend border-radius-sm">
      <p class="fr-text--lg fr-text--bold fr-mb-0">Légende:</p>
      <ul class="fr-mb-4w">
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
          <span class="fr-text--sm fr-text--bold text-color-yellow-tournesol">
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
          <span class="fr-text--sm fr-text--bold text-color-purple-glycine">
            qui a obtenu l'agrément mais ne propose pas encore de logement en
            bail réel solidaire (BRS) à vendre.
          </span>
        </li>
      </ul>
    </div>

    <div class="separator fr-mb-4w"></div>

    <ul class="regions-list">
      {#each regions as region}
        <li class="region-item">
          <Badge
            accent="green-menthe"
            uppercase={false}>
            <span class="fr-icon fr-icon--sm fr-icon-road-map-line"></span>
            <span class="fr-pl-1w">{region.name}</span>
          </Badge>

          <ul class="ofs-list">
            {#each region.ofss as ofs}
              <li>
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

    <div class="map-container">
      <img
        src={ofsMap}
        alt="" />
    </div>
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

  .legend {
    padding: 1rem;
    border-radius: var(--border-radius-sm);
    border: 2px solid var(--border-default-blue-france);
    margin-bottom: 2rem;

    ul {
      margin-bottom: 0 !important;
    }

    .text-color-purple-glycine {
      color: var(--text-label-purple-glycine);
    }

    .text-color-yellow-tournesol {
      color: var(--text-label-yellow-tournesol);
    }
  }

  .regions-list,
  .ofs-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .region-item {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: var(--border-radius-sm);
    padding: 1rem;
    border: 1px solid var(--border-default-grey);
    box-shadow: 0 6px 12px rgba(134, 144, 162, 0.3);

    @media (--xs-viewport) {
      padding: 1.5rem;
    }
  }

  .ofs-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 0.5rem;

    li {
      padding-bottom: 0;
    }
  }

  .map-container {
    max-width: 600px;
    margin: 0 auto;

    img {
      width: 100%;
    }
  }
</style>

<script lang="ts">
  import { eligibilityData } from '$lib/utils/constants';
  import { formatEuro } from '$lib/utils/formatters';

  import ShadowedBox from '$components/common/ShadowedBox.svelte';
  import Tooltip from '$components/common/Tooltip.svelte';

  type Props = {
    hidePath?: boolean;
  };

  const { hidePath = false }: Props = $props();
</script>

<ShadowedBox {hidePath}>
  <h3 class="fr-h4 heading !text-blue-primary">
    Les plafonds de ressources d'éligibilité au Bail Réel Solidaire.
  </h3>
  <p class="fr-mb-0">
    Les plafonds en vigueur depuis janvier 2026 sont définis à partir de votre
    catégorie de ménage et la zone de votre futur bien. Elle correspond à la
    tension immobilière, du plus tendu où les prix sont les plus haut, Abis, au
    moins tendu, C.
  </p>
  <p>
    <a
      class="fr-link fr-link--icon-right"
      target="_blank"
      rel="noopener"
      href="https://www.service-public.fr/simulateur/calcul/zonage-abc">
      Connaître ma zone
    </a>
  </p>

  <p class="fr-mb-0">
    Les revenus fiscaux de référence* du ménage ne doivent pas dépasser les
    plafonds de ressources ci-dessous :
  </p>
  <p>
    <a
      href="https://drive.google.com/file/d/1mJBo1cj9-idRRmewzR3-cKn87JZ76-A7/view?usp=sharing"
      class="fr-link fr-link--icon-right"
      target="_blank"
      rel="noopener">
      Où trouver mon revenus fiscal de référence
    </a>
  </p>

  <p>A quelle catégorie de ménage appartenez-vous ?</p>

  {@render data()}

  <div class="fr-pt-4w">
    <a
      href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000437021/2025-02-12/"
      class="fr-link"
      target="_blank"
      rel="noopener">
      Textes de référence
    </a>
  </div>
</ShadowedBox>

{#snippet data()}
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
{/snippet}

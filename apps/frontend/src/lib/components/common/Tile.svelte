<script lang="ts">
  import { onMount } from 'svelte';

  import '@gouvfr/dsfr/dist/component/link/link.min.css';
  import '@gouvfr/dsfr/dist/component/button/button.min.css';
  import '@gouvfr/dsfr/dist/component/tile/tile.min.css';

  import { pictograms } from '$lib/utils/pictograms';
  import Pictogram from '$components/common/Pictogram.svelte';

  type Props = {
    title?: string;
    description?: string;
    detail?: string;
    badge?: string;
    pictogram?: keyof typeof pictograms;
  };

  const { title, description, detail, badge, pictogram }: Props = $props();
</script>

<div class="fr-tile">
  <div class="fr-tile__body">
    <div class="fr-tile__content">
      {#if title}
        <h3 class="fr-tile__title">
          {title}
        </h3>
      {/if}
      {#if description}
        <p class="fr-tile__desc">{description}</p>
      {/if}
      {#if detail}
        <p class="fr-tile__detail">{detail}</p>
      {/if}
      {#if badge}
        <p class="fr-badge fr-badge--purple-glycine">{badge}</p>
      {/if}
    </div>
  </div>
  {#if pictogram}
    <div class="fr-tile__header">
      <div class="fr-tile__pictogram">
        <Pictogram {pictogram} />
      </div>
    </div>
  {/if}
</div>

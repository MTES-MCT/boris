<script lang="ts">
  import '@gouvfr/dsfr/dist/component/link/link.min.css';
  import '@gouvfr/dsfr/dist/component/button/button.min.css';
  import '@gouvfr/dsfr/dist/component/tile/tile.min.css';

  import { pictograms } from '$lib/utils/pictograms';
  import Pictogram from '$components/common/Pictogram.svelte';
  import type { Snippet } from 'svelte';

  type Props = {
    title: string;
    description?: string;
    detail?: string;
    badge?: string;
    pictogram?: keyof typeof pictograms;
    horizontal?: boolean;
    enlarge?: boolean;
    href?: string;
    children?: Snippet;
  };

  const {
    title,
    description,
    detail,
    badge,
    pictogram,
    horizontal,
    enlarge,
    href,
    children,
  }: Props = $props();
</script>

<div
  class="fr-tile h-full"
  class:fr-tile--horizontal={horizontal}
  class:fr-enlarge-link={enlarge}>
  <div class="fr-tile__body">
    <div class="fr-tile__content">
      <p class="fr-tile__title">
        {#if href}
          <a {href}>
            {title}
          </a>
        {:else}
          {title}
        {/if}
      </p>
      {#if children}
        {@render children()}
      {:else}
        {#if description}
          <p class="fr-tile__desc">{description}</p>
        {/if}
        {#if detail}
          <p class="fr-tile__detail">{detail}</p>
        {/if}
        {#if badge}
          <p class="fr-badge fr-badge--purple-glycine">{badge}</p>
        {/if}
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

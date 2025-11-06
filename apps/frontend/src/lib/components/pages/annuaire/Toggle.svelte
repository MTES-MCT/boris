<script lang="ts">
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import '@gouvfr/dsfr/dist/utility/icons/icons-map/icons-map.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons-editor/icons-editor.min.css';

  const handleToggle = () => {
    if (annuaireManager.viewType === 'list') {
      annuaireManager.viewType = 'map';
    } else {
      annuaireManager.viewType = 'list';
    }
  };
</script>

<div class="flex p-[2px] w-full h-[2.5rem] bg-(--input-background-color)">
  {@render button('Carte', 'map', 'fr-icon-road-map-line')}
  {@render button('Liste', 'list', 'fr-icon-list-unordered')}
</div>

{#snippet button(label: string, viewType: 'list' | 'map', icon: string)}
  <button
    class="fr-text--sm flex gap-1 justify-center items-center h-full flex-1"
    class:!bg-blue-primary={annuaireManager.viewType === viewType}
    class:!text-white={annuaireManager.viewType === viewType}
    onclick={handleToggle}>
    <span
      class={`${icon} fr-icon--sm`}
      aria-hidden="true">
    </span>
    <b>{label}</b>
  </button>
{/snippet}

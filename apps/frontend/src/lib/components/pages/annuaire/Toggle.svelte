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

<div class="toggle flex width-100 fr-p-0-5v">
  {@render button('Carte', 'map', 'fr-icon-road-map-line')}
  {@render button('Liste', 'list', 'fr-icon-list-unordered')}
</div>

{#snippet button(label: string, viewType: 'list' | 'map', icon: string)}
  <button
    class="fr-text--sm height-100 flex flex-1 gap-1v justify-center align-center"
    class:color-white={annuaireManager.viewType === viewType}
    class:background-color-blue-primary={annuaireManager.viewType === viewType}
    class:hover-color-white={annuaireManager.viewType === viewType}
    class:hover-background-color-blue-primary={annuaireManager.viewType ===
      viewType}
    onclick={handleToggle}>
    <div class="icon">
      <span
        class={`fr-icon ${icon} fr-icon--sm`}
        aria-hidden="true">
      </span>
    </div>
    <b>{label}</b>
  </button>
{/snippet}

<style lang="postcss">
  .toggle {
    height: 2.5rem;
    background-color: var(--input-background-color, --background-contrast-grey);
  }
</style>

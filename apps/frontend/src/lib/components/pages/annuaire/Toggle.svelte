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

<div class="toggle">
  {@render button('Carte', 'map', 'fr-icon-road-map-line')}
  {@render button('Liste', 'list', 'fr-icon-list-unordered')}
</div>

{#snippet button(label: string, viewType: 'list' | 'map', icon: string)}
  <button
    class="fr-text--sm"
    class:selected={annuaireManager.viewType === viewType}
    onclick={handleToggle}>
    <div class="icon">
      <span
        class={icon}
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
    width: 100%;
    display: flex;
    padding: 2px;
  }

  button {
    height: 100%;
    flex: 1;
    gap: var(--1v);
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      &::before {
        --icon-size: 1rem;
      }
    }

    &.selected {
      background-color: var(--color-blue-primary);
      color: white;
    }
  }
</style>

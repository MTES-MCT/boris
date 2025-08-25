<script lang="ts">
  import '@gouvfr/dsfr/dist/utility/icons/icons-map/icons-map.min.css';
  import { debounce } from '$lib/utils/helpers';

  import Input from '$components/common/Input.svelte';
  import { autocomplete } from '$lib/api/ign';
  import type { AutocompleteSuggestion } from '$lib/utils/ign-types';

  let value = $state('');
  let suggestions = $state<AutocompleteSuggestion[] | null>(null);
  let isTooShort = $derived(value.length > 0 && value.length < 3);
  let isTooLong = $derived(value.length > 200);

  const handleChange = async (event: Event) => {
    value = (event.target as HTMLInputElement).value;
    const hasCorrectLength = value.length >= 3 && value.length <= 200;

    if (hasCorrectLength) {
      const { results } = await autocomplete(value);

      suggestions = results;
    } else {
      suggestions = null;
    }
  };
</script>

<div class="autocomplete">
  <Input
    {value}
    icon="map-pin-2-line"
    placeholder="Saisir le lieu ou le code postal"
    onChange={debounce(handleChange, 300)} />

  <span></span>

  {#if isTooShort}
    <div class="suggestions">
      <ul>
        <li>
          <b>Veuillez saisir au moins 3 caractères.</b>
        </li>
      </ul>
    </div>
  {:else if isTooLong}
    <div class="suggestions">
      <ul>
        <li>
          <b>Veuillez saisir 200 caractères au maximum.</b>
        </li>
      </ul>
    </div>
  {:else if suggestions && suggestions.length > 0}
    <div class="suggestions">
      <ul>
        {#each suggestions as suggestion}
          {@render autocompleteSuggestion(suggestion)}
        {/each}
      </ul>
    </div>
  {:else if suggestions && suggestions.length === 0 && value.length > 0}
    <div class="suggestions">
      <ul>
        <li>
          <b>Aucun lieu correspondant n'a été trouvé.</b>
        </li>
      </ul>
    </div>
  {/if}
</div>

{#snippet autocompleteSuggestion(suggestion: AutocompleteSuggestion)}
  <li>
    {suggestion.fulltext}
    {#if suggestion.poiType}
      {#each suggestion.poiType as poiType}
        {#if poiType === 'région' || poiType === 'département' || poiType === 'commune'}
          ({poiType})
        {/if}
      {/each}
    {/if}
  </li>
{/snippet}

<style lang="postcss">
  .autocomplete {
    position: relative;
  }

  .suggestions {
    position: absolute;
    z-index: 1000;
    left: 0;
    top: 100%;
    width: 100%;
    background-color: white;
    padding: var(--1w);
    box-shadow: 0 6px 12px rgba(134, 144, 162, 0.3);
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--1w);

    li {
      cursor: pointer;
    }
  }
</style>

<script lang="ts">
  import '@gouvfr/dsfr/dist/utility/icons/icons-map/icons-map.min.css';

  import { clickOutside, debounce } from '$lib/utils/helpers';
  import Input from '$components/common/Input.svelte';
  import { autocomplete } from '$lib/api/ign';
  import type { AutocompleteSuggestion } from '$lib/utils/definitions';
  import { nanoid } from 'nanoid';

  type Props = {
    value: string;
    label: string;
    placeholder: string;
    excludedPois: AutocompleteSuggestion['poiType'];
    onSelect: (suggestion: AutocompleteSuggestion) => void;
  };

  let {
    value = $bindable(),
    label,
    placeholder,
    excludedPois,
    onSelect,
  }: Props = $props();

  let suggestions = $state<AutocompleteSuggestion[] | null>(null);
  let isLoading = $state<boolean>(false);
  let isListExpanded = $state<boolean>(false);
  let isTooShort = $derived(value.length > 0 && value.length < 3);
  let isTooLong = $derived(value.length > 200);
  const inputId = nanoid(10);
  const suggestionsId = nanoid(10);
  let focusedSuggestionId = $state<string | null>(null);
  let hasCorrectLength = $derived(value.length >= 3 && value.length <= 200);

  const debouncedSearch = debounce(async () => {
    if (hasCorrectLength) {
      const { results } = await autocomplete(value, '10');

      suggestions = results
        .filter(
          (result) =>
            !excludedPois.some((excludedPoi) =>
              result.poiType?.includes(excludedPoi),
            ),
        )
        .map((result, index) => ({
          ...result,
          id: `suggestion-${index}`,
        }))
        .slice(0, 5);

      isListExpanded = true;

      if (suggestions.length > 0) {
        focusedSuggestionId = suggestions[0]?.id as string;
      }

      isLoading = false;
    } else {
      suggestions = null;
    }
  }, 300);

  const handleChange = async (event: Event) => {
    value = (event.target as HTMLInputElement).value;
    isListExpanded = value.length > 0;
    isLoading = true;

    debouncedSearch();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    const { key } = event;

    if (key === 'ArrowDown') {
      let nextSuggestionIndex: number;

      const currentSuggestionIndex = suggestions?.findIndex(
        (suggestion) => suggestion.id === focusedSuggestionId,
      );

      if (
        typeof currentSuggestionIndex === 'number' &&
        suggestions &&
        currentSuggestionIndex < suggestions?.length - 1
      ) {
        nextSuggestionIndex = currentSuggestionIndex + 1;
        focusedSuggestionId = suggestions[nextSuggestionIndex].id as string;
      }
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      let previousSuggestionIndex: number;

      const currentSuggestionIndex = suggestions?.findIndex(
        (suggestion) => suggestion.id === focusedSuggestionId,
      );

      if (
        typeof currentSuggestionIndex === 'number' &&
        suggestions &&
        currentSuggestionIndex > 0
      ) {
        previousSuggestionIndex = currentSuggestionIndex - 1;
        focusedSuggestionId = suggestions[previousSuggestionIndex].id as string;
      }
    } else if (key === 'Escape') {
      isListExpanded = false;
    } else if (key === 'Enter') {
      if (hasCorrectLength) {
        handleSelect();
      }
    }
  };

  const handleClickOuside = () => {
    isListExpanded = false;
  };

  const handleSelect = (id?: string) => {
    const selectedSuggestion = suggestions?.find((suggestion) => {
      if (id) {
        return suggestion.id === id;
      } else {
        return suggestion.id === focusedSuggestionId;
      }
    });

    if (selectedSuggestion) {
      onSelect(selectedSuggestion);
      isListExpanded = false;
    }
  };
</script>

<div
  class="autocomplete"
  use:clickOutside
  onclickoutside={handleClickOuside}>
  <Input
    id={inputId}
    {value}
    {label}
    {placeholder}
    icon="map-pin-2-line"
    role="combobox"
    autocomplete="off"
    ariaAttributes={{
      'aria-autocomplete': 'list',
      'aria-expanded': isListExpanded,
      'aria-controls': suggestionsId,
      'aria-activedescendant': focusedSuggestionId,
    }}
    forceNoMarginBottom
    onChange={handleChange}
    onKeydown={handleKeydown} />

  {#if isListExpanded}
    <div
      class="suggestions"
      id={suggestionsId}>
      <ul
        aria-labelledby={inputId}
        role="listbox">
        {#if isTooShort}
          <li>
            <b>Veuillez saisir au moins 3 caractères.</b>
          </li>
        {:else if isTooLong}
          <li>
            <b>Veuillez saisir 200 caractères au maximum.</b>
          </li>
        {:else if isLoading}
          <li>
            <i>Recherche...</i>
          </li>
        {:else if suggestions && suggestions.length > 0}
          {#each suggestions as suggestion, index}
            {@render autocompleteSuggestion(suggestion, index)}
          {/each}
        {:else if suggestions && suggestions.length === 0 && value.length > 0}
          <li>
            <b>Aucun lieu correspondant n'a été trouvé.</b>
          </li>
        {/if}
      </ul>
    </div>
  {/if}
</div>

{#snippet autocompleteSuggestion(
  suggestion: AutocompleteSuggestion,
  index: number,
)}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <li
    id={suggestion.id}
    role="option"
    aria-selected={suggestion.id === focusedSuggestionId}
    aria-setsize={suggestions?.length}
    aria-posinset={index}
    onclick={() => handleSelect(suggestion.id)}>
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
    z-index: 9999999;
    left: 0;
    top: calc(100% + var(--1w));
    width: 100%;
    background-color: white;
    box-shadow: 0 6px 12px rgba(134, 144, 162, 0.3);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      padding: var(--1w) var(--2w);
      cursor: pointer;

      &[aria-selected='true'],
      &:hover {
        background-color: var(--background-default-grey-active);
      }
    }
  }
</style>

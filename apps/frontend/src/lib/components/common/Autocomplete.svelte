<script lang="ts">
  import '@gouvfr/dsfr/dist/utility/icons/icons-map/icons-map.min.css';

  import {
    clickOutside,
    debounce,
    getGeocodedResponseLabel,
  } from '$lib/utils/helpers';
  import Input from '$components/common/Input.svelte';
  import { autocomplete } from '$lib/api/ign';
  import type { GeocodedResponse } from '$lib/utils/definitions';
  import { nanoid } from 'nanoid';

  type Props = {
    value: string;
    label: string;
    placeholder: string;
    error?: string;
    dataTestId?: string;
    errorDataTestId?: string;
    onSelect: (suggestion: GeocodedResponse['properties']) => void;
  };

  let {
    value = $bindable(),
    label,
    placeholder,
    error,
    onSelect,
    dataTestId,
    errorDataTestId,
  }: Props = $props();

  let suggestions = $state<GeocodedResponse['properties'][] | null>(null);
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
      const results = await autocomplete(value, '5');

      suggestions = results
        ?.map((result) => ({
          ...result.properties,
          x: result?.geometry?.coordinates?.[0],
          y: result?.geometry?.coordinates?.[1],
          id: `suggestion-${nanoid(15)}`,
        }))
        ?.slice(0, 5);

      isListExpanded = true;

      if (suggestions?.length > 0) {
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
        (suggestion) => suggestion?.id === focusedSuggestionId,
      );

      if (
        typeof currentSuggestionIndex === 'number' &&
        suggestions &&
        currentSuggestionIndex < suggestions?.length - 1
      ) {
        nextSuggestionIndex = currentSuggestionIndex + 1;
        focusedSuggestionId = suggestions[nextSuggestionIndex]?.id as string;
      }
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      let previousSuggestionIndex: number;

      const currentSuggestionIndex = suggestions?.findIndex(
        (suggestion) => suggestion?.id === focusedSuggestionId,
      );

      if (
        typeof currentSuggestionIndex === 'number' &&
        suggestions &&
        currentSuggestionIndex > 0
      ) {
        previousSuggestionIndex = currentSuggestionIndex - 1;
        focusedSuggestionId = suggestions[previousSuggestionIndex]
          ?.id as string;
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
        return suggestion?.id === id;
      } else {
        return suggestion?.id === focusedSuggestionId;
      }
    });

    if (selectedSuggestion) {
      onSelect(selectedSuggestion);
      isListExpanded = false;
    }
  };
</script>

<div
  class="relative"
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
    {error}
    ariaAttributes={{
      'aria-autocomplete': 'list',
      'aria-expanded': isListExpanded,
      'aria-controls': suggestionsId,
      'aria-activedescendant': focusedSuggestionId,
    }}
    forceNoMarginBottom
    onChange={handleChange}
    onKeydown={handleKeydown}
    {dataTestId}
    {errorDataTestId} />

  {#if isListExpanded}
    <div
      class="absolute z-1001 left-0 top-full w-full bg-white shadow-lg/20"
      id={suggestionsId}>
      <ul
        class="!list-none fr-m-0 fr-p-0"
        aria-labelledby={inputId}
        role="listbox">
        {#if isTooShort}
          <li class="fr-py-1w fr-px-2w">
            <b>Veuillez saisir au moins 3 caractères.</b>
          </li>
        {:else if isTooLong}
          <li class="fr-py-1w fr-px-2w">
            <b>Veuillez saisir 200 caractères au maximum.</b>
          </li>
        {:else if isLoading}
          <li class="fr-py-1w fr-px-2w">
            <i>Recherche...</i>
          </li>
        {:else if suggestions && suggestions.length > 0}
          {#each suggestions as suggestion, index}
            {@render autocompleteSuggestion(suggestion, index)}
          {/each}
        {:else if suggestions && suggestions.length === 0 && value.length > 0}
          <li class="fr-py-1w fr-px-2w">
            <b>Aucun lieu correspondant n'a été trouvé.</b>
          </li>
        {/if}
      </ul>
    </div>
  {/if}
</div>

{#snippet autocompleteSuggestion(
  suggestion: GeocodedResponse['properties'],
  index: number,
)}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <li
    class="fr-py-1w fr-px-2w cursor-pointer"
    class:bg-default-gray-active={suggestion?.id === focusedSuggestionId}
    id={suggestion?.id}
    role="option"
    aria-selected={suggestion?.id === focusedSuggestionId}
    aria-setsize={suggestions?.length}
    aria-posinset={index}
    onclick={() => handleSelect(suggestion?.id)}
    data-testid={`suggestion-${index}-data-test-id`}>
    {getGeocodedResponseLabel(suggestion)}
  </li>
{/snippet}

<script lang="ts">
  import '@gouvfr/dsfr/dist/component/form/form.min.css';
  import '@gouvfr/dsfr/dist/component/button/button.min.css';
  import '@gouvfr/dsfr/dist/component/input/input.min.css';

  import { nanoid } from 'nanoid';
  import type { AriaAttributes, AriaRole, FullAutoFill } from 'svelte/elements';

  type Props = {
    id?: string;
    placeholder?: string;
    type?:
      | 'date'
      | 'email'
      | 'password'
      | 'number'
      | 'search'
      | 'tel'
      | 'text'
      | 'url'
      | 'range';
    value?: string;
    label?: string;
    icon?: string;
    role?: AriaRole;
    min?: number;
    max?: number;
    step?: number;
    ariaAttributes?: AriaAttributes;
    ariaAutocomplete?: 'none' | 'list' | 'inline' | 'both' | null;
    autocomplete?: FullAutoFill;
    forceNoMarginBottom?: boolean;
    onChange?: (event: Event) => void;
    onKeydown?: (event: KeyboardEvent) => void;
  };

  const {
    id = nanoid(10),
    placeholder = '',
    type = 'text',
    value,
    label = '',
    icon = '',
    role = '',
    ariaAttributes,
    autocomplete,
    min,
    max,
    step,
    forceNoMarginBottom = false,
    onChange,
    onKeydown,
  }: Props = $props();
</script>

<div
  class="fr-input-group"
  class:no-margin-bottom={forceNoMarginBottom}
  id={`${id}-group`}>
  {#if label}
    <label
      class="fr-label"
      for={id}>
      {label}
    </label>
  {/if}
  {#if icon}
    <div class={`fr-input-wrap fr-icon-${icon}`}>
      {@render input()}
    </div>
  {:else}
    {@render input()}
  {/if}
  <div
    class="fr-messages-group"
    id={`${id}-messages`}
    aria-live="polite">
  </div>
</div>

{#snippet input()}
  <input
    class="fr-input"
    aria-describedby={`${id}-messages`}
    {placeholder}
    {type}
    {value}
    {id}
    {role}
    {...ariaAttributes}
    {autocomplete}
    {min}
    {max}
    {step}
    oninput={onChange}
    onkeydown={onKeydown} />
{/snippet}

<style lang="postcss">
  .no-margin-bottom {
    margin-bottom: 0 !important;
  }

  input {
    background-color: var(
      --input-background-color,
      var(--background-contrast-grey)
    );
  }

  input {
    background-color: var(--input-background-color, --background-contrast-grey);
  }
</style>

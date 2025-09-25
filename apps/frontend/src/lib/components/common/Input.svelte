<script lang="ts">
  import '@gouvfr/dsfr/dist/component/form/form.min.css';
  import '@gouvfr/dsfr/dist/component/button/button.min.css';
  import '@gouvfr/dsfr/dist/component/input/input.min.css';

  import { nanoid } from 'nanoid';
  import type { AriaAttributes, AriaRole, FullAutoFill } from 'svelte/elements';
  import Tooltip from './Tooltip.svelte';

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
      | 'range'
      | 'radio';
    value?: string | number;
    label?: string;
    labelTooltip?: string;
    required?: boolean;
    icon?: string;
    role?: AriaRole;
    min?: number;
    max?: number;
    step?: number;
    ariaAttributes?: AriaAttributes;
    ariaAutocomplete?: 'none' | 'list' | 'inline' | 'both' | null;
    autocomplete?: FullAutoFill;
    forceNoMarginBottom?: boolean;
    error?: string;
    onChange?: (event: Event) => void;
    onKeydown?: (event: KeyboardEvent) => void;
  };

  const {
    id = nanoid(10),
    placeholder = '',
    type = 'text',
    value,
    label = '',
    labelTooltip = '',
    required = false,
    icon = '',
    role = '',
    ariaAttributes,
    autocomplete,
    min,
    max,
    step,
    forceNoMarginBottom = false,
    error,
    onChange,
    onKeydown,
  }: Props = $props();
</script>

<div
  class="fr-input-group"
  class:fr-input-group--error={error}
  class:no-margin-bottom={forceNoMarginBottom}
  id={`${id}-group`}>
  {#if label}
    <label
      class="fr-label"
      for={id}>
      <b>{label} {required ? '*' : ''}</b>
      {#if labelTooltip}
        <Tooltip>
          <div class="fr-p-2w">
            {@html labelTooltip}
          </div>
        </Tooltip>
      {/if}
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
    {placeholder}
    {type}
    {value}
    {required}
    {id}
    {role}
    {...{
      ...ariaAttributes,
      'aria-describedby': `${id}-messages`,
    }}
    {autocomplete}
    {min}
    {max}
    {step}
    oninput={onChange}
    onkeydown={onKeydown} />
  <div
    class="fr-messages-group"
    id={`${id}-messages`}
    aria-live="polite">
    {#if error}
      <p
        class="fr-message fr-message--error"
        id={`${id}-message-error`}>
        {error}
      </p>
    {/if}
  </div>
{/snippet}

<style lang="postcss">
  .no-margin-bottom {
    margin-bottom: 0 !important;
  }

  label {
    display: inline-flex;
    align-items: flex-end;
    gap: var(--1v);
  }

  input {
    background-color: var(
      --input-background-color,
      var(--background-contrast-grey)
    );
  }
</style>

<script lang="ts">
  import '@gouvfr/dsfr/dist/component/form/form.min.css';
  import '@gouvfr/dsfr/dist/component/button/button.min.css';
  import '@gouvfr/dsfr/dist/component/input/input.min.css';

  import { nanoid } from 'nanoid';
  import type { AriaAttributes, AriaRole, FullAutoFill } from 'svelte/elements';
  import Tooltip from './Tooltip.svelte';
  import type { boolean } from 'zod';

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
    currency?: boolean;
    value?: string | number;
    label?: string;
    rawLabel?: boolean;
    hint?: string;
    labelTooltip?: string;
    required?: boolean;
    skipHTML5Required?: boolean;
    icon?: string;
    role?: AriaRole;
    min?: number | string;
    max?: number | string;
    maxlength?: number;
    step?: number;
    ariaAttributes?: AriaAttributes;
    ariaAutocomplete?: 'none' | 'list' | 'inline' | 'both' | null;
    autocomplete?: FullAutoFill;
    forceNoMarginBottom?: boolean;
    error?: string;
    errorDataTestId?: string;
    dataTestId?: string;
    disabled?: boolean;
    onChange?: (event: Event) => void;
    onKeydown?: (event: KeyboardEvent) => void;
    onBlur?: (event: Event) => void;
  };

  let {
    id = nanoid(10),
    placeholder = '',
    type = 'text',
    currency = false,
    value,
    label = '',
    rawLabel = false,
    hint,
    labelTooltip = '',
    required = false,
    skipHTML5Required = false,
    icon = '',
    role = '',
    ariaAttributes,
    autocomplete,
    min,
    max,
    maxlength,
    step,
    forceNoMarginBottom = false,
    error,
    dataTestId,
    errorDataTestId = 'input-error-message',
    disabled,
    onChange,
    onKeydown,
    onBlur,
  }: Props = $props();
</script>

<div
  class="fr-input-group"
  class:fr-input-group--disabled={disabled}
  class:fr-input-group--error={error}
  class:fr-mb-0={forceNoMarginBottom}
  id={`${id}-group`}>
  {#if label}
    <label
      class="fr-label"
      for={id}>
      <div class="inline-flex items-end gap-1">
        <span>
          {#if rawLabel}
            {@html label}
          {:else}
            {label}
          {/if}
          {required ? '*' : ''}
        </span>
        {#if labelTooltip}
          <Tooltip>
            <div class="fr-p-2w">
              {@html labelTooltip}
            </div>
          </Tooltip>
        {/if}
      </div>
      {#if hint}
        <span class="fr-hint-text">{hint}</span>
      {/if}
    </label>
  {/if}
  {#if icon}
    <div class={`fr-input-wrap fr-icon-${icon} before:!bottom-auto`}>
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
    class="fr-input !bg-[var(--input-background-color,var(--background-contrast-grey))]"
    {placeholder}
    {type}
    {value}
    required={required && !skipHTML5Required}
    {disabled}
    {id}
    {role}
    {...{
      ...ariaAttributes,
      'aria-describedby': `${id}-messages`,
    }}
    {autocomplete}
    {min}
    {max}
    {maxlength}
    {step}
    data-testid={dataTestId}
    oninput={(e) => {
      if (currency) {
        let { value } = e.target as HTMLInputElement;
        const lastCharacter = value[value.length - 1];

        if (lastCharacter !== ' ' && isNaN(Number(lastCharacter))) {
          value = value.substring(0, value.length - 1);
          (e.target as HTMLInputElement).value = value;
        }
      }

      onChange?.(e);
    }}
    onkeydown={onKeydown}
    onblur={onBlur} />
  <div
    class="fr-messages-group"
    id={`${id}-messages`}
    aria-live="polite">
    {#if error}
      <p
        class="fr-message fr-message--error"
        data-testid={errorDataTestId}
        id={`${id}-message-error`}>
        {error}
      </p>
    {/if}
  </div>
{/snippet}

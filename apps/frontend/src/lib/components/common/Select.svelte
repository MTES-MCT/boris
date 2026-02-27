<script lang="ts">
  import '@gouvfr/dsfr/dist/component/form/form.min.css';
  import '@gouvfr/dsfr/dist/component/select/select.min.css';

  import { nanoid } from 'nanoid';

  type Props = {
    id?: string;
    label?: string;
    options: { value: unknown; label: string; selected: boolean }[];
    disabled?: boolean;
    error?: string;
    required?: boolean;
    errorDataTestId?: string;
    onChange?: (event: Event) => void;
  };

  const {
    id = nanoid(10),
    label,
    options,
    disabled,
    onChange,
    error,
    required,
    errorDataTestId = 'select-error-message',
  }: Props = $props();
</script>

<div
  class="fr-select-group"
  class:fr-select-group--error={error}>
  <label
    class="fr-label"
    for={id}>
    {label}
    {required ? '*' : ''}
  </label>
  <select
    class="fr-select !bg-[var(--input-background-color,var(--background-contrast-grey))]"
    {disabled}
    aria-describedby={`${id}-messages`}
    {id}
    name={id}
    onchange={onChange}>
    {#each options as { value, selected, label }}
      <option
        {value}
        {selected}>
        {label}
      </option>
    {/each}
  </select>
  {#if error}
    <div
      class="fr-messages-group"
      id={`${id}-messages`}
      aria-live="polite">
      <p
        class="fr-message fr-message--error"
        data-testid={errorDataTestId}
        id={`${id}-message-error`}>
        {error}
      </p>
    </div>
  {/if}
</div>

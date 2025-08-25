<script lang="ts">
  import '@gouvfr/dsfr/dist/component/form/form.min.css';
  import '@gouvfr/dsfr/dist/component/button/button.min.css';
  import '@gouvfr/dsfr/dist/component/input/input.min.css';

  import { nanoid } from 'nanoid';

  type Props = {
    placeholder?: string;
    type?:
      | 'date'
      | 'email'
      | 'password'
      | 'number'
      | 'search'
      | 'tel'
      | 'text'
      | 'url';
    value?: string;
    label?: string;
    icon?: string;
    onChange?: (event: Event) => void;
  };

  const id = nanoid(10);

  const {
    placeholder = '',
    type = 'text',
    value,
    label = '',
    icon = '',
    onChange,
  }: Props = $props();
</script>

<div
  class="fr-input-group"
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
      <input
        class="fr-input"
        aria-describedby={`${id}-messages`}
        {placeholder}
        {type}
        {value}
        {id}
        oninput={onChange} />
    </div>
  {:else}
    <input
      class="fr-input"
      aria-describedby={`${id}-messages`}
      {placeholder}
      {type}
      {value}
      {id}
      oninput={onChange} />
  {/if}
  <div
    class="fr-messages-group"
    id={`${id}-messages`}
    aria-live="polite">
  </div>
</div>

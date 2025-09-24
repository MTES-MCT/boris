<script lang="ts">
  import '@gouvfr/dsfr/dist/component/radio/radio.min.css';

  import { nanoid } from 'nanoid';

  type Props = {
    id?: string;
    name?: string;
    label: string;
    disabled?: boolean;
    hint?: string;
    checked?: boolean;
    oninput: () => void;
  };

  const {
    id = nanoid(10),
    name = 'radio',
    label,
    disabled = false,
    hint,
    checked = false,
    oninput,
  }: Props = $props();
</script>

<div class="fr-radio-group fr-mb-1v">
  <input
    type="radio"
    {id}
    {name}
    {disabled}
    {checked}
    {oninput} />
  <label
    class="fr-label"
    for={id}>
    {label}
    {#if hint}
      <span class="fr-hint-text">Hello</span>
    {/if}
  </label>
</div>

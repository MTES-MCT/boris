<script lang="ts">
  import '@gouvfr/dsfr/dist/component/form/form.min.css';
  import '@gouvfr/dsfr/dist/component/select/select.min.css';

  import { nanoid } from 'nanoid';

  type Props = {
    id?: string;
    label?: string;
    options: { value: unknown; label: string; selected: boolean }[];
    onChange?: (event: Event) => void;
  };

  const { id = nanoid(10), label, options, onChange }: Props = $props();
</script>

<label
  class="fr-label"
  for={id}>
  {label}
</label>
<select
  class="fr-select"
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

<style lang="postcss">
  select {
    background-color: var(--input-background-color, --background-contrast-grey);
  }
</style>

<script lang="ts">
  import '@gouvfr/dsfr/dist/component/form/form.min.css';
  import '@gouvfr/dsfr/dist/component/radio/radio.min.css';

  import { nanoid } from 'nanoid';
  import type { Snippet } from 'svelte';

  import Tooltip from './Tooltip.svelte';

  type Props = {
    legend: string;
    legendTooltip?: string;
    children: Snippet;
    id?: string;
    error?: string;
  };

  const {
    legend,
    legendTooltip,
    children,
    id = nanoid(10),
    error,
  }: Props = $props();
</script>

<fieldset
  class="fr-fieldset"
  class:fr-fieldset--error={error}
  id={`${id}`}
  aria-labelledby={`${id}-legend ${id}-messages`}>
  <legend
    class="fr-fieldset__legend--regular fr-fieldset__legend"
    id={`${id}-legend`}>
    <span><b>{legend}</b></span>
    {#if legendTooltip}
      <Tooltip>
        {@html legendTooltip}
      </Tooltip>
    {/if}
  </legend>
  {@render children()}

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
</fieldset>

<style lang="postcss">
  .fr-fieldset__legend {
    display: flex;
    gap: 0.25rem;
  }
</style>

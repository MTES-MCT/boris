<script lang="ts">
  import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';

  type Props = {
    direction?: 'previous' | 'next';
    label: string;
    type?: HTMLButtonElement['type'];
    loading?: boolean;
    onClick?: () => void;
  };

  const {
    direction,
    label,
    type = 'button',
    loading = false,
    onClick,
  }: Props = $props();
</script>

<button
  class={`fr-btn flex !flex-col justify-center text-left !w-full sm:!w-auto ${direction}`}
  class:sm:!items-end={direction === 'previous'}
  class:sm:!items-start={direction === 'next'}
  class:fr-btn--secondary={direction === 'previous'}
  {type}
  onclick={onClick}
  disabled={loading}>
  <div class="flex gap-1 items-center">
    {#if direction === 'next'}
      <p>
        <b>Étape suivante</b>
      </p>
      <span
        class="fr-icon-arrow-right-line fr-icon--sm"
        aria-hidden="true">
      </span>
    {:else if direction === 'previous'}
      <span
        class="fr-icon-arrow-left-line fr-icon--sm"
        aria-hidden="true">
      </span>
      <p>
        <b>Étape précédente</b>
      </p>
    {:else}
      <span
        class="fr-icon-download-line fr-icon--sm"
        aria-hidden="true">
      </span>

      <p>
        <b>{label}</b>
      </p>
    {/if}
  </div>
  {#if direction}
    <p class="fr-text--xs">{label}</p>
  {/if}
</button>

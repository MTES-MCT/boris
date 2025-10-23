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
  class={`fr-btn ${direction}`}
  class:fr-btn--secondary={direction === 'previous'}
  {type}
  onclick={onClick}
  disabled={loading}>
  <div class="surtitle">
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

<style lang="postcss">
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    width: 100%;

    @media (--xs-viewport) {
      width: auto;

      &.previous {
        align-items: flex-end;
      }

      &.next {
        align-items: flex-start;
      }
    }
  }

  .surtitle {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  .fr-text--xs {
    line-height: 1rem !important;
  }
</style>

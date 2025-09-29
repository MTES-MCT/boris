<script lang="ts">
  import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';

  type Props = {
    direction: 'previous' | 'next';
    label: string;
    type?: HTMLButtonElement['type'];
    onClick?: () => void;
  };

  const { direction, label, type = 'button', onClick }: Props = $props();
</script>

<button
  class={`fr-btn ${direction}`}
  class:fr-btn--secondary={direction === 'previous'}
  {type}
  onclick={onClick}>
  <div class="surtitle">
    {#if direction === 'next'}
      <p>
        <b>Étape suivante</b>
      </p>
      <span
        class="fr-icon-arrow-right-line"
        aria-hidden="true">
      </span>
    {:else}
      <span
        class="fr-icon-arrow-left-line"
        aria-hidden="true">
      </span>
      <p>
        <b>Étape précédente</b>
      </p>
    {/if}
  </div>
  <p class="fr-text--xs">{label}</p>
</button>

<style lang="postcss">
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    width: 100%;

    @media (--xs-viewport) {
      width: 50%;

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

  .fr-icon-arrow-right-line:before,
  .fr-icon-arrow-left-line:before {
    --icon-size: 1rem;
  }

  .fr-text--xs {
    line-height: 1rem !important;
  }
</style>

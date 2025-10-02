<script lang="ts">
  import '@gouvfr/dsfr/dist/component/form/form.min.css';

  import type { Snippet } from 'svelte';

  type Props = {
    onSubmit: (e: SubmitEvent) => void;
    children: Snippet;
  };

  const { onSubmit, children }: Props = $props();
</script>

<div class="container background-gradient">
  <form
    autocomplete="off"
    onsubmit={onSubmit}>
    {@render children()}
  </form>
</div>

<style lang="postcss">
  .container {
    padding-inline: 1rem;
    padding-block: 1rem;
  }

  form {
    padding: 1rem !important;
    border-radius: var(--border-radius-lg);
    box-shadow: 0 6px 12px rgba(134, 144, 162, 0.3);
    border: solid 1px rgba(134, 144, 162, 0.1);
    background-color: white;
  }

  @media (--xs-viewport) {
    .container {
      padding-inline: 2rem;
      padding-block: 2rem;
    }

    form {
      padding: 2rem !important;
    }
  }

  @media (--md-viewport) {
    .container {
      padding-block: 8rem;
      width: calc(50% + 6rem);
      display: flex;
      align-items: center;
    }

    form {
      width: 41rem;
    }
  }
</style>

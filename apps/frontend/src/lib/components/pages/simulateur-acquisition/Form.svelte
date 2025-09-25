<script lang="ts">
  import '@gouvfr/dsfr/dist/component/form/form.min.css';

  import type { Snippet } from 'svelte';

  type Props = {
    onSubmit: (e: SubmitEvent) => void;
    children: Snippet;
  };

  const { onSubmit, children }: Props = $props();
</script>

<form
  class="fr-my-6w"
  autocomplete="off"
  onsubmit={onSubmit}>
  {@render children()}
</form>

<style lang="postcss">
  form {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    border-radius: var(--border-radius-lg);
    box-shadow: 0 6px 12px rgba(134, 144, 162, 0.3);
    border: solid 1px rgba(134, 144, 162, 0.1);
  }
</style>

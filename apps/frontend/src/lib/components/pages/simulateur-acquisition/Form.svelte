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
  class="fr-col-5"
  autocomplete="off"
  onsubmit={onSubmit}>
  {@render children()}
</form>

<style lang="postcss">
  form {
    padding: 2rem !important;
    border-radius: var(--border-radius-lg);
    box-shadow: 0 6px 12px rgba(134, 144, 162, 0.3);
    border: solid 1px rgba(134, 144, 162, 0.1);
  }
</style>

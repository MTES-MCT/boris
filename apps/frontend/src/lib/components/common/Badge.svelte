<script lang="ts">
  import '@gouvfr/dsfr/dist/component/badge/badge.min.css';

  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
    status?: 'success' | 'warning' | 'error' | 'info' | 'new';
    hideIcon?: boolean;
  };

  const { children, status, hideIcon = false }: Props = $props();
</script>

<p
  class={`fr-badge ${status ? `fr-badge--${status}` : ''}`}
  class:icon-hidden={hideIcon}>
  {@render children()}
</p>

<style lang="postcss">
  .icon-hidden {
    &:before {
      display: none;
    }
  }
</style>

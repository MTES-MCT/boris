<script lang="ts">
  import '@gouvfr/dsfr/dist/component/badge/badge.min.css';

  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
    status?: 'success' | 'warning' | 'error' | 'info' | 'new';
  };

  const { children, status }: Props = $props();
</script>

<p class={`fr-badge ${status ? `fr-badge--${status}` : ''}`}>
  {@render children()}
</p>

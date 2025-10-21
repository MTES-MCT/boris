<script lang="ts">
  import type { Accent } from '$lib/utils/definitions';
  import '@gouvfr/dsfr/dist/component/badge/badge.min.css';

  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
    status?: 'success' | 'warning' | 'error' | 'info' | 'new' | 'default';
    accent?: Accent;
    hideIcon?: boolean;
    uppercase?: boolean;
  };

  const {
    children,
    status,
    accent,
    hideIcon = false,
    uppercase = true,
  }: Props = $props();

  const variant = $derived(status || accent);
</script>

<p
  class={`fr-badge ${variant ? `fr-badge--${variant}` : ''}`}
  class:icon-hidden={hideIcon}
  class:fr-badge--uppercase={uppercase}>
  {@render children()}
</p>

<style lang="postcss">
  .fr-badge {
    text-transform: none;
  }

  .icon-hidden {
    &:before {
      display: none;
    }
  }

  .fr-badge--uppercase {
    text-transform: uppercase;
  }
</style>

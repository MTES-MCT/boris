<script lang="ts">
  import '@gouvfr/dsfr/dist/component/badge/badge.min.css';

  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
    status?: 'success' | 'warning' | 'error' | 'info' | 'new';
    hideIcon?: boolean;
    uppercase?: boolean;
    backgroundColor?: string;
    textColor?: string;
  };

  const {
    children,
    status,
    hideIcon = false,
    uppercase = true,
    backgroundColor,
    textColor,
  }: Props = $props();
</script>

<p
  class={`fr-badge ${status ? `fr-badge--${status}` : ''}`}
  class:icon-hidden={hideIcon}
  class:fr-badge--uppercase={uppercase}
  style={`${backgroundColor ? `background-color: ${backgroundColor};` : ''} ${textColor ? `color: ${textColor};` : ''}`}>
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

<script lang="ts">
  import type { Accent, Icon } from '$lib/utils/definitions';
  import '@gouvfr/dsfr/dist/component/badge/badge.min.css';

  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
    status?: 'success' | 'warning' | 'error' | 'info' | 'new' | 'default';
    accent?: Accent;
    icon?: Icon;
    normalCase?: boolean;
  };

  const {
    children,
    status,
    accent,
    icon,
    normalCase = false,
  }: Props = $props();

  const variant = $derived(status || accent);
</script>

<p
  class={`
    fr-badge
    ${variant ? `fr-badge--${variant}` : ''}
    ${icon ? `fr-icon-${icon} fr-badge--icon-left` : 'fr-badge--no-icon'}
  `}
  class:!normal-case={normalCase}>
  {@render children()}
</p>

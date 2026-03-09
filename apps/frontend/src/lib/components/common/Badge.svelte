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
    onClose?: () => void;
  };

  const {
    children,
    status,
    accent,
    icon,
    normalCase = false,
    onClose,
  }: Props = $props();

  const variant = $derived(status || accent);
</script>

{#if onClose}
  <div
    class={`
    fr-badge flex items-center gap-2
    ${variant ? `fr-badge--${variant}` : ''}
    ${icon ? `fr-icon-${icon} fr-badge--icon-left` : 'fr-badge--no-icon'}
  `}
    class:!normal-case={normalCase}>
    {@render children()}
    <button
      type="button"
      class="flext items-center justify-center"
      aria-label="Fermer"
      onclick={onClose}>
      <span class="fr-icon-close-line fr-icon--sm"></span>
    </button>
  </div>
{:else}
  <p
    class={`
    fr-badge
    ${variant ? `fr-badge--${variant}` : ''}
    ${icon ? `fr-icon-${icon} fr-badge--icon-left` : 'fr-badge--no-icon'}
  `}
    class:!normal-case={normalCase}>
    {@render children()}
  </p>
{/if}

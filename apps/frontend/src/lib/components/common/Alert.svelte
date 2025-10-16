<script lang="ts">
  import '@gouvfr/dsfr/dist/component/alert/alert.min.css';

  import { nanoid } from 'nanoid';
  import type { Snippet } from 'svelte';

  type Props = {
    id?: string;
    title?: string;
    children?: Snippet;
    type?: 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md';
  };

  const {
    id = nanoid(10),
    title,
    children,
    type,
    size = 'md',
  }: Props = $props();
</script>

<div
  class={`fr-alert fr-alert--${size} fr-alert--${type}`}
  {id}>
  {#if title}
    <h3 class="fr-alert__title">{title}</h3>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</div>

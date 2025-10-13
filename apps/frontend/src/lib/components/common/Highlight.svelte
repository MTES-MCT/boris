<script lang="ts">
  import '@gouvfr/dsfr/dist/component/highlight/highlight.min.css';

  import type { Accent, FontWeight } from '$lib/utils/definitions';
  import { nanoid } from 'nanoid';

  type Props = {
    text: string;
    id?: string;
    accent?: Accent;
    size?: 'sm' | 'md' | 'lg';
    icon?: string;
    fontWeight?: FontWeight;
    href?: string;
  };

  const {
    text,
    id = nanoid(10),
    accent = 'default',
    size = 'md',
    icon = '',
    fontWeight = 'normal',
    href,
  }: Props = $props();
</script>

<div
  {id}
  class={`
    fr-highlight
    ${accent && accent !== 'default' ? `fr-highlight--${accent}` : ''}
    fr-highlight--${size}`}>
  {#if icon}
    <span class={`fr-icon-${icon} fr-icon--${size}`}></span>
  {/if}
  <p class={`fr-text--${size} fr-text--${fontWeight} fr-mb-0`}>
    {text}
  </p>
  {#if href}
    <a
      class={`fr-link fr-text--${size}`}
      {href}
      target="_blank"
      rel="noopener noreferrer">
      En savoir plus
    </a>
  {/if}
</div>

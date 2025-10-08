<script lang="ts">
  import '@gouvfr/dsfr/dist/component/callout/callout.min.css';

  import type { Accent, FontWeight, Heading } from '$lib/utils/definitions';
  import { nanoid } from 'nanoid';

  type Props = {
    id?: string;
    title?: string;
    titleElement?: Heading;
    text?: string;
    accent?: Accent;
    hasIcon?: boolean;
    icon?: string;
    hasButton?: boolean;
    buttonLabel?: string;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
    fontWeight?: FontWeight;
  };

  const {
    id = nanoid(10),
    title,
    titleElement = 'h3',
    text,
    accent = 'default',
    hasIcon = false,
    icon = '',
    hasButton = false,
    buttonLabel = '',
    onClick,
    size = 'md',
    fontWeight = 'normal',
  }: Props = $props();
</script>

<div
  {id}
  class={`
    fr-callout
    fr-callout--${size}
    ${accent && accent !== 'default' ? `fr-callout--${accent}` : ''}`}>
  {#if icon}
    <span class={`fr-icon-${icon} fr-icon--${size}`}></span>
  {/if}
  {#if title}
    <svelte:element
      this={titleElement}
      class="fr-callout__title">
      {title}
    </svelte:element>
  {/if}
  {#if text}
    <p class="fr-callout__text fr-text--{size} fr-text--{fontWeight}">
      {text}
    </p>
  {/if}
  {#if hasButton && buttonLabel}
    <button
      type="button"
      class="fr-btn"
      onclick={onClick}>
      {buttonLabel}
    </button>
  {/if}
</div>

<style lang="postcss">
  .fr-callout--sm {
    @media (min-width: 48em) {
      padding: 1.5rem;
    }
  }

  .fr-callout--md {
    @media (min-width: 48em) {
      padding: 2rem;
    }
  }
</style>

<script lang="ts">
  import '@gouvfr/dsfr/dist/component/callout/callout.min.css';

  import type { Heading } from '$lib/utils/definitions';
  import { nanoid } from 'nanoid';

  type Props = {
    id?: string;
    title?: string;
    titleElement?: Heading;
    text?: string;
    accent:
      | 'default'
      | 'green-tilleul-verveine'
      | 'green-bourgeon'
      | 'green-emeraude'
      | 'green-menthe'
      | 'green-archipel'
      | 'blue-ecume'
      | 'blue-cumulus'
      | 'purple-glycine'
      | 'pink-macaron'
      | 'pink-tuile'
      | 'yellow-tournesol'
      | 'yellow-moutarde'
      | 'orange-terre-battue'
      | 'brown-cafe-creme'
      | 'brown-caramel'
      | 'brown-opera'
      | 'beige-gris-galet';
    hasIcon?: boolean;
    icon?: string;
    hasButton?: boolean;
    buttonLabel?: string;
    onClick?: () => void;
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
  }: Props = $props();
</script>

<div
  {id}
  class={`fr-callout ${hasIcon && icon ? `fr-icon-${icon}` : ''} ${accent && accent !== 'default' ? `fr-callout--${accent}` : ''}`}>
  {#if title}
    <svelte:element
      this={titleElement}
      class="fr-callout__title">
      {title}
    </svelte:element>
  {/if}
  {#if text}
    <p class="fr-callout__text">
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

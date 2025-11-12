<script lang="ts">
  import '@gouvfr/dsfr/dist/component/card/card.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons-editor/icons-editor.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';

  import Image from '$components/common/Image.svelte';

  type Props = {
    title: string;
    content: string;
    imgSrc: string;
    photograph?: string;
    linkLabel: string;
    href: string;
    id?: string;
    style?: string;
    reversed?: boolean;
  };

  const {
    title,
    content,
    imgSrc,
    photograph = '',
    linkLabel,
    href,
    reversed = false,
    id,
  }: Props = $props();
</script>

<div
  {id}
  class="fr-card fr-enlarge-link fr-card--horizontal fr-card--horizontal-half fr-card--no-border !bg-transparent"
  class:md:!flex-row-reverse={reversed}
  class:reversed>
  <div
    class={`
      fr-card__body !h-auto bg-white
      ${!reversed ? `items-end rounded-bl-xl md:rounded-bl-none` : `rounded-br-xl md:rounded-br-none !items-start`}
    `}>
    <div class="fr-card__content !order-0">
      <h3 class="fr-card__title">
        <a
          {href}
          class="after:!hidden">
          {title}
        </a>
      </h3>
      <p class="fr-card__desc">{content}</p>
    </div>
    <span
      class="text-blue-primary text-sm md:text-base fr-mb-4w underline underline-offset-6">
      {linkLabel}
      <span
        class="fr-icon-arrow-right-line fr-icon--sm"
        aria-hidden="true">
      </span>
    </span>
  </div>
  <div
    class={`
      fr-card__header overflow-hidden
      ${!reversed ? `md:rounded-bl-xl` : `md:rounded-br-xl`}
    `}>
    <div class="fr-card__img">
      <Image
        image={imgSrc}
        {photograph}
        photographPosition={reversed ? 'bottom-left' : 'bottom-right'} />
    </div>
  </div>
</div>

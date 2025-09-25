<script lang="ts">
  import '@gouvfr/dsfr/dist/component/card/card.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons-editor/icons-editor.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';

  import Img from '@zerodevx/svelte-img';
  import Photograph from '$components/common/Photograph.svelte';

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
  class="fr-card fr-enlarge-link fr-card--horizontal fr-card--horizontal-half fr-card--no-border"
  class:reversed>
  <div class="fr-card__body">
    <div class="fr-card__content">
      <h3 class="fr-card__title">
        <a {href}>
          {title}
        </a>
      </h3>
      <p class="fr-card__desc">{content}</p>
    </div>
    <span class="cta color-blue-primary">
      {linkLabel}
      <span
        class="fr-icon-arrow-right-line"
        aria-hidden="true">
      </span>
    </span>
  </div>
  <div class="fr-card__header">
    <div class="fr-card__img">
      <Img
        class="fr-responsive-img"
        src={imgSrc}
        alt="" />
      {#if photograph}
        <Photograph
          position={reversed ? 'bottom-left' : 'bottom-right'}
          {photograph} />
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .fr-card {
    background-color: transparent;

    .fr-card__body {
      overflow: hidden;
      border-bottom-left-radius: var(--border-radius-md);
    }

    &.reversed {
      flex-direction: column;

      .fr-card__body {
        align-items: flex-start;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: var(--border-radius-md);
      }

      @media (--sm-viewport) {
        flex-direction: row-reverse;
      }
    }

    .fr-card__title {
      a::after {
        display: none;
      }
    }
  }

  .fr-card__body {
    height: auto;
    align-items: flex-end;
    background-color: white;

    .fr-card__content {
      order: 0;
    }
  }

  .cta {
    position: relative;
    margin-block-end: 2rem;
    font-size: 0.875rem;
    font-weight: 400;
    text-decoration: underline;

    span {
      &::before {
        --icon-size: 1rem;
      }
    }
  }

  @media (--sm-viewport) {
    .fr-card {
      .fr-card__header {
        overflow: hidden;
        border-bottom-left-radius: var(--border-radius-md);
      }

      .fr-card__body {
        border-bottom-left-radius: 0;
      }

      &.reversed {
        .fr-card__header {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: var(--border-radius-md);
        }

        .fr-card__body {
          border-bottom-right-radius: 0;
        }
      }
    }
  }

  @media (--md-viewport) {
    .cta {
      font-size: 1rem;

      span {
        &::before {
          --icon-size: 1.5rem;
        }
      }
    }
  }
</style>

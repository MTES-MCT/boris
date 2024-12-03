<script lang="ts">
  import type { Props } from './definitions';

  const {
    title,
    content,
    imgSrc,
    photographer = '',
    linkLabel,
    href,
    style = '',
    reversed = false,
    id,
  }: Props = $props();
</script>

<div
  {style}
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
    <span class="cta">
      {linkLabel}
      <span
        class="fr-icon-arrow-right-line"
        aria-hidden="true">
      </span>
    </span>
  </div>
  <div class="fr-card__header">
    <div class="fr-card__img">
      <img
        class="fr-responsive-img"
        src={imgSrc}
        alt="" />
      {#if photographer}
        <span>Photo par {photographer}</span>
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .fr-card {
    overflow: hidden;

    &.reversed {
      flex-direction: column;

      .fr-card__body {
        align-items: flex-start;
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
    color: var(--color-blue-primary);
    text-decoration: underline;

    span {
      &::before {
        --icon-size: 1rem;
      }
    }
  }

  .fr-card__img {
    span {
      position: absolute;
      bottom: var(--1w);
      left: var(--1w);
      font-size: 0.75rem;
      color: black;
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

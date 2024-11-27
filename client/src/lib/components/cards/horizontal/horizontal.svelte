<script lang="ts">
  import type { Props } from './definitions';

  const { title, content, imgSrc, linkLabel, href }: Props = $props();
</script>

<div
  class="fr-card fr-enlarge-link fr-card--horizontal fr-card--horizontal-half">
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
    </div>
  </div>
</div>

<style lang="postcss">
  .fr-card.fr-enlarge-link {
    .fr-card__title {
      a::after {
        display: none;
      }
    }
  }

  .fr-card__body {
    height: auto;
    align-items: flex-end;

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

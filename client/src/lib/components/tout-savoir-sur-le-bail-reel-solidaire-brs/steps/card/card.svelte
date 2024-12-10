<script lang="ts">
  import type { Props } from '$components/tout-savoir-sur-le-bail-reel-solidaire-brs/steps/card/definitions';

  export const {
    illustration,
    title,
    content,
    href,
    linkLabel,
    position,
  }: Props = $props();
</script>

<article class={`step-${position}`}>
  <div
    class="fr-hidden fr-unhidden-lg column"
    style="background: blue;">
  </div>
  <div
    class="column"
    style="background: red;">
    <div class="illustration">
      {@html illustration}
    </div>
    <div class="content">
      <div class="position">
        <span><b>{position}</b></span>
      </div>
      <div class="text fr-ml-2w">
        <h3 class="fr-mb-0">
          {title}
        </h3>
        <p>{content}</p>
        <a
          class="fr-link fr-icon-arrow-right-line fr-link--icon-right"
          {href}>
          {linkLabel}
        </a>
      </div>
    </div>
  </div>
</article>

<style lang="postcss">
  article {
    --illustration-max-height: 150px;
    max-width: 500px;
    margin: 0 auto;
    display: block;

    h3 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.875rem;
      margin-block-end: var(--5w);
    }

    a {
      font-size: 0.875rem;
    }

    .illustration {
      display: flex;
      justify-content: center;

      :global(svg) {
        max-height: var(--illustration-max-height);
      }
    }

    .content {
      position: relative;
      display: flex;
      align-items: center;

      .position {
        width: var(--5w);
        height: var(--5w);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        border: solid 2px var(--color-blue-primary);
        color: var(--color-blue-primary);

        &::before,
        &::after {
          content: '';
          position: absolute;
          background-color: var(--color-blue-primary);
          width: var(--path-thickness);
        }

        &::before {
          top: calc(-1 * (var(--illustration-max-height) + var(--10w)));
          left: 18px;
          height: calc(
            50% - 20px + var(--illustration-max-height) + var(--10w)
          );
        }

        &::after {
          bottom: 0;
          left: 18px;
          height: calc(50% - 20px);
        }
      }

      .text {
        flex: 1;
      }
    }
  }

  @media (--md-viewport) {
    article {
      margin: 0;
      max-width: 100%;
      display: flex;
      justify-content: center;

      .column {
        width: 50%;
        max-width: 500px;
      }

      .content {
        .position {
          width: var(--8w);
          height: var(--8w);
          border-radius: var(--4w);
          border: solid 4px var(--color-blue-primary);
        }
      }
    }

    .step-1,
    .step-3,
    .step-5 {
      justify-self: flex-end;
    }

    .step-2,
    .step-4 {
      flex-direction: row-reverse;

      .content {
        flex-direction: row-reverse;

        .position {
          &::before,
          &::after {
            left: calc(100% - 18px);
          }
        }
      }
    }
  }
</style>

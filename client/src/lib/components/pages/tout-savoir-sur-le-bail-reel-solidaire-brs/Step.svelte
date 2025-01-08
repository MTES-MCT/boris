<script lang="ts">
  import { default as EndOfPath } from '$assets/icons/end-of-path.svg?raw';

  type Props = {
    illustration: string;
    title: string;
    content: string;
    href: string;
    linkLabel: string;
    position: number;
    isLast: boolean;
  };

  export const {
    illustration,
    title,
    content,
    href,
    linkLabel,
    position,
    isLast,
  }: Props = $props();
</script>

<article class={`step-${position}`}>
  <div class="fr-hidden fr-unhidden-lg column"></div>
  <div class="column">
    <div class="column-container">
      <div class="illustration">
        {@html illustration}
      </div>
      <div class="content">
        <div class="position color-blue-primary">
          <span><b>{position}</b></span>
        </div>
        <div class="text">
          <h3 class="fr-mb-0">
            {title}
          </h3>
          <p>{content}</p>
          <a
            rel="noopener"
            class="fr-link fr-icon-arrow-right-line fr-link--icon-right"
            {href}>
            {linkLabel}
          </a>
        </div>
      </div>
    </div>
  </div>

  {#if isLast}
    <div class="end-of-path">
      {@html EndOfPath}
    </div>
  {/if}
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
      margin-block-end: var(--3w);
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
        position: relative;
        flex: 1;
        margin-inline-start: var(--3w);
        padding-block-start: var(--3w);
      }
    }

    .end-of-path {
      margin-top: var(--2w);
      margin-left: 3px;
    }
  }

  @media (--md-viewport) {
    article {
      --illustration-max-height: 162px;
      position: relative;
      margin: 0;
      max-width: 100%;
      display: flex;
      justify-content: center;

      p {
        margin-block-end: var(--5w);
      }

      .illustration {
        justify-content: flex-start;
      }

      .column {
        &:nth-child(1) {
          width: calc(50% - 32px);
        }

        &:nth-child(2) {
          width: calc(50% + 32px);
          display: flex;
          flex-direction: column;
        }

        .column-container {
          max-width: 500px;
        }
      }

      .content {
        .position {
          width: var(--8w);
          height: var(--8w);
          border-radius: var(--4w);

          &::before {
            top: calc(-1 * (var(--illustration-max-height)));
            height: calc(50% - 32px + var(--illustration-max-height));
          }

          &::after {
            bottom: 0;
            height: calc(50% - 32px);
          }
        }
      }

      .end-of-path {
        position: absolute;
        bottom: calc(-1 * var(--7w));
        margin-left: 1px;
      }
    }

    .step-1 {
      .content {
        .position {
          &::before {
            top: calc(-1 * (var(--illustration-max-height) + var(--15w)));
            height: calc(
              50% - 32px + var(--illustration-max-height) + var(--15w)
            );
          }
        }
      }
    }

    .step-1,
    .step-3,
    .step-5 {
      justify-self: flex-end;

      .illustration {
        margin-inline-start: var(--16w);
      }

      .content {
        .position {
          &::before,
          &::after {
            left: 30px;
            left: 30px;
          }
        }

        .text {
          margin-inline-start: var(--10w);

          &::after {
            content: '';
            position: absolute;
            top: calc(50% - 1px);
            left: calc(-1 * var(--10w));
            width: calc(var(--10w) - var(--2w));
            height: 2px;
            background-color: var(--color-blue-primary);
          }
        }
      }
    }

    .step-2,
    .step-4 {
      flex-direction: row-reverse;

      .column {
        &:nth-child(2) {
          align-items: flex-end;
        }
      }

      .content {
        flex-direction: row-reverse;

        .position {
          &::before,
          &::after {
            left: calc(100% - 34px);
          }
        }

        .text {
          margin-inline-end: var(--10w);

          &::after {
            content: '';
            position: absolute;
            top: calc(50% - 1px);
            right: calc(-1 * var(--10w));
            width: calc(var(--10w) - var(--2w));
            height: 2px;
            background-color: var(--color-blue-primary);
          }
        }
      }
    }
  }
</style>

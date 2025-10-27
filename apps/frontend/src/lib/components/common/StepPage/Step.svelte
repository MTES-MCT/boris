<script lang="ts">
  import { default as EndOfPath } from '$assets/icons/end-of-path.svg?raw';
  import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';
  import type { Snippet } from 'svelte';

  type Props = {
    title: string;
    children: Snippet;
    position: number;
    isLast: boolean;
    large: boolean;
    href: string;
    linkLabel?: string;
    illustration?: string;
  };

  export const {
    title,
    children,
    position,
    isLast,
    href,
    linkLabel = undefined,
    illustration = undefined,
  }: Props = $props();
</script>

<article
  class={`step-${position} relative block fr-m-auto block md_flex`}
  style={!illustration ? `--illustration-max-height: 0px` : ``}>
  <div class="fr-hidden fr-unhidden-lg column"></div>

  <div class="column flex flex-column">
    <a
      class="background-none"
      rel="noopener"
      {href}>
      <div class="column-container">
        {#if illustration}
          <div class="illustration hidden md_visible flex justify-center">
            {@html illustration}
          </div>
        {/if}
        <div class="content relative flex align-center">
          <div
            class="position flex align-center justify-center color-blue-primary">
            <span><b>{position}</b></span>
          </div>
          <div class="text relative flex-1 fr-ml-3w fr-pt-3w fr-ml-md-10w">
            <h2>
              {title}
            </h2>
            {@render children()}
            <h3
              class="fr-link fr-icon-arrow-right-line fr-link--icon-right fr-text--regular underline">
              {linkLabel}
            </h3>
          </div>
        </div>
      </div>
    </a>
  </div>

  {#if isLast}
    <div class="end-of-path relative md_absolute fr-mt-2w fr-ml-1v">
      {@html EndOfPath}
    </div>
  {/if}
</article>

<style lang="postcss">
  article {
    --illustration-max-height: 1px;

    h3 {
      text-underline-offset: 5px;
    }

    .illustration {
      :global(svg) {
        max-height: var(--illustration-max-height);
      }
    }

    .position {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      border: solid 2px var(--color-blue-primary);

      &::before,
      &::after {
        content: '';
        position: absolute;
        background-color: var(--color-blue-primary);
        width: var(--path-thickness);
      }

      &::before {
        top: calc(-1 * (var(--illustration-max-height) + 5rem));
        left: 18px;
        height: calc(50% - 20px + var(--illustration-max-height) + 5rem);
      }

      &::after {
        bottom: 0;
        left: 18px;
        height: calc(50% - 20px);
      }
    }
  }

  @media (--md-viewport) {
    article {
      --illustration-max-height: 162px;

      .column:nth-child(1) {
        width: calc(50% - 2rem);
      }

      .column:nth-child(2) {
        width: calc(50% + 2rem);
      }

      .content {
        .position {
          width: 4rem;
          height: 4rem;

          &::before {
            top: calc(-1 * (var(--illustration-max-height)));
            height: calc(50% - 2rem + var(--illustration-max-height));
          }

          &::after {
            bottom: 0;
            height: calc(50% - 2rem);
          }
        }
      }

      .end-of-path {
        bottom: -3.5rem;
        left: calc(50% - 1.25rem);
      }
    }

    .step-1 {
      .content {
        .position {
          &::before {
            top: calc(-1 * (var(--illustration-max-height) + 7.5rem));
            height: calc(50% - 2rem + var(--illustration-max-height) + 7.5rem);
          }
        }
      }
    }

    .step-1,
    .step-3,
    .step-5 {
      justify-self: flex-end;

      .content {
        .position {
          &::before,
          &::after {
            left: 1.875rem;
            left: 1.875rem;
          }
        }

        .text {
          &::after {
            content: '';
            position: absolute;
            top: calc(50% - 1px);
            left: -5rem;
            width: 4rem;
            height: 2px;
            background-color: var(--color-blue-primary);
          }
        }
      }
    }

    .step-2,
    .step-4 {
      flex-direction: row-reverse;

      .column:nth-child(2) {
        align-items: flex-end;
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
          margin-inline-end: 5rem;

          &::after {
            content: '';
            position: absolute;
            top: calc(50% - 1px);
            right: -5rem;
            width: 4rem;
            height: 2px;
            background-color: var(--color-blue-primary);
          }
        }
      }
    }
  }
</style>

<script lang="ts">
  import { default as Star } from '$assets/icons/star.svg?raw';

  type Props = {
    title: string;
    promesses: string[];
  };

  const { title, promesses }: Props = $props();
</script>

<section class="fr-container promesse">
  <div class="content rounded-box-md background-color-white">
    <h2 class="color-blue-primary">{title}</h2>

    <div class="fr-grid-row fr-grid-row--gutters">
      {#each promesses as promess}
        <div class="fr-col-12 fr-col-lg-4 column">
          <div>
            {@html Star}
          </div>
          <div>
            {@html promess}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style lang="postcss">
  .promesse {
    position: relative;
    z-index: 10;
    max-width: 992px;

    .content {
      padding-block-start: var(--7w);
      padding-block-end: var(--3w);
      padding-inline: var(--2w);

      h2 {
        font-size: 1.5rem;
        text-align: center;
        margin-block-end: var(--6w);
      }
    }

    .column {
      display: flex;
      gap: var(--2w);

      :global(svg) {
        width: var(--4w);
        height: var(--4w);
      }
    }
  }

  @media (--md-viewport) {
    .promesse {
      .content {
        position: relative;
        padding-inline: var(--4w);
        transform-style: preserve-3d;

        h2 {
          font-size: 1.75rem;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: var(--8w);
          left: var(--10w);
          width: 100%;
          height: 100%;
          border: solid 3px var(--color-red-primary);
          border-radius: inherit;
          transform: translateZ(-1px);
        }

        .column {
          gap: var(--2w);
        }
      }
    }
  }
</style>

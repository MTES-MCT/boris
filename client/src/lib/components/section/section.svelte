<script lang="ts">
  import type { Props } from './definitions';

  const {
    title,
    children,
    titleElement = 'h2',
    backgroundClass = '',
  }: Props = $props();
</script>

<section class={`section ${backgroundClass}`}>
  <div class="fr-container">
    <div class="fr-col-12">
      <svelte:element this={titleElement}>{title}</svelte:element>

      {@render children()}
    </div>
  </div>
</section>

<style lang="postcss">
  :global(.section) {
    padding-block: var(--2w);

    &:nth-child(1) {
      padding-block-start: var(--4w);
    }

    &:nth-last-child(1) {
      padding-block-end: var(--4w);
    }

    @media (--sm-viewport) {
      padding-block: var(--4w);

      &:nth-child(1) {
        padding-block-start: var(--8w);
      }

      &:nth-last-child(1) {
        padding-block-end: var(--8w);
      }
    }
  }
</style>

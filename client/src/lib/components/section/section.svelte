<script lang="ts">
  import type { Props } from './definitions';

  const {
    title,
    children,
    titleElement = 'h2',
    backgroundClass = '',
  }: Props = $props();
</script>

<section class={backgroundClass}>
  <div class="fr-container fr-grid-row">
    <div class="fr-col fr-py-6w fr-py-md-12w">
      <svelte:element this={titleElement}>{title}</svelte:element>

      {@render children()}
    </div>
  </div>
</section>

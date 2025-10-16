<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<section
  class="fr-container"
  id="plafonds-de-ressources">
  <div class="wrapper">
    <div class="blue-overlay rounded-box-lg"></div>
    <div class="content rounded-box-lg background-color-white">
      {@render children()}
    </div>
  </div>
</section>

<style lang="postcss">
  .wrapper {
    position: relative;
    max-width: 588px;
    margin: var(--15w) auto var(--10w) auto;

    &::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: calc(50% - 2px);
      height: var(--15w);
      width: var(--path-thickness);
      background-color: var(--color-blue-primary);
    }
  }

  .content {
    padding: 24px;
    z-index: 2;
    position: relative;
  }

  @media (--sm-viewport) {
    .blue-overlay {
      width: 100%;
      max-width: 588px;
      height: 100%;
      position: absolute;
      bottom: var(--3w);
      right: var(--3w);
      background-color: var(--color-teal-light);
      z-index: 1;
    }
  }
</style>

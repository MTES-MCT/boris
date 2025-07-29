<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<div class="banner">
  <div class="content">
    <div class="fr-container">
      {@render children()}
    </div>
  </div>
</div>

<style lang="postcss">
  .banner {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: rgba(22, 22, 22, 0.64);
    display: flex;
    align-items: flex-end;
  }

  .content {
    width: 100%;
    background-color: white;
    padding-block: var(--2w);

    @media (--md-viewport) {
      padding-block: var(--5w);
    }
  }
</style>

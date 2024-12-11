<script lang="ts">
  import type { Props } from '$lib/components/photographer/definition';

  const { position, photographer }: Props = $props();
</script>

<span class={position}>
  Photo par {photographer}
</span>

<style lang="postcss">
  span {
    display: inherit;
    position: absolute;
    font-size: 0.75rem;
    background-color: rgba(255, 255, 255, 0.6);
    padding-inline: var(--1w);
  }

  .top-left {
    top: 0;
    left: 0;
  }

  .top-right {
    top: 0;
    right: 0;
  }

  .bottom-left {
    bottom: 0;
    left: 0;
  }

  .bottom-right {
    bottom: 0;
    right: 0;
  }
</style>

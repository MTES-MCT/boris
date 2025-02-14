<script lang="ts">
  type Props = {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    photograph: string;
  };

  const { position, photograph }: Props = $props();
</script>

<span class={position}>
  Photo par {photograph}
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

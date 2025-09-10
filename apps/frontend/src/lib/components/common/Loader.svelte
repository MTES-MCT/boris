<script lang="ts">
  type Props = {
    height?: number;
  };

  const { height = 240 }: Props = $props();
</script>

<div style={`height:${height}px;`}></div>

<style lang="postcss">
  @keyframes animated-gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  div {
    background: linear-gradient(
      90deg,
      var(--background-default-grey-active),
      var(--color-grey-default),
      var(--background-default-grey-active)
    );
    background-size: 300% 300%;
    animation: animated-gradient 1.5s ease infinite;
  }
</style>
